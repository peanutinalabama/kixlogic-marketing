# Kixlogic job feeds: Indeed and LinkedIn

Checked against Indeed's and LinkedIn's own documentation on 15 November 2026. Links to those pages are at the end.

## The two feed addresses

| Feed | Address | Format |
| --- | --- | --- |
| Indeed (ZipRecruiter and other boards read this format too) | https://kixlogic.com/careers/jobs.xml | Indeed XML feed |
| LinkedIn | https://kixlogic.com/careers/linkedin.xml | LinkedIn Basic Jobs XML feed |

Both feeds list the same roles as https://kixlogic.com/careers/ and update on their own whenever you publish, change or close a requisition in Command. Each one is also linked from the careers page, so a board's crawler can find it.

What goes in them:

- Only requisitions you switched to Publish in Command, that are open and not past their close date.
- The company is always "Kixlogic, LLC". A client name is never in either feed.
- Pay appears only when that requisition's "Show pay" switch is on.
- The Department field is left out of both feeds, because it can hold a client label.
- If Command cannot be reached, the feeds answer "try again later" (503) instead of an empty list, so no board removes your jobs because of a short outage.

## Two settings to fill in (your step)

Both boards ask for details only you have. Until they are filled in, the matching lines are simply left out of the feeds.

1. **A kixlogic.com email address for the feeds.** Indeed calls it `<email>` (tied to your Indeed employer account) and LinkedIn calls it `<posterEmail>` (LinkedIn says it must be a company domain address, used to check that the business is real). Note: this address is readable by anyone who opens the feed, so a shared address such as a careers inbox is a good choice.
2. **Your LinkedIn Company ID** (LinkedIn feed only). To find it: open your Kixlogic LinkedIn Page in Admin view, look at the web address, and copy the number right after `/company/`.

Send me both and I will put them in, or set them yourself as environment variables named `JOB_FEED_EMAIL` and `LINKEDIN_COMPANY_ID` on the kixlogic.com Cloudflare project. (They can also be typed into the top of the feed section in `src/lib/careers.js`.)

## Indeed: how to get the feed picked up

Please read this first: Indeed's help page for third-party recruiters says staffing, recruitment and placement companies may post jobs if they sponsor them, and the US is not one of the exceptions. So the feed will get your jobs onto Indeed, but they will only be seen when they are sponsored (paid per job, set in your Indeed dashboard).

Good news on the newer rule: Indeed's single-source feed policy (from 31 March 2026) only affects feeds from systems that have an Indeed integration. Indeed says feeds from systems without one, including home-grown systems, are not affected. Command is home-grown, so this rule does not block us.

Steps:

1. **Your step:** sign in to (or create) the Kixlogic Indeed employer account at https://employers.indeed.com. Use the same address you choose for `JOB_FEED_EMAIL`.
2. **Your step:** contact Indeed through the employer Help Center contact form (https://www.indeed.com/help/employers/contact/form) or your Indeed account rep. Say you are a staffing firm with your own XML job feed and give them:
   - the feed address: https://kixlogic.com/careers/jobs.xml
   - the company name: Kixlogic, LLC
   - the email on your Indeed employer account
3. Indeed reviews the feed. Once accepted, Indeed reads a feed address about four times a day (every six hours). Indeed may ask for corrections; send them to me and I will make them.
4. **Your step:** sponsor the jobs you want seen, in the Indeed employer dashboard. You choose the budget.

Things Indeed expects that are already handled: every job on the careers page is in the feed (Indeed does not accept partial feeds), descriptions match the job pages, filled or closed jobs drop out on their own, and fully remote jobs are marked "Fully remote" instead of being given a fake city.

## LinkedIn: how to get the feed picked up

Please read this first: LinkedIn's job listing guidelines for XML feeds say that a staffing agency or recruiter posting jobs for clients, where the employer name cannot be shown, is not eligible for the free Basic Jobs (formerly "Limited Listings") feed, and those jobs need paid promotion on LinkedIn. Because Kixlogic never names its clients, the free route is closed to us. The feed is still useful for the paid routes below, which post the jobs on the Kixlogic Page.

Your options, all needing your LinkedIn account:

1. **Job Wrapping with paid job slots (fits best).** If you buy LinkedIn job slots (through LinkedIn Recruiter), LinkedIn's Job Wrapping can copy jobs from your careers site or feed into those slots and keep them up to date at least every 24 hours. Set-up is done with the onboarding tool in your Recruiter settings, or through LinkedIn Support (Start Chat or Contact Us on the Job Wrapping help page). Give them the feed address https://kixlogic.com/careers/linkedin.xml and your Company ID.
2. **Promoted job posts.** Post or promote each job on LinkedIn by hand from the Kixlogic Page. No feed needed.
3. **Asking LinkedIn about Basic Jobs anyway.** LinkedIn's Basic Jobs program is run by its business development team and is mainly for job sites and ATS companies. To ask for an evaluation you email LL-BD@linkedin.com with: your average number of open listings per day, the markets the jobs are in (United States), your search results page (https://kixlogic.com/careers/) and sample job addresses (any https://kixlogic.com/careers/... page). Given the staffing rule above, expect them to point you to paid promotion.

Notes for whichever route you take:

- LinkedIn needs the Company ID and a company-domain poster email in every job (see "Two settings" above).
- LinkedIn's guide describes the apply link as starting with "https://www". Our Apply links go straight to the application at https://app.kixlogic.com/command/apply/... (no redirects, which LinkedIn requires). If LinkedIn objects to that address, tell me and I will adjust it.
- LinkedIn rejects jobs with a description under 100 characters or an ID over 40 characters, so the feed leaves those out on its own. A very short posting will therefore show on kixlogic.com and Indeed but not in the LinkedIn feed.
- Job type and experience level are sent in LinkedIn's fixed codes. "Temporary" (no LinkedIn code) and the levels "Lead / principal" and "Manager" (no clean LinkedIn match) are left out rather than guessed. Everything else about the job is still in the description.

## Checking the feeds

From the `km-careers-live` folder, `npm run check:feeds` builds both feeds from sample jobs and checks that they are valid XML, never contain a client, and show pay only when it is switched on.

## Sources

- Indeed, XML feed reference: https://docs.indeed.com/sponsored-jobs-api/shared-resources/xml-job-feed-format
- Indeed, Single-source feed policy (effective 31 March 2026): https://www.indeed.com/help/employers/articles/single-source-feed-policy-effective-march-31-2026
- Indeed, Third-party recruiters and aggregators: https://www.indeed.com/help/employers/articles/360018069792
- LinkedIn, Overview of job posts using XML feeds: https://learn.microsoft.com/en-us/linkedin/talent/job-postings/xml-feeds
- LinkedIn, XML feeds development guide: https://learn.microsoft.com/en-us/linkedin/talent/job-postings/xml-feeds-development-guide
- LinkedIn, Third-party job listing and job site inclusion guidelines: https://learn.microsoft.com/en-us/linkedin/talent/job-postings/xml-feeds-job-posting-guidelines
- LinkedIn, Job Wrapping: https://www.linkedin.com/help/linkedin/answer/79037
- LinkedIn, Finding your Company ID: https://www.linkedin.com/help/linkedin/answer/a415420
