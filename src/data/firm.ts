// Kixlogic the firm: custom AI apps designed and built around each customer's need, Seekapedia public-data APIs, and HR and recruiting services in the background.
// Everything here is a plain description of what we do. No client names, counts, results or
// figures until Charles supplies real ones (see the no-invented-claims rule for this site).

export type IconName = 'search' | 'people' | 'spark' | 'globe' | 'code' | 'gear' | 'flask' | 'chart' | 'pulse';

/** Sized Unsplash image URL. */
export const photoUrl = (id: string, w: number, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=${w}${h ? `&h=${h}` : ''}`;

export interface Offer {
  slug: string;
  name: string;
  /** Short line for cards and menus. */
  line: string;
  /** Uppercase headline; the words inside [brackets] get the yellow highlight. */
  headline: string;
  intro: string;
  sections: { title: string; body: string; points?: string[] }[];
  cta: string;
  /** Unsplash photo id (free Unsplash licence, served from images.unsplash.com). */
  photo: string;
  photoAlt: string;
  icon: IconName;
}

export const SERVICES: Offer[] = [
  {
    slug: 'ai-applications',
    photo: '1607799279861-4dd421887fb3',
    photoAlt: 'A laptop screen showing application code',
    icon: 'spark',
    name: 'AI App Building & Design',
    line: 'A custom AI app, designed around how your business works and built to your need.',
    headline: 'Your problem, [built as an app.]',
    intro:
      'Tell us which process is slowing your business down. We design an AI-powered app around it, show you what it will look like before we build it, and then build it where your people already work: on the web, inside Microsoft Office or on a phone.',
    sections: [
      {
        title: 'How a build works',
        body: 'Every project starts from the need, not from a template, and design comes before code.',
        points: [
          'Listen: we watch the work, ask who does what today, and write the problem down in plain language you can check.',
          'Design: you get screens and flows you can click through before anything is built, so changes are cheap.',
          'Build: we make a working version early, you try it on real tasks, and we adjust it with you.',
          'Check: wherever the AI drafts, scores or decides something, we design in the step where a person reviews it.',
          'Launch: we ship it, train your people, and stay on to fix and improve it.',
        ],
      },
      {
        title: 'What we build',
        body: 'Focused apps that fit the way your team already works:',
        points: [
          'Assistants that read, draft, summarize and check documents for a person to approve.',
          'Intake, screening, scheduling and reporting tools that remove manual steps from a recurring process.',
          'Apps that answer questions from your own data and files.',
          'Add-ins for Microsoft Word, Excel and PowerPoint, web apps for the browser, and mobile apps.',
        ],
      },
      {
        title: 'What you get',
        body: 'A scope and price agreed in writing before work starts, one team to talk to from first call to launch, and an app that is yours to run. We have built our own products on the web, in Microsoft Office and on mobile, and we build to order for other businesses.',
      },
    ],
    cta: 'Start a project',
  },
  {
    slug: 'workflow-automation',
    photo: '1758691737278-3af15b37af48',
    photoAlt: 'Two colleagues talking through a piece of work in a modern office',
    icon: 'gear',
    name: 'Workflow Automation',
    line: 'Connect AI to the tools you already use and take repetitive work off your team.',
    headline: 'Less busywork, [same tools.]',
    intro:
      'Not every problem needs a new app. Sometimes the answer is to connect the systems you already use, add AI where judgment helps, and take the repetitive steps off your team.',
    sections: [
      {
        title: 'Where it helps',
        body: 'Typical projects:',
        points: [
          'Moving data between the systems your team re-types it into today.',
          'Reading incoming documents and emails, sorting them and drafting the reply or the record.',
          'Recurring reports, reminders and hand-offs that depend on one person remembering.',
          'Checks that catch missing or inconsistent information before it causes a problem.',
        ],
      },
      {
        title: 'How we work',
        body: 'We map the process with the people who run it, agree what to automate and what to leave to a person, and build the smallest version that proves it works. People stay in charge of the decisions that matter, and every automated step is logged so you can see what happened.',
      },
    ],
    cta: 'Talk to us about automation',
  },
  {
    slug: 'direct-hire-recruiting',
    photo: '1698047682091-782b1e5c6536',
    photoAlt: 'A recruiter shaking hands with a candidate across a table',
    icon: 'search',
    name: 'Direct Hire Recruiting',
    line: 'Permanent hires for IT, engineering and life science roles. You pay only when you hire.',
    headline: 'The right hire, [not just a résumé.]',
    intro:
      'We run direct-hire searches for permanent roles in IT, engineering and the life sciences. We work on contingency: there is no fee unless you hire someone we introduced.',
    sections: [
      {
        title: 'How a search works',
        body: 'Every search follows the same steps, so you always know where it stands.',
        points: [
          'Intake: we agree the role, the must-haves, the pay range and the timeline with the hiring manager.',
          'Search: we look beyond job-board applicants, including people who are not actively looking.',
          'Screening: we interview each candidate before you see them and tell you why they fit.',
          'Shortlist: you get a short list of qualified people, not a stack of résumés.',
          'Offer: we help with interviews, references and the offer, through to the start date.',
        ],
      },
      {
        title: 'What you can expect',
        body: 'A named recruiter who knows the field, regular updates, and candidates who have already agreed to talk to you about this role.',
      },
    ],
    cta: 'Start a search',
  },
  {
    slug: 'hr-consulting',
    photo: '1758518731706-be5d5230e5a5',
    photoAlt: 'An HR consultant in a meeting with a client team',
    icon: 'people',
    name: 'HR Consulting',
    line: 'Practical HR help for growing companies, from policies to compliance to the people processes in between.',
    headline: 'HR that [keeps up with you.]',
    intro:
      'We help growing companies put the right HR practices in place without building a large HR department first. We will add the specific areas we cover here soon.',
    sections: [
      {
        title: 'How we work',
        body: 'We start with a conversation about where you are and what is getting in the way, then agree a short, fixed piece of work with a clear result.',
      },
    ],
    cta: 'Talk to us about HR',
  },
  {
    slug: 'immigration-support',
    photo: '1767216427262-ce74ba565c3c',
    photoAlt: 'Passports from several countries held by different people',
    icon: 'globe',
    name: 'Immigration Processing Support',
    line: 'HR-side visa support for the people you hire, with filings handled by our immigration attorneys.',
    headline: 'Global talent, [without the paperwork.]',
    intro:
      'We are experts in the HR side of immigration. When you hire someone who needs a work visa or green card, we run the process with you and work alongside our immigration attorneys, who prepare and file the petitions, so your team does not have to.',
    sections: [
      {
        title: 'What we take off your plate',
        body: 'Sponsoring an employee means a long trail of HR work around the legal filing. We handle it end to end.',
        points: [
          'Flagging sponsorship needs early, at the offer stage, and bringing in our attorneys.',
          'Gathering the documents and details needed from you and from the employee.',
          'Preparing the job, wage and position information the petition depends on.',
          'Tracking deadlines, renewals and status expirations so nothing lapses.',
          'Keeping I-9 and HR records for sponsored employees in order.',
          'Keeping the employee informed, so they can focus on the new job.',
        ],
      },
      {
        title: 'Who does what',
        body: 'Legal advice and filings come from licensed immigration attorneys we work with. We handle the HR work around them: the coordination, the paperwork and the follow-through. You get one point of contact for the whole process.',
      },
    ],
    cta: 'Talk to us about a visa',
  },
];

export const INDUSTRIES: Offer[] = [
  {
    slug: 'information-technology',
    photo: '1758873268745-dd2cf0d677b5',
    photoAlt: 'A technology team working together around a computer',
    icon: 'code',
    name: 'Information Technology',
    line: 'Software, infrastructure, data and security roles.',
    headline: 'Technology talent [for what you are building.]',
    intro: 'We recruit permanent technology staff for companies of every size, from a first engineering hire to a growing team.',
    sections: [
      {
        title: 'Roles we fill',
        body: 'Typical searches include:',
        points: ['Software engineers and engineering managers', 'Cloud, infrastructure and DevOps engineers', 'Data engineers, analysts and data scientists', 'Security engineers and analysts', 'IT managers and systems administrators'],
      },
    ],
    cta: 'Start an IT search',
  },
  {
    slug: 'engineering',
    photo: '1581091226825-a6a2a5aee158',
    photoAlt: 'An engineer working with equipment in a technical workshop',
    icon: 'gear',
    name: 'Engineering',
    line: 'Mechanical, electrical, manufacturing and quality roles.',
    headline: 'Engineers who [make it work.]',
    intro: 'We recruit permanent engineering staff for manufacturers and technical companies.',
    sections: [
      {
        title: 'Roles we fill',
        body: 'Typical searches include:',
        points: ['Mechanical and electrical engineers', 'Manufacturing and process engineers', 'Quality engineers and quality managers', 'Controls and automation engineers', 'Engineering managers and plant leadership'],
      },
    ],
    cta: 'Start an engineering search',
  },
  {
    slug: 'life-sciences',
    photo: '1630959305790-4c956ce6c0b6',
    photoAlt: 'A scientist looking through a microscope in a laboratory',
    icon: 'flask',
    name: 'Life Sciences',
    line: 'Research, clinical, regulatory and quality roles in biotech, pharma and medical devices.',
    headline: 'Scientists for [the work that matters.]',
    intro: 'We recruit permanent staff for biotech, pharmaceutical, medical device and research organisations.',
    sections: [
      {
        title: 'Roles we fill',
        body: 'Typical searches include:',
        points: ['Research scientists and lab leadership', 'Clinical operations and clinical research staff', 'Regulatory affairs specialists', 'Quality assurance and quality control', 'Process development and manufacturing science'],
      },
    ],
    cta: 'Start a life sciences search',
  },
];

/** The services shown first and largest: what Kixlogic builds. The rest are the people services, shown after them. */
export const CORE_SERVICE_SLUGS = ['ai-applications', 'workflow-automation'];
export const CORE_SERVICES = SERVICES.filter((s) => CORE_SERVICE_SLUGS.includes(s.slug));
export const ALSO_SERVICES = SERVICES.filter((s) => !CORE_SERVICE_SLUGS.includes(s.slug));

export const findService = (slug: string) => SERVICES.find((s) => s.slug === slug);
export const findIndustry = (slug: string) => INDUSTRIES.find((s) => s.slug === slug);

/** Splits a headline into plain and [highlighted] parts. */
export function headlineParts(h: string): { text: string; mark: boolean }[] {
  const out: { text: string; mark: boolean }[] = [];
  const re = /\[([^\]]+)\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(h))) {
    if (m.index > last) out.push({ text: h.slice(last, m.index), mark: false });
    out.push({ text: m[1], mark: true });
    last = m.index + m[0].length;
  }
  if (last < h.length) out.push({ text: h.slice(last), mark: false });
  return out;
}
