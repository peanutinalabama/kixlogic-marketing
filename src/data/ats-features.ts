// ATS feature cards from legacy marketing site
export type FeatureTag = 'starter' | 'growth' | 'professional';

export interface AtsFeature {
  icon: string;
  title: string;
  desc: string;
  tag: FeatureTag;
  wide?: boolean;
}

export const atsFeatures: AtsFeature[] = [
  { icon: '🤖', title: 'AI Resume Scoring', desc: 'Every applicant gets an instant AI score against your job\'s requirements. See a 1–5 star rating, percentage match, matched skills, and missing qualifications — all in seconds. Stop reading every resume manually.', tag: 'growth' },
  { icon: '🔍', title: 'Resume Search & AI Candidate Finder', desc: 'Search your entire applicant pool with keyword, job title, location, salary range, and date-applied filters. Or use natural language AI search — type "find me candidates with 5+ years manufacturing experience near Birmingham" and get ranked results with percentage-match scores.', tag: 'growth' },
  { icon: '📉', title: 'Advanced Analytics Dashboard', desc: 'Five built-in charts with live filters: Hiring Funnel, Applications Over Time, Source Effectiveness, Time-to-Hire by Role, and Pipeline Velocity. See where candidates stall, which sources produce hires, and how long your process actually takes — all without exporting a spreadsheet.', tag: 'growth' },
  { icon: '🏢', title: 'White-Label Careers Page', desc: 'A fully branded public careers page at your custom URL. Upload your logo, set brand colors, add footer links. Looks completely like your own product.', tag: 'starter' },
  { icon: '💼', title: 'Job Posting Management', desc: 'Rich text job descriptions with structured sections — Position Summary, Key Responsibilities, Qualifications, and more. Toggle sections on or off per posting.', tag: 'starter' },
  { icon: '🗂️', title: 'Pipeline & Kanban Board', desc: 'Drag-and-drop kanban pipeline with 8 built-in stages. Move candidates with a click or drag their card between columns. Manager Review and Rejected stages trigger automated email workflows.', tag: 'starter' },
  { icon: '📱', title: 'Mobile PWA for Candidates', desc: 'Candidates apply from their phones with a beautiful multi-step form. Installable to the home screen like a native app — no App Store needed.', tag: 'starter' },
  { icon: '✉️', title: 'Recruiter Invite System', desc: 'Invite recruiters by email. They verify their email with a 6-digit code, then set their own secure password. Full audit trail — every login and action is attributed to the right person.', tag: 'starter' },
  { icon: '🔔', title: 'Application Notifications', desc: 'Every recruiter on your account gets an instant email notification when a new application arrives — applicant name, position applied for, and a direct link to the dashboard.', tag: 'starter' },
  { icon: '📖', title: 'Built-In Setup Guide', desc: 'A comprehensive step-by-step setup guide lives right inside your dashboard. Covers email setup, branding, job postings, recruiter invites, careers page embedding, and every feature — with a live checklist.', tag: 'starter' },
  { icon: '✨', title: 'AI Setup Assistant', desc: 'Growth plans and above include a conversational AI assistant built into the dashboard. Ask any question about configuring or using Kixlogic and get an instant, accurate answer — like having a support rep available 24/7.', tag: 'growth' },
  { icon: '💰', title: 'AI Salary Intelligence', desc: 'Enter a job title, US location, experience level, and industry — get instant AI-generated salary ranges with low, median, and high figures for hourly and annual pay. Nationwide US data.', tag: 'professional' },
  { icon: '✉️', title: 'Rejection Email Workflow', desc: 'After rejecting a candidate, choose from three professional pre-built templates or write your own in a rich text editor. Preview before sending. Every email is logged automatically in the applicant record.', tag: 'growth' },
  { icon: '📤', title: 'Forward to Hiring Manager', desc: 'Send a full application summary to the hiring manager in one click — name, contact, employment history, skills, and availability. The candidate\'s resume is automatically attached.', tag: 'growth' },
  { icon: '✨', title: 'AI Job Description Builder', desc: 'Type a job title, select your industry, and let AI write a complete professional job description in seconds — Position Summary, Key Responsibilities, Qualifications, Skills, and Physical Requirements all pre-filled and ready to edit.', tag: 'growth' },
  { icon: '✨', title: 'AI Resume Autofill', desc: 'Candidates upload their resume — PDF or Word — and AI instantly pre-fills their name, contact info, employment history, skills, and education level into the application form.', tag: 'starter' },
  { icon: '🌐', title: 'Talent Community', desc: 'Build a pipeline before you have openings. Candidates join your branded talent community by submitting their resume, selecting departments of interest, and opting in to job alerts.', tag: 'starter' },
  { icon: '📲', title: 'Employee Referral QR Code', desc: 'Generate a branded QR code for your employee referral portal in one click. Download it as a PNG and print it on break room posters, onboarding packets, or internal newsletters.', tag: 'growth' },
  { icon: '📝', title: 'Ad Hoc Custom Reporting', desc: 'Build any report you need from 130+ applicant fields. Apply filters by stage, job posting, or date range. Run instantly as a CSV download or schedule automatic daily, weekly, or monthly delivery straight to your inbox.', tag: 'professional' },
  { icon: '⚙️', title: '90+ Pre-Built Questions, Fully Customizable', desc: 'Built for high-volume hourly hiring. A library of 90+ professionally-worded questions across 12 categories. Toggle each question on or off per tenant, with separate question sets for hourly vs salaried roles.', tag: 'starter' },
  { icon: '🚫', title: 'Knockout Questions — Auto-Reject Unqualified Applicants', desc: 'Pick from 30 pre-built knockout templates — driver\'s license, lifting capacity, work authorization, certifications, and more. Failed applicants are auto-moved to Rejected with the reason logged.', tag: 'starter' },
  { icon: '🌐', title: 'Multi-Channel Job Distribution*', desc: 'Every open posting is automatically embedded with Schema.org JobPosting structured data and published as XML feeds ready for Indeed, ZipRecruiter, LinkedIn, and any aggregator that accepts standard XML.', tag: 'starter' },
  { icon: '🤝', title: 'Employee Referral Portal', desc: 'Share a branded referral link with your workforce. Employees submit candidates directly — the candidate receives a personalized invitation email with a direct apply link.', tag: 'growth' },
  { icon: '📅', title: 'Interview Scheduling & Calendar Invites', desc: 'Schedule interviews without leaving Kixlogic. Both the candidate and interviewer receive a branded confirmation email with an attached .ics calendar invite — compatible with Outlook, Google Calendar, and Apple Calendar.', tag: 'growth' },
  { icon: '📱', title: 'Applicant SMS Texting', desc: 'Stay in touch with candidates via text message. Send templated or custom SMS — interview invites, application status updates, offer notifications, and more. Professional plans include 2,000 SMS/month.', tag: 'professional' },
  { icon: '📣', title: 'Applicant Source Tracking', desc: 'During the application, candidates select how they heard about the job from 25+ options across five categories. Results appear in a full visual source report in your dashboard with export to CSV.', tag: 'starter' },
  { icon: '🔄', title: 'Job Lifecycle Management', desc: 'Clone a posting in one click, reopen closed roles, and close a req with a cascading disposition that handles every active candidate at once.', tag: 'growth' },
  { icon: '📄', title: 'Offer Letters & Onboarding Packets', desc: 'Upload and store your own offer letter templates and new-hire onboarding packets directly in Kixlogic. Merge candidate details into templates, send for internal approval, deliver to the candidate for e-signature.', tag: 'professional' },
  { icon: '💵', title: 'Scheduled Referral Payments', desc: 'Set up future-dated referral bonus payments when an employee-referred candidate is hired. Schedule payouts at the 30, 60, or 90-day mark — or any custom date.', tag: 'professional' },
  { icon: '🔐', title: 'Enterprise-Grade Account Security', desc: 'Passwords are hashed with PBKDF2-SHA512 (100,000 iterations). Failed login attempts are rate-limited and trigger automatic account lockout. Every authentication event is logged with user, IP, and timestamp.', tag: 'starter' },
  { icon: '🛡️', title: 'Administrator Activity Log', desc: 'Every significant action in your account — logins, applicant edits, pipeline changes, offer sends, configuration updates — is automatically logged with user, timestamp, and detail.', tag: 'professional' },
  {
    icon: '⚡',
    title: 'Set Up in Minutes. Hire Smarter Today.',
    desc: 'Kixlogic is a 100% cloud platform — sign up, brand it, and you\'re live in under 10 minutes. No IT department, no consultants, no migration project. Behind the clean interface sits a fully-customizable platform: 90+ application questions, 30 knockout question templates, configurable pipelines, branded careers pages, custom reports, AI scoring, offer letters, and onboarding — all tailored to fit your hiring process.',
    tag: 'starter',
    wide: true,
  },
];

export const tagLabels: Record<FeatureTag, string> = {
  starter: 'All Plans',
  growth: 'Growth+',
  professional: 'Professional+',
};

export const steps = [
  { num: '1', title: 'Sign up', desc: 'Create your account and start a 14-day free trial. Card required — cancel before it ends and pay nothing.' },
  { num: '2', title: 'Brand it', desc: 'Upload your logo, set your colors, and your careers page is live instantly — in the cloud, no software needed.' },
  { num: '3', title: 'Post jobs', desc: 'Create your first job posting. Use the AI builder to write a full description in seconds, then publish.' },
  { num: '4', title: 'Start hiring', desc: 'Applications come in, AI scores them, you review the best. Your built-in Setup Guide walks you through every step.' },
];
