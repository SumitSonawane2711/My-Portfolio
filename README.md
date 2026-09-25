# Sumit Sonawane — Portfolio

Personal portfolio with a private dashboard: Next.js 16 (App Router), Tailwind CSS v4,
Postgres (Neon) through Prisma 7, Better Auth (GitHub login), Cloudinary and a Tiptap editor.
Projects, blog posts, experience, technologies, testimonials, resumes and site details are
all managed at `/admin`.

## Getting started

Requires Node.js 24 (see `.nvmrc`; 22.22.1+ works).

```bash
npm install            # also runs `prisma generate` and installs the git hooks
cp .env.example .env   # fill in every value (see comments in the file)
npm run db:deploy      # apply database migrations
npm run content:import # first run only: import the original content
npm run dev            # http://localhost:3000 — dashboard at /admin
```

There is a single environment file, `.env`; it is validated when the server starts.

## Scripts

| Script                   | What it does                                                   |
| ------------------------ | -------------------------------------------------------------- |
| `npm run dev`            | Start the dev server                                           |
| `npm run build`          | Production build (`vercel-build` also applies migrations)      |
| `npm run start`          | Serve the production build                                     |
| `npm run check`          | Lint, format check, typecheck and unit tests                   |
| `npm run lint`           | ESLint (`lint:fix` to auto-fix)                                |
| `npm run format`         | Format everything with Prettier                                |
| `npm run typecheck`      | TypeScript type check                                          |
| `npm test`               | Unit tests (Vitest)                                            |
| `npm run db:migrate`     | Create and apply a migration after editing the schema          |
| `npm run db:studio`      | Browse the database                                            |
| `npm run content:import` | Import static content (`--dry-run`, `--only=…`, `--overwrite`) |

## Project structure

```
src/
├── app/            # Routes only: (site) public pages, (admin) dashboard, api/, sitemap, rss
├── features/       # One folder per domain:
│   └── <feature>/  #   components/ interfaces/ schemas/ repositories/ services/ actions/ queries/
├── shared/         # Cross-feature code: components/ (+ ui/, editor/), configs/, hooks/, libs/
└── proxy.ts        # Redirects signed-out /admin visitors to /login
prisma/             # schema.prisma + migrations
scripts/            # content importer (+ legacy-content/, the original MDX)
```

- Only `repositories/` import the database; business rules live in `services/`.
- Server actions always run `requireAdmin()`, validate with the feature's Zod schema, call the
  service, then `revalidateSite.*()` (`shared/libs/revalidate.ts`) to refresh public pages.
- Import across folders with the `@/` alias; ESLint rejects deep relative imports like `../../`.

## Commits and CI

- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat(blog): …`, `fix(contact): …`), enforced by commitlint on `commit-msg`.
- `pre-commit` runs ESLint and Prettier on staged files through lint-staged.
- GitHub Actions (`.github/workflows/ci.yml`) runs on pushes and PRs to `main` and `dev`:
  commit lint (PRs), lint, format check, Prisma validation, typecheck, unit tests, migrations
  on a CI database (secrets `CI_DATABASE_URL`, `CI_DATABASE_URL_UNPOOLED`) and build.
