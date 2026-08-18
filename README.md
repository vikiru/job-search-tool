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

**JobApp** is an AI-assisted job application tracking workspace for keeping applications, resumes, job descriptions, and next steps in one place. It is meant to make the work around an application easier to manage: save a posting, preserve the details that matter, compare it with a resume, and keep track of what happens next.

Starting from a job posting copied from a job board or entered manually, JobApp cleans up the description and keeps the useful role context together with the application. Gemini can extract structured metadata such as technologies, qualifications, benefits, salary, location, employment type, deadlines, and application instructions, while a separate analysis model compares the posting with a selected resume and provides constructive, evidence-based feedback.

The application is built around a private, authenticated workspace. Applications can be moved through a table or Kanban workflow, enriched with notes and links, and reviewed through dashboard statistics and activity. Fit analysis is intentionally user-triggered so the user decides when a resume and job description should be compared.

## 📖 Table of Contents

- [📖 Table of Contents](#-table-of-contents)
- [🌟 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📝 Prerequisites](#-prerequisites)
- [⚡ Setup Instructions](#-setup-instructions)
- [🔍 Testing and Verification](#-testing-and-verification)
- [📜 Available Scripts](#-available-scripts)
- [✨ Acknowledgments](#-acknowledgments)
- [©️ License](#️-license)

## 🌟 Features

- **Application tracking**: Move applications through a focused table or Kanban workflow, from saved through interviews, offers, rejection, withdrawal, or ghosting.
- **Search and filtering**: Search applications by role or company with FlexSearch, then refine the workspace by status or interest rating.
- **Application workspace**: Add, edit, and delete notes and useful links such as the original posting, portfolio, or interview references.
- **Job description capture**: Enter a job description manually or paste it from a job board for cleanup and structured extraction.
- **Structured job metadata**: Use Gemini to identify relevant role information while ignoring navigation, promotional content, employer branding, and other page noise.
- **Resume comparison**: Run an on-demand fit analysis comparing a job description with a saved or pasted resume.
- **Resume management**: Upload PDF resumes, review extracted text, and maintain resume contact details and public links.
- **Dashboard overview**: View application statistics, activity, weekly trends, and the current pipeline at a glance.
- **Data export**: Export application records and related details as JSON or CSV using native browser APIs.
- **Private workspace**: Keep authenticated routes protected with Clerk while ensuring server secrets and raw internal errors never reach the client.
- **Theme support**: Use light, dark, or system themes with an SSR-friendly initialization path.

## 🛠️ Tech Stack

- Frontend: [TypeScript](https://www.typescriptlang.org/), [React](https://react.dev/), [TanStack Start](https://tanstack.com/start), [TanStack Router](https://tanstack.com/router), [TanStack Query](https://tanstack.com/query), [TanStack Table](https://tanstack.com/table), [TanStack Virtual](https://tanstack.com/virtual), and [React Hook Form](https://react-hook-form.com/).

- UI: [Tailwind CSS](https://tailwindcss.com/), [Base UI](https://base-ui.com/), [shadcn/ui](https://ui.shadcn.com/), [Class Variance Authority](https://cva.style/docs), [Lucide](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/), [Recharts](https://recharts.org/), and [React Markdown](https://github.com/remarkjs/react-markdown).

- Backend and persistence: [TanStack Start server functions](https://tanstack.com/start), [Node.js](https://nodejs.org/), [Drizzle ORM](https://orm.drizzle.team/), [Drizzle Zod](https://orm.drizzle.team/docs/zod), [PostgreSQL](https://www.postgresql.org/), [Zod](https://zod.dev/), and [Clerk](https://clerk.com/).

- AI and document processing: [Google Gemini](https://ai.google.dev/gemini-api/docs), [pdf-parse](https://www.npmjs.com/package/pdf-parse), [React Markdown](https://github.com/remarkjs/react-markdown), [remark-gfm](https://github.com/remarkjs/remark-gfm), and structured Zod validation for model output.

- Interaction and search: [dnd-kit](https://dndkit.com/), [FlexSearch](https://github.com/nextapps-de/flexsearch), [cmdk](https://cmdk.paco.me/), and [date-fns](https://date-fns.org/).

- Linting and formatting: [Oxlint](https://oxc.rs/docs/guide/usage/linter), [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html), the [React Compiler](https://react.dev/learn/react-compiler), [TypeScript](https://www.typescriptlang.org/), [Knip](https://github.com/webpro-nl/knip), [Lefthook](https://github.com/evilmartians/lefthook), and [Commitlint](https://commitlint.js.org/).

## 📝 Prerequisites

Ensure that the following are installed before starting:

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
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

4. Fill in the required values in `.env`.

```bash
# PostgreSQL
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>

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

`DATABASE_URL`, `CLERK_SECRET_KEY`, and `GEMINI_API_KEY` are server-only values. Do not expose them through client code, commit them, or paste real credentials into `.env.sample`.

5. Apply the database schema.

For local development, push the current schema directly:

```bash
pnpm exec drizzle-kit push
```

For migration-based workflows:

```bash
pnpm db:generate
pnpm db:migrate
```

6. Start the development server.

```bash
pnpm dev
```

The application will be available at:

```text
http://localhost:3000
```

You can open Drizzle Studio in a separate terminal with:

```bash
pnpm db:studio
```

## 🔍 Testing and Verification

Run the complete local verification command before opening a pull request:

```bash
pnpm check
```

This checks formatting, runs Oxlint, and runs the TypeScript compiler without emitting files. The lint command is expected to finish with zero warnings and errors; React Compiler transforms remain configured in the React build plugin.

You can also run the checks individually:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm typecheck:tsgo
pnpm build
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

7. Run Oxlint.

```bash
pnpm lint
```

8. Format the repository with Oxfmt.

```bash
pnpm format
```

9. Run TypeScript type checks without emitting files.

```bash
pnpm typecheck
```

10. Run the native TypeScript preview checker.

```bash
pnpm typecheck:tsgo
```

11. Check unused dependencies and files with [Knip](https://github.com/webpro-nl/knip).

```bash
pnpm unused
```

## ✨ Acknowledgments

- [TanStack](https://tanstack.com/)
- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [TanStack Table](https://tanstack.com/table)
- [TanStack Virtual](https://tanstack.com/virtual)
- [React](https://react.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Clerk](https://clerk.com/)
- [Google Gemini](https://ai.google.dev/gemini-api/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Drizzle Zod](https://orm.drizzle.team/docs/zod)
- [PostgreSQL](https://www.postgresql.org/)
- [Zod](https://zod.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Base UI](https://base-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Class Variance Authority](https://cva.style/docs)
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
- [Oxlint](https://oxc.rs/docs/guide/usage/linter)
- [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)
- [React Compiler](https://react.dev/learn/react-compiler)
- [Knip](https://github.com/webpro-nl/knip)
- [Lefthook](https://github.com/evilmartians/lefthook)
- [Commitlint](https://commitlint.js.org/)

## ©️ License

The contents of this repository are licensed under the [MIT License](https://choosealicense.com/licenses/mit/).

[MIT](LICENSE) &copy; 2025-present Visakan Kirubakaran.
