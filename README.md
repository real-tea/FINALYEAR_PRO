![Hashdocs OG](https://github.com/hashdocs/hashdocs/assets/62215539/cec6eae6-c9b0-4c2e-a8c5-cbcb5053918c)

---

[Hashdocs](https://hashdocs.org) is an open source Docsend alternative. We're building a more feature-rich secure document sharing and data room platform.

Sharing sensitive documents as attachments is risky and arcane. Attachments get forwarded all the time:

- You can't see and control who has access to your documents
- You can't track how long they spend on each page
- You can't revoke access to your documents
- You can't update your documents once they're sent


## Features

- [x] Powerful link controls - _control access to your documents with custom links_
  - [x] Capture user emails and details prior to view
  - [x] Verify emails with additional-factor authentication
  - [x] Restrict emails to select domains or email addresses (e.g. ONLY for hooli.com)
  - [x] Password authentication
  - [x] Expiry settings for links
  - [x] Enable / Disable downloads


- [x] Advanced tracking and analytics - _prevent unauthorized downloads, printing or saving as images_
  - [x] Track completion % and time spent across pages for each visit
  - [x] Prevent bot / document scraper access
  - [x] Geo location, device and IP address tracking
  - [ ] Domain blacklists
  - [ ] Aggregate view analytics 
  - [ ] Detailed access logs

- [x] Secure document viewer
  - [x] Secure PDF viewer to prevent unauthorized downloads, printing or saving as images
  - [ ] Contact author, book a meeting settings
  - [ ] Custom watermarks
  - [ ] White-labelled datarooms with organization branding and logo

- [x] Misc settings
  - [x] Login with google
  - [ ] Team management
  - [ ] Organization branding for console and data rooms
  - [ ] Self-hosting options

## Tech stack

Hashdocs is built entirely on open source tools. We’re deeply grateful to the contributors and maintainers of these tools for their incredible work. And we hope we can pay it forward

**Architecture**

- [Supabase](https://supabase.com/) is an open-source Firebase alternative with an incredible feature-rich backend-as-a-service. We use Supabase for our database, authentication, edge functions and storage
- [NextJS](https://nextjs.org) is a React framework that provides hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more. We use NextJS 13 (App router) for our frontend, hosted on [Vercel](https://vercel.com)
