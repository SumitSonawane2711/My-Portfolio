# Sumit Sonawane — Portfolio

Personal portfolio built with Next.js (App Router), Tailwind CSS v4 and MDX.

## Getting started

Requires Node.js 22.22.1 or newer.

```bash
npm install          # also installs the git hooks (husky)
cp .env.example .env # then fill in the Gmail values for the contact form
npm run dev          # http://localhost:3000
```

There is a single environment file, `.env`. See `.env.example` for every variable.

## Scripts

| Script                 | What it does                     |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start the dev server (Turbopack) |
| `npm run build`        | Production build                 |
| `npm run start`        | Serve the production build       |
| `npm run lint`         | ESLint (`lint:fix` to auto-fix)  |
| `npm run format`       | Format everything with Prettier  |
| `npm run format:check` | Check formatting without writing |
| `npm run typecheck`    | TypeScript type check            |

## Project structure

```
src/
├── app/        # Routes only — thin page.tsx files and the /api/contact route handler
├── features/   # One folder per domain: components/, services/, interfaces/, constants/
├── shared/     # Cross-feature code: components/, configs/, constants/, libs/
└── data/       # MDX content (blogs, projects, professional experience)
```

Import across folders with the `@/` alias (e.g. `@/shared/components/Container`).
ESLint rejects deep relative imports like `../../`.

## Commits and CI

- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat: ...`, `fix(contact): ...`), enforced by commitlint on `commit-msg`.
- `pre-commit` runs ESLint and Prettier on staged files through lint-staged.
- GitHub Actions (`.github/workflows/ci.yml`) runs on pushes and PRs to `main`:
  commit lint (PRs), lint, format check, typecheck, build.
