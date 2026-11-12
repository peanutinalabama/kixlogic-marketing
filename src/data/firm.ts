// Kixlogic the firm: HR services and consulting, direct-hire recruiting, AI-enabled applications.
// Everything here is a plain description of what we do. No client names, counts, results or
// figures until Charles supplies real ones (see the no-invented-claims rule for this site).

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
}

export const SERVICES: Offer[] = [
  {
    slug: 'direct-hire-recruiting',
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
    slug: 'ai-applications',
    name: 'AI-Enabled Applications',
    line: 'We design and build AI-enabled software for HR and business teams.',
    headline: 'Software that [does the busywork.]',
    intro:
      'We build AI-enabled applications that take repetitive work off HR and business teams: screening, scheduling, document handling, reporting and more. We have shipped our own products on the web, in Microsoft Office and on mobile, and we build to order.',
    sections: [
      {
        title: 'What we build',
        body: 'Focused tools that fit the way your team already works, with people kept in charge of every decision that matters.',
        points: [
          'Workflow tools that cut manual steps out of a recurring process.',
          'Assistants that draft, summarise and check documents for a person to approve.',
          'Integrations that move data between the systems you already use.',
        ],
      },
    ],
    cta: 'Talk to us about a build',
  },
];

export const INDUSTRIES: Offer[] = [
  {
    slug: 'information-technology',
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
