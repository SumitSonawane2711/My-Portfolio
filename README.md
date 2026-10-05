# Sumit Sonawane — Portfolio

Personal portfolio with a private dashboard: Next.js 16 (App Router), Tailwind CSS v4,
Postgres (Neon) through Prisma 7, Better Auth (GitHub login), Cloudinary and a Tiptap editor.
Projects, experience, technologies, testimonials, resumes and site details are all managed
at `/admin`. Blog posts live on Medium: the site lists them and links out (see below).

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

## Blog (Medium)

Posts are written on Medium. Add your profile link (e.g. `https://medium.com/@you`) in
**Admin → Settings → Socials**, then use **Admin → Blog**:

- **Sync now** pulls your Medium RSS feed (Medium only serves the latest ~10 stories). A Vercel
  cron (`vercel.json`) also syncs daily at 06:00 UTC through `/api/cron/medium`, which needs a
  `CRON_SECRET` environment variable in Vercel (`openssl rand -hex 32`).
- **Add story** adds older stories by hand (Medium blocks automated page reads, so title and
  date are typed in). A hand-added story later seen in the feed is updated, not duplicated.
- **Feature** puts a story first on the home page; **hide** keeps it off the site across syncs.

Old `/blog/<slug>` links redirect to the Medium profile, and `/rss.xml` to the Medium feed.

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

Local git hooks (Husky) catch everything CI would reject, before it leaves your machine:

| Hook         | When             | What it runs                                                                                                                                                                                                                                                                                        |
| ------------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pre-commit` | every commit     | ESLint + Prettier on staged files (lint-staged); `prisma validate` + format check when the schema is staged                                                                                                                                                                                         |
| `commit-msg` | every commit     | commitlint: [Conventional Commits](https://www.conventionalcommits.org/) (`feat(projects): …`, `fix(contact): …`)                                                                                                                                                                                   |
| `pre-push`   | every `git push` | pushes to **`main`**: always blocked. Pushes to **`dev`**: refuses uncommitted/untracked files, checks the commit messages being pushed, then `npm run verify` (lint, format, Prisma, schema-has-migrations, typecheck, tests, build). Pushes to **any other branch** (e.g. `feature/*`): no checks |

Run `npm run verify` yourself any time (`-- --no-build` to skip the build). The pre-push run
takes about 1–2 minutes; `git push --no-verify` skips it in an emergency (CI still checks).

- GitHub Actions, full checks once per change:
  - `ci.yml` (check **`ci`**): pushes and PRs to `dev`: commit lint (PRs), lint, format check,
    Prisma validation, typecheck, unit tests, migrations on a CI database (repository secrets
    `CI_DATABASE_URL`, `CI_DATABASE_URL_UNPOOLED`) and build.
  - `pr-main.yml` (check **`release-check`**): PRs into `main` only verify they come from `dev`
    and that commit messages are valid. The head commit already has a green `ci` from its push to
    `dev`, so nothing is rebuilt; Vercel builds production after the merge.
