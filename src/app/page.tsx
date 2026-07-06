import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Camera,
  CheckCircle2,
  Coins,
  Droplets,
  Flame,
  MapPinned,
  ShieldCheck,
  Sprout,
  Trees,
  Users,
} from "lucide-react";
import { BadgeCard } from "@/components/badge-card";
import { ChallengeCard } from "@/components/challenge-card";
import { CTASection } from "@/components/cta-section";
import { DashboardCard } from "@/components/dashboard-card";
import {
  HumanActivityStrip,
  ProofPacketMini,
} from "@/components/human-proof-board";
import { HeroSection } from "@/components/hero-section";
import { HowItWorksCard } from "@/components/how-it-works-card";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { LivingBackdrop } from "@/components/living-backdrop";
import { FadeIn } from "@/components/motion";
import { RewardTable } from "@/components/reward-table";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { StatusPill } from "@/components/status-pill";
import { TreeCard } from "@/components/tree-card";
import { brandAssets } from "@/lib/brand-assets";
import { GROWCRED_ASSETS } from "@/lib/assets";
import { TREECOIN_DISCLAIMER } from "@/lib/copy";
import { badges, challenges, trees, users } from "@/lib/mock-data";

const impactStats = [
  {
    label: "Trees pledged",
    value: 12480,
    detail: "Promises moving into proof, review, and care reminders.",
  },
  {
    label: "Trees verified",
    value: 3920,
    detail: "Approved when evidence and location context make sense.",
  },
  {
    label: "TreeCoins earned",
    value: 184500,
    detail: "Reward points for verified planting and survival care.",
  },
  {
    label: "Active growers",
    value: 8200,
    detail: "Students, creators, schools, and city teams.",
  },
];

const proofLoop = [
  {
    title: "Plant with permission",
    description:
      "Choose a native or locally suitable tree in a place where long-term care is possible.",
    icon: Sprout,
  },
  {
    title: "Upload proof",
    description:
      "Add photo evidence, species, planting date, location, and notes a reviewer can inspect.",
    icon: Camera,
  },
  {
    title: "Return for care",
    description:
      "Care check-ins, survival updates, and reminders keep the tree from becoming a one-day event.",
    icon: ShieldCheck,
  },
];

const reviewSteps = [
  "Media is clear enough to inspect",
  "Location and permission are plausible",
  "Species fits the local context",
  "Care follow-up is scheduled",
] as const;

const learnPreview = [
  [BookOpen, "Choose a native/local tree", "Species fit comes before speed."],
  [MapPinned, "Plant in the right place", "Permission and future space matter."],
  [Droplets, "Watering rhythm", "Small weekly care beats one big event."],
  [ShieldCheck, "Protect from damage", "Survival proof starts after planting."],
] as const;

export default function Home() {
  return (
    <>
      <HeroSection />

      <section
        className="relative isolate px-4 py-10 sm:px-6 lg:px-8"
        aria-label="Impact stats"
      >
        <LivingBackdrop />
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {impactStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Recent activity"
            title="Make the impact feel lived-in."
            description="Visitors should see people submitting, waiting, getting verified, and returning for care."
          />
          <div className="mt-8">
            <HumanActivityStrip />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Proof beats promises"
            title="A simple loop for real tree care."
            description="GrowCred rewards the journey: planting responsibly, proving the action, and protecting the tree over time."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {proofLoop.map((item, index) => (
              <HowItWorksCard
                key={item.title}
                step={`Step ${index + 1}`}
                title={item.title}
                description={item.description}
                icon={item.icon}
              />
            ))}
          </div>

          <FadeIn className="mt-10 grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="forest-panel rounded-[2rem] p-7 text-white sm:p-9">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-lime">
                Trust layer
              </p>
              <h3 className="mt-4 text-3xl font-black tracking-tight">
                Review happens before reward.
              </h3>
              <p className="mt-4 max-w-xl text-sm font-semibold leading-7 text-white/72">
                The product should feel serious because people can only earn
                TreeCoins after evidence, permission, species fit, and care
                intent are checked.
              </p>
              <p className="mt-6 rounded-[1.25rem] border border-lime/24 bg-lime/10 p-4 text-xs font-bold leading-6 text-white/76">
                {TREECOIN_DISCLAIMER}
              </p>
            </div>
            <div className="grid gap-3 rounded-[2rem] border border-forest/10 bg-white/78 p-5 shadow-xl shadow-forest/6">
              {reviewSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-4 rounded-[1.25rem] bg-off-white/82 p-4"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-lime/34 text-sm font-black text-forest">
                    {index + 1}
                  </span>
                  <p className="text-sm font-black text-forest">{step}</p>
                  <CheckCircle2
                    aria-hidden="true"
                    className="ml-auto h-5 w-5 text-leaf"
                  />
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="rewards" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow="Reward points, not hype"
              title="TreeCoin makes verified care visible."
              description="TreeCoins are GrowCred reward points. They make progress, badges, and challenges feel concrete while the focus stays on environmental action."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <DashboardCard
                label="Reward type"
                value="In-app"
                detail={TREECOIN_DISCLAIMER}
                icon={Coins}
              />
              <DashboardCard
                label="Verified focus"
                value="Care"
                detail="Survival updates matter more than one-time planting claims."
                icon={BadgeCheck}
              />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/submit-proof"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-black text-white transition hover:bg-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
              >
                Submit Proof
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link
                href="/treecoin"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-forest/10 bg-white/78 px-5 py-3 text-sm font-black text-forest transition hover:bg-lime/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
              >
                Explore TreeCoin
              </Link>
            </div>
          </div>
          <RewardTable />
        </div>
      </section>

      <section className="relative isolate px-4 py-16 sm:px-6 lg:px-8">
        <LivingBackdrop />
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-start">
          <FadeIn className="human-card rounded-[2.1rem] p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.14em] text-leaf">
                  Submit proof
                </p>
                <h2 className="mt-2 text-3xl font-black text-forest">
                  Your tree has a survival story.
                </h2>
              </div>
              <StatusPill status="under_review" />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                ["Tree details", Sprout],
                ["Evidence", Camera],
                ["Permission", ShieldCheck],
              ].map(([item, Icon]) => (
                <div key={item as string} className="rounded-2xl bg-off-white/82 p-4">
                  <Icon aria-hidden="true" className="h-6 w-6 text-leaf" />
                  <p className="mt-3 text-sm font-black text-forest">
                    {item as string}
                  </p>
                  <p className="mt-2 text-xs font-bold leading-5 text-forest/55">
                    Capture enough context for a trusted human review.
                  </p>
                </div>
              ))}
            </div>
            <Link
              href="/submit-proof"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-black text-white transition hover:bg-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
            >
              Submit Proof
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </FadeIn>
          <ProofPacketMini />
        </div>
      </section>

      <section className="forest-panel px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Challenges"
            title="Make climate action social."
            description="Join missions that reward verified trees, group energy, and survival progress."
            align="center"
            tone="dark"
          />
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Image
              src={brandAssets.plantToday}
              alt=""
              aria-hidden="true"
              width={300}
              height={220}
              className="float-soft h-auto w-32 sm:w-36"
            />
            <Image
              src={brandAssets.betterTogether}
              alt=""
              aria-hidden="true"
              width={360}
              height={240}
              className="float-soft-delay h-auto w-36 sm:w-44"
            />
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {challenges.slice(0, 3).map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Dashboard preview"
            title="Track proof, reminders, rewards, and care."
            description="The dashboard should feel like a place users return to, not a one-time certificate page."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div className="grid gap-5 sm:grid-cols-2">
              <DashboardCard
                label="Total TreeCoins"
                value="140"
                detail="Earned from verified planting and care."
                icon={Coins}
              />
              <DashboardCard
                label="Trees submitted"
                value="5"
                detail="Drafts, reviews, and verified trees."
                icon={Trees}
              />
              <DashboardCard
                label="Verified trees"
                value="3"
                detail="Proof accepted by review."
                icon={BadgeCheck}
              />
              <DashboardCard
                label="Survival streak"
                value="42 days"
                detail="Next reminder: Water your neem tree tomorrow."
                icon={Flame}
              />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {trees.slice(0, 2).map((tree) => (
                <TreeCard key={tree.id} tree={tree} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white/55 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <SectionHeader
              eyebrow="Learn"
              title="Do not just plant it. Grow it."
              description="GrowCred guides users toward native trees, legal locations, and practical care during the first 90 days."
            />
            <Image
              src={GROWCRED_ASSETS.site.treeCareGuide}
              alt="GrowCred tree care guide visual for native planting and survival care"
              width={1536}
              height={1024}
              className="mt-7 aspect-[4/3] w-full rounded-[2rem] object-cover shadow-2xl shadow-forest/10"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {learnPreview.map(([Icon, label, text]) => (
              <div key={label} className="living-card rounded-[1.5rem] p-5">
                <Icon aria-hidden="true" className="h-6 w-6 text-leaf" />
                <p className="mt-4 text-base font-black text-forest">
                  {label}
                </p>
                <p className="mt-2 text-sm font-bold leading-6 text-forest/55">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate px-4 py-16 sm:px-6 lg:px-8">
        <LivingBackdrop />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <SectionHeader
              eyebrow="Community"
              title="Small actions. Big future."
              description="Leaderboards work best when they feel connected to real people, schools, cities, and verified care."
            />
            <div className="mt-8">
              <LeaderboardTable users={users} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {badges.slice(0, 3).map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 rounded-full border border-forest/10 bg-white/78 px-5 py-4 shadow-sm shadow-forest/5 backdrop-blur">
          <Users aria-hidden="true" className="h-5 w-5 text-leaf" />
          <p className="text-center text-sm font-black text-forest">
            Turn real tree care into real impact.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  );
}
