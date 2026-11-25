// The three applications Kixlogic builds, as shown on the home page and on /apps/.
// Every capability below was checked against the product's own source:
//   Kixlogic ATS     - the retired product page (git bc577fb^:src/pages/hired.astro), src/data/ats-features.ts,
//                      and the live app (kixlogic-site dashboard.html, apply.html, jobs.html).
//   Renumify         - src/pages/renumify.astro and renumify-site/site-src/pages-compensation.js.
//   Kixlogic Sourcer - kixlogic-command/worker/sourcer.js, sourcing.js, engsourcer.js.
// No prices, customers, counts, results or certifications. Every call to action goes to the Contact page.
import type { IconName } from './firm';

export interface AppInfo {
  /** Anchor id on /apps/. Old addresses in public/_redirects point at these. */
  slug: string;
  name: string;
  /** Eyebrow: what kind of product it is. */
  kind: string;
  /** Short line for the home-page card. */
  line: string;
  /** Uppercase headline; the words inside [brackets] get the yellow highlight. */
  headline: string;
  intro: string;
  problem: string;
  audience: string;
  capabilities: { title: string; body: string }[];
  steps: [string, string][];
  why: string;
  /** Optional plain note under the write-up (status, limits). */
  note?: string;
  icon: IconName;
}

export const APPS: AppInfo[] = [
  {
    slug: 'kixlogic-ats',
    name: 'Kixlogic ATS',
    kind: 'Applicant tracking',
    icon: 'people',
    line: 'Applicant tracking for growing employers. AI scores every applicant, and your whole pipeline lives in one place.',
    headline: 'Hire from a pipeline, [not an inbox.]',
    intro:
      'Kixlogic ATS is applicant tracking built for small and mid-sized employers. It scores every applicant against the job, keeps every candidate on one board, and gives you a careers page that looks like your own.',
    problem:
      'Most growing companies hire out of email and spreadsheets. Résumés pile up unread. Nobody is sure who moved to the next round. Good candidates hear nothing and take another offer.',
    audience:
      'Employers that hire regularly but do not have an enterprise IT budget, including high-volume hourly hiring. It runs in the browser, so there is nothing to install.',
    capabilities: [
      { title: 'AI resume scoring', body: 'Every applicant is scored against the job’s requirements, with the skills that match and the qualifications that are missing.' },
      { title: 'A visual pipeline', body: 'A drag-and-drop board shows every candidate by stage. Move people with a click.' },
      { title: 'Your own careers page', body: 'A branded careers page with your logo and colors, plus a talent community people can join before you have an opening.' },
      { title: 'Applications that screen themselves', body: 'Candidates apply from their phones. AI fills the form from their résumé, and knockout questions set aside applicants who miss a must-have, with the reason logged.' },
      { title: 'Jobs that get found', body: 'Open roles carry the structured data Google for Jobs reads, and publish as XML feeds for job boards and aggregators.' },
      { title: 'The busywork, handled', body: 'Write job descriptions with AI, schedule interviews with calendar invites, forward applications to hiring managers, run employee referrals, and send offer letters for e-signature.' },
      { title: 'Reports and an audit trail', body: 'See your hiring funnel, where applicants come from and how long each role takes to fill. Every significant action is logged with who did it and when.' },
    ],
    steps: [
      ['Brand it', 'Add your logo and colors. Your careers page is ready.'],
      ['Post jobs', 'Write the description yourself or let AI draft it, then publish.'],
      ['Review the best first', 'Applications arrive scored, so you start with the strongest fit.'],
      ['Move and hire', 'Interview, decide and send the offer from the same board.'],
    ],
    why: 'Your team spends its time on the best applicants instead of sorting the pile. Candidates get a fast application and a clear answer. You get real applicant tracking without an enterprise project.',
  },
  {
    slug: 'renumify',
    name: 'Renumify',
    kind: 'Compensation intelligence',
    icon: 'chart',
    line: 'Compensation intelligence. Market pay ranges, offer checks, pay equity and merit cycles in one place.',
    headline: 'Pay decisions [you can defend.]',
    intro:
      'Renumify helps owners and HR leaders decide what to pay. Check the market range for any role and location, test an offer before you send it, and see pay equity and compression across your team.',
    problem:
      'Pay decisions are high-stakes and usually made on guesswork. Fairness and compression are hard to see in a spreadsheet. Commission and incentive plans hide complexity that turns into payroll errors and disputes.',
    audience:
      'Growing businesses that need a defensible range before they post a role, make an offer or plan raises. Industry models cover healthcare, insurance, sales, real estate and restaurants, with a general model for any role.',
    capabilities: [
      { title: 'Market benchmarking', body: 'Salary ranges for any role and location, blended from job postings, company sites and BLS data.' },
      { title: 'Offer analysis', body: 'Find out whether an offer is competitive, with negotiation guidance, before it goes out.' },
      { title: 'Job descriptions', body: 'Generate a job description from your market search, edit it, and download it as Word or PDF.' },
      { title: 'Pay equity and compression', body: 'Pay equity, compression and compensation strategy reports to guide budgets and merit decisions.' },
      { title: 'Merit cycles', body: 'Run structured raise cycles with manager proposals and approvals.' },
      { title: 'Commission and earnings tools', body: 'A rules engine, deal and policy tracking, an earnings ledger and income forecasting. Bring your own data by CSV or quick entry.' },
    ],
    steps: [
      ['Pick a model', 'Start with General, or choose an industry model.'],
      ['Describe the role', 'Enter the title, the location and a few details.'],
      ['Get the analysis', 'See blended market ranges and guidance.'],
      ['Act on it', 'Build the job description, score the offer or plan the merit cycle.'],
    ],
    why: 'You go into every offer and every raise with a number you can explain. Fair pay becomes something you can see, not something you hope for.',
    note: 'Renumify is decision support. Compliance guidance in the app is informational only and is not legal advice.',
  },
  {
    slug: 'kixlogic-sourcer',
    name: 'Kixlogic Sourcer',
    kind: 'AI candidate sourcing',
    icon: 'search',
    line: 'Finds candidates by the work they have done: papers, grants, clinical trials, patents and code. Every result shows its evidence.',
    headline: 'Find people [by the work they do.]',
    intro:
      'Kixlogic Sourcer finds the people who are not applying. Describe the role and it searches public records of real work, then ranks each person with the evidence behind the rank.',
    problem:
      'The best people for specialist roles are rarely on job boards. A keyword search returns pages of hits and no proof that anyone fits. Recruiters lose days checking profiles by hand.',
    audience:
      'Recruiters and hiring teams filling scientific, engineering and IT roles, where the right candidate has a record of published, patented or shipped work.',
    capabilities: [
      { title: 'Start from the job', body: 'Paste a job description or describe the role in plain words. Sourcer turns it into filters you can review and edit.' },
      { title: 'Searches where the work is', body: 'Publications, preprints, research grants, clinical-trial investigators, researcher profiles, patents and, for software roles, GitHub.' },
      { title: 'Evidence on every result', body: 'Each person comes with where we found them and a link to it. Each rank lists the evidence behind it.' },
      { title: 'Contact details done carefully', body: 'Contact details come only from public records that publish them for contact, each with its source. Personal mailboxes are dropped.' },
      { title: 'Fair by design', body: 'Sourcer does not filter or rank people by age, gender, ethnicity, religion, nationality, marital status, disability, veteran status or school prestige. In IT and engineering searches, a filter that asks for one is refused.' },
      { title: 'Opt-outs respected', body: 'Anyone who has opted out is removed from results.' },
      { title: 'Outreach you approve', body: 'Sourcer drafts outreach that cites the evidence. Drafts stay drafts. Nothing is sent without a person.' },
    ],
    steps: [
      ['Describe', 'Paste the job description or type what you need.'],
      ['Refine', 'Check the skills, titles and locations Sourcer pulled out.'],
      ['Search and rank', 'Sourcer gathers evidence from each source and ranks the people it finds.'],
      ['Review and reach out', 'Open the evidence, shortlist the best and draft outreach.'],
    ],
    why: 'You reach qualified people who would never see your job post, and you know why each one is on the list. If a source cannot be reached, Sourcer says so instead of hiding it.',
  },
];
