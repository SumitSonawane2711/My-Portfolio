-- /freelance one-pager: page copy, services and offers (editable in Admin → Freelance),
-- a freelance flag on projects/testimonials and the source of each contact message.

-- CreateEnum
CREATE TYPE "MessageSource" AS ENUM ('PORTFOLIO', 'FREELANCE');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "clientName" TEXT,
ADD COLUMN     "freelance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "outcome" TEXT;

-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN     "freelance" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "source" "MessageSource" NOT NULL DEFAULT 'PORTFOLIO';

-- CreateTable
CREATE TABLE "FreelanceSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "greeting" TEXT NOT NULL DEFAULT '',
    "headline" TEXT NOT NULL DEFAULT '',
    "intro" TEXT NOT NULL DEFAULT '',
    "workTitle" TEXT NOT NULL DEFAULT '',
    "workIntro" TEXT NOT NULL DEFAULT '',
    "servicesTitle" TEXT NOT NULL DEFAULT '',
    "servicesIntro" TEXT NOT NULL DEFAULT '',
    "aboutTitle" TEXT NOT NULL DEFAULT '',
    "about" TEXT NOT NULL DEFAULT '',
    "portraitId" TEXT,
    "processTitle" TEXT NOT NULL DEFAULT '',
    "processIntro" TEXT NOT NULL DEFAULT '',
    "offersTitle" TEXT NOT NULL DEFAULT '',
    "contactTitle" TEXT NOT NULL DEFAULT '',
    "contactIntro" TEXT NOT NULL DEFAULT '',
    "availabilityNote" TEXT NOT NULL DEFAULT '',
    "whatsapp" TEXT,
    "seoTitle" TEXT NOT NULL DEFAULT '',
    "seoDescription" TEXT NOT NULL DEFAULT '',
    "ogImageId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FreelanceSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreelanceService" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "details" TEXT NOT NULL DEFAULT '',
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FreelanceService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreelanceOffer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "badge" TEXT,
    "tagline" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "deliverables" TEXT[],
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FreelanceOffer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FreelanceService_visible_order_idx" ON "FreelanceService"("visible", "order");

-- CreateIndex
CREATE INDEX "FreelanceOffer_visible_order_idx" ON "FreelanceOffer"("visible", "order");

-- AddForeignKey
ALTER TABLE "FreelanceSettings" ADD CONSTRAINT "FreelanceSettings_portraitId_fkey" FOREIGN KEY ("portraitId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreelanceSettings" ADD CONSTRAINT "FreelanceSettings_ogImageId_fkey" FOREIGN KEY ("ogImageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- First-draft content (edit it in Admin → Freelance). {years} is replaced with
-- the years of experience. **bold** marks key phrases.
INSERT INTO "FreelanceSettings" ("id", "greeting", "headline", "intro", "workTitle", "workIntro",
  "servicesTitle", "servicesIntro", "aboutTitle", "about", "processTitle", "processIntro",
  "offersTitle", "contactTitle", "contactIntro", "availabilityNote", "seoTitle", "seoDescription", "updatedAt")
VALUES (1,
  $$Hi, I'm Sumit,$$,
  $$I help founders and growing businesses turn ideas into fast, reliable web products.$$,
  $$As your **full-stack developer** and **technical partner**, I take your product from first idea to launch, and keep it fast and stable as it grows.

Together, we build software your users enjoy and your business can rely on.$$,
  $$Work I've delivered$$,
  $$A few products I've planned, built and shipped end to end.$$,
  $$Four ways I can help your business$$,
  $$Everything I build is about **turning ideas into working software** quickly, **without cutting corners** on quality. AI speeds up the routine work. Architecture, judgment and care stay **human**.

Here is how I help, whether you're starting from zero or improving what already exists.$$,
  $$Nice to meet you$$,
  $$I'm Sumit Sonawane, a **full-stack developer** with **{years}+ years of experience** building products with React, Next.js and Node.js.

I enjoy the moment an idea becomes **something real people can use**. That's where good engineering makes the biggest difference: clear structure, fast pages and code that's easy to change.

I work best with founders and teams who **care about their users** and want a developer who thinks about the product, not just the ticket.

Based in India, I work remotely with clients in India and around the world.$$,
  $$How we start working together$$,
  $$We work as partners. **Clear communication, regular check-ins and visible progress** from the first week.

You always know what's done, what's next and what it costs.$$,
  $$Two clear ways to begin$$,
  $$Let's build something together$$,
  $$Tell me about your idea or the problem you want solved. I usually reply **within one working day**.$$,
  $$Taking on new projects this month$$,
  $$Sumit Sonawane – Freelance Full-Stack Developer$$,
  $$I help founders and businesses build fast, reliable web apps, MVPs, dashboards and APIs with React, Next.js and Node.js. Call or message to start your project.$$,
  CURRENT_TIMESTAMP);

INSERT INTO "FreelanceService" ("id", "title", "summary", "details", "order", "updatedAt") VALUES
  (gen_random_uuid()::text, $$MVP development$$,
   $$I turn your idea into a working first version you can put in front of real users.$$,
   $$We start by agreeing on the **smallest product that proves your idea**. Then I design the data model, build the frontend and backend, and ship it to production.

You get a **clean, documented codebase** you can keep building on, not a prototype you'll have to throw away.$$, 0, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, $$Web apps and dashboards$$,
   $$Admin panels, customer portals and internal tools that make your team faster.$$,
   $$I build **fast, accessible interfaces** with React and Next.js, backed by **role-based access**, reliable data and the integrations your business already uses.

The result is software your team actually enjoys using every day.$$, 1, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, $$APIs and backend systems$$,
   $$Secure, well-structured APIs your apps and partners can depend on.$$,
   $$With Node.js, Express or AdonisJS and PostgreSQL or MySQL, I design **APIs that are secure by default**: authentication, permissions, validation and clear documentation.

Built to **grow with your traffic**, not against it.$$, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, $$Performance, fixes and maintenance$$,
   $$Make an existing product faster, more stable and easier to change.$$,
   $$I find what slows your product down, from **slow pages and heavy queries** to fragile deployments, and fix it with measurable results.

After that, I can stay on as your **dependable developer** for updates and new features.$$, 3, CURRENT_TIMESTAMP);

INSERT INTO "FreelanceOffer" ("id", "name", "badge", "tagline", "description", "deliverables", "order", "updatedAt") VALUES
  (gen_random_uuid()::text, $$Fixed-scope project$$, $$Most popular$$,
   $$A defined product or feature, delivered on a clear timeline.$$,
   $$We agree on scope, milestones and price up front, so there are **no surprises**.

I share progress every week, and you can try each milestone as it lands.$$,
   ARRAY[$$A production-ready product, deployed and handed over$$, $$Clean, documented source code that you fully own$$, $$Support through launch and handover$$], 0, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, $$Monthly developer partner$$, NULL,
   $$Ongoing development for teams that ship continuously.$$,
   $$A **reserved block of my time every month** for new features, improvements and maintenance.

No hiring and no long contracts, just a developer who knows your product and takes ownership.$$,
   ARRAY[$$Dedicated development time every month$$, $$New features, fixes and performance work$$, $$A technical sparring partner for product decisions$$], 1, CURRENT_TIMESTAMP);

-- Existing published projects start out on the freelance page too (untick in admin).
UPDATE "Project" SET "freelance" = true WHERE "published" = true;
