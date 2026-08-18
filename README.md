<h1 align="center">JobApp <br> AI-assisted Job Application Tracking Workspace</h1>

<div align="center" id="badges">
  <a href="https://github.com/vikiru/job-search-tool/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-aqua" alt="MIT License Badge"/>
  </a>
  <a href="https://github.com/vikiru/job-search-tool/releases">
    <img src="https://img.shields.io/github/v/release/vikiru/job-search-tool" alt="Release"/>
  </a>
  <a href="https://github.com/vikiru/job-search-tool/issues?q=is%3Aissue+is%3Aclosed">
    <img src="https://img.shields.io/github/issues-closed/vikiru/job-search-tool" alt="Closed Issues"/>
  </a>
  <a href="https://github.com/vikiru/job-search-tool/pulls?q=is%3Apr+is%3Aclosed">
    <img src="https://img.shields.io/github/issues-pr-closed/vikiru/job-search-tool?label=closed%20prs" alt="Closed PRs"/>
  </a>
</div>

---

**JobApp** is an AI-powered job application tracker for managing applications across various stages of the application process using either a table or Kanban view.

Job applications can be added manually or with Gemini using a dedicated extraction prompt designed to remove unnecessary clutter from pasted job postings while preserving the original job description and extracting useful information such as keywords and skills, benefits, application instructions, and role metadata. Resumes can be uploaded as PDF files, with their text extracted server-side for AI-assisted analysis against a job description.

Key application statistics are available through the dashboard, and application data can be exported as CSV or JSON.

## 📖 Table of Contents

- [📖 Table of Contents](#-table-of-contents)
- [🌟 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📝 Prerequisites](#-prerequisites)
- [⚡ Setup Instructions](#-setup-instructions)
- [📜 Available Scripts](#-available-scripts)
- [✨ Acknowledgments](#-acknowledgments)
- [©️ License](#️-license)

## 🌟 Features

- **Application Management**: Manage applications using a table or Kanban view, moving them between various statuses (e.g. saved, applied, screening, interview, offer, rejected, withdrawn, and ghosted) - refer to [key application models](./src/pages/applications/application-model.ts).
- **Application Search and Filtering**: Search applications by role or company with FlexSearch, then filter by `status` or `interest rating`.
- **Application Workspace**: Add, edit, and delete notes and useful links such as the original posting, company website, or interview references.
- **Job Metadata Extraction**: Enter a job description manually or paste it from a job board for structured or AI-assisted extraction - refer to [extraction prompt](./src/features/gemini/extract/extraction-prompt.ts).
- **Structured Application Metadata**: Use Gemini to identify relevant role information while ignoring navigation, promotional content, employer branding, and other page noise.
- **Resume Analysis Report via Gemini**: Run an on-demand fit analysis comparing a job description with a saved or pasted resume - refer to [analysis prompt](./src/features/gemini/analysis/analysis-prompt.ts).
- **Resume Upload**: Upload a resume as a PDF and extract its text-based representation server-side. PDF files are not stored; resume content is saved as text. Relevant contact information and public links such as email, phone number, GitHub, LinkedIn, and a portfolio website can also be managed.
- **Dashboard Overview**: View application statistics, activity, and the current pipeline at a glance.
- **Export Application Data**: Export application records and related details as JSON or CSV using native browser APIs.

## 🛠️ Tech Stack

- Frontend: [TypeScript](https://www.typescriptlang.org/), [React](https://react.dev/), [TanStack Start](https://tanstack.com/start), [TanStack Router](https://tanstack.com/router), [TanStack Query](https://tanstack.com/query), [TanStack Table](https://tanstack.com/table), [React Hook Form](https://react-hook-form.com/), [dnd-kit](https://dndkit.com/), [FlexSearch](https://github.com/nextapps-de/flexsearch), [Recharts](https://recharts.org/), [React Markdown](https://github.com/remarkjs/react-markdown), [Tailwind CSS](https://tailwindcss.com/), [Base UI](https://base-ui.com/), [shadcn/ui](https://ui.shadcn.com/), [Lucide](https://lucide.dev/).

- Backend: [Node.js](https://nodejs.org/), [Drizzle ORM](https://orm.drizzle.team/), [PostgreSQL](https://www.postgresql.org/), [Zod](https://zod.dev/), [Clerk](https://clerk.com/), [Google Gemini](https://ai.google.dev/gemini-api/docs).

- Linting & Formatting: [Oxlint](https://oxc.rs/docs/guide/usage/linter), [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html).

- Dev Tools: [pnpm](https://pnpm.io/), [Knip](https://github.com/webpro-nl/knip), [Lefthook](https://github.com/evilmartians/lefthook), [commitlint](https://commitlint.js.org/), [semantic-release](https://github.com/semantic-release/semantic-release).

## 📝 Prerequisites

Ensure that the following prerequisites are installed or configured on your system by following the [Setup Instructions](#-setup-instructions):

- [Node.js](https://nodejs.org/) `>= 22.12`
- [pnpm](https://pnpm.io/) `>= 11.20`
- A running [PostgreSQL](https://www.postgresql.org/) database
- A [Clerk](https://clerk.com/) application
- A [Google AI Studio](https://aistudio.google.com/) Gemini API key

## ⚡ Setup Instructions

1. Clone this repository to your local machine.

```bash
git clone https://github.com/vikiru/job-search-tool.git
cd job-search-tool
```

2. Install dependencies.

```bash
pnpm install
```

3. Create the environment file from the documented sample.

```bash
cp .env.sample .env
```

4. Set up the required Clerk and Google Gemini credentials.

   - Create a [Clerk account](https://clerk.com/) and application to obtain the required API keys.
   - Create a project in [Google AI Studio](https://aistudio.google.com/) and obtain a Gemini API key.

5. Fill in the required values in `.env`.

```bash
# Replace these with your database username, password, host, port, and database name.
DATABASE_URL='postgresql://<username>:<password>@<host>:<port>/<database>'

# Clerk
CLERK_SECRET_KEY=
VITE_CLERK_PUBLISHABLE_KEY=
VITE_CLERK_SIGN_IN_URL=/auth/login
VITE_CLERK_SIGN_UP_URL=/auth/register
VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/applications
VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/onboarding

# Google Gemini
GEMINI_API_KEY=
```

6. Apply the database schema.

For local development, push the current schema directly:

```bash
pnpm exec drizzle-kit push
```

For migration-based workflows:

```bash
pnpm db:generate
pnpm db:migrate
```

7. Start the development server.

```bash
pnpm dev
```

The application will be available at:

```text
http://localhost:3000
```

You can open Drizzle Studio in a separate terminal to view the state of the database with:

```bash
pnpm db:studio
```

## 📜 Available Scripts

1. Start the development server.

```bash
pnpm dev
```

2. Build the production application.

```bash
pnpm build
```

3. Preview the production build.

```bash
pnpm start
```

4. Generate Drizzle migrations.

```bash
pnpm db:generate
```

5. Apply Drizzle migrations.

```bash
pnpm db:migrate
```

6. Open Drizzle Studio.

```bash
pnpm db:studio
```

7. Lint files using [Oxlint](https://oxc.rs/docs/guide/usage/linter.html).

```bash
pnpm lint
```

8. Format files with [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html).

```bash
pnpm format
```

9. Run TypeScript type checks.

```bash
pnpm typecheck
```

10. Run additional type-aware lint checks with [Oxlint](https://oxc.rs/docs/guide/usage/linter.html).

```bash
pnpm lint:typecheck
```

11. Check unused dependencies and files with [Knip](https://github.com/webpro-nl/knip).

```bash
pnpm unused
```

## ✨ Acknowledgments

- [TanStack](https://tanstack.com/)
- [TanStack Start](https://tanstack.com/start/latest)
- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [TanStack Table](https://tanstack.com/table/latest)
- [React](https://react.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Clerk](https://clerk.com/)
- [Clerk Documentation](https://clerk.com/docs)
- [Google Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Zod](https://zod.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Base UI](https://base-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide](https://lucide.dev/)
- [Sonner](https://sonner.emilkowal.ski/)
- [Recharts](https://recharts.org/)
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [remark-gfm](https://github.com/remarkjs/remark-gfm)
- [dnd-kit](https://dndkit.com/)
- [FlexSearch](https://github.com/nextapps-de/flexsearch)
- [cmdk](https://cmdk.paco.me/)
- [date-fns](https://date-fns.org/)
- [pdf-parse](https://www.npmjs.com/package/pdf-parse)
- [Shields Badges](https://github.com/badges/shields)
- [Semantic Release](https://github.com/semantic-release/semantic-release)
- [Favicon Generator](https://favicon.io/favicon-generator/)

## ©️ License

The contents of this repository are licensed under the [MIT License](https://choosealicense.com/licenses/mit/).

[MIT](LICENSE) &copy; 2025-present Visakan Kirubakaran.
