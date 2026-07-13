import { OAuthClient } from './oauth.js';

function randomHex(bytes) {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function createOAuth(env) {
  if (!env.GITHUB_OAUTH_ID || !env.GITHUB_OAUTH_SECRET) {
    throw new Error('OAuth secrets not configured');
  }
  return new OAuthClient({
    id: env.GITHUB_OAUTH_ID,
    secret: env.GITHUB_OAUTH_SECRET,
    target: {
      tokenHost: 'https://github.com',
      tokenPath: '/login/oauth/access_token',
      authorizePath: '/login/oauth/authorize',
    },
  });
}

function callbackRedirectUri(hostname) {
  return `https://${hostname}/callback`;
}

async function handleAuth(url, env) {
  const provider = url.searchParams.get('provider');
  if (provider !== 'github') {
    return new Response('Invalid provider', { status: 400 });
  }

  try {
    const oauth2 = createOAuth(env);
    const authorizationUri = oauth2.authorizeURL({
      redirect_uri: callbackRedirectUri(url.hostname),
      scope: 'public_repo,user',
      state: randomHex(4),
    });

    return new Response(null, { headers: { Location: authorizationUri }, status: 302 });
  } catch (err) {
    return new Response(err.message || 'OAuth not configured', { status: 503 });
  }
}

function callbackScriptResponse(status, token) {
  return new Response(
    `<!DOCTYPE html><html><body><script>
const receiveMessage = (message) => {
  window.opener.postMessage(
    'authorization:github:${status}:${JSON.stringify({ token })}',
    '*'
  );
  window.removeEventListener('message', receiveMessage, false);
};
window.addEventListener('message', receiveMessage, false);
window.opener.postMessage('authorizing:github', '*');
</script>Authorizing Decap...</body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  );
}

async function handleCallback(url, env) {
  const code = url.searchParams.get('code');
  if (!code) {
    return new Response('Missing code', { status: 400 });
  }

  try {
    const oauth2 = createOAuth(env);
    const accessToken = await oauth2.getToken({
      code,
      redirect_uri: callbackRedirectUri(url.hostname),
    });
    return callbackScriptResponse('success', accessToken);
  } catch (err) {
    return callbackScriptResponse('error', err.message || 'token exchange failed');
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/auth') {
      return handleAuth(url, env);
    }
    if (url.pathname === '/callback') {
      return handleCallback(url, env);
    }

    return new Response('Kixlogic CMS OAuth proxy', { status: 200 });
  },
};
