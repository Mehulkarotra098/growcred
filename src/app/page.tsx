import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Camera,
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
    detail: "Every promise moves into proof and care reminders.",
  },
  {
    label: "Trees verified",
    value: 3920,
    detail: "Approved only when evidence and context make sense.",
  },
  {
    label: "TreeCoins earned",
    value: 184500,
    detail: "Reward points for verified planting and survival care.",
  },
  {
    label: "Growers",
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
    title: "Prove the moment",
    description:
      "Upload photo/video proof, location context, species, and planting date for review.",
    icon: Camera,
  },
  {
    title: "Protect the sapling",
    description:
      "Return for care check-ins, survival updates, and stronger TreeCoin rewards.",
    icon: ShieldCheck,
  },
];

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

      <section id="how-it-works" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Proof beats promises"
            title="A living proof loop for real tree care."
            description="GrowCred rewards the full journey: the planting, the proof, and the care that keeps the tree alive."
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
          <FadeIn className="mt-10 overflow-hidden rounded-[2rem] border border-forest/10 bg-white shadow-2xl shadow-forest/10">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="forest-panel p-7 text-white sm:p-10">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-lime">
                  Review logic
                </p>
                <h3 className="mt-4 text-3xl font-black tracking-tight">
                  Trust is designed into the flow.
                </h3>
                <p className="mt-4 max-w-xl text-sm font-semibold leading-7 text-white/72">
                  GrowCred asks for context that a human reviewer can inspect:
                  the tree, the surroundings, the date, permission, and a care
                  commitment.
                </p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {["Clear media", "Location context", "Species fit", "Care promise"].map(
                    (item) => (
                      <div
                        key={item}
                        className="rounded-[1.25rem] bg-white/10 p-4 text-sm font-black"
                      >
                        {item}
                      </div>
                    ),
                  )}
                </div>
              </div>
              <div className="relative bg-off-white p-4 sm:p-6">
                <Image
                  src={GROWCRED_ASSETS.site.proofLoop}
                  alt="GrowCred Plant, Prove, Protect proof loop showing tree care steps"
                  width={1536}
                  height={1024}
                  className="h-full min-h-[24rem] w-full rounded-[1.75rem] object-cover shadow-2xl shadow-forest/10"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="rewards" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow="Reward points, not hype"
              title="TreeCoin rewards make care feel visible."
              description="TreeCoins are GrowCred reward points. They make progress, badges, and challenges feel concrete while keeping the focus on verified environmental action."
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
                className="inline-flex items-center justify-center gap-2 rounded-full border border-forest/10 bg-white px-5 py-3 text-sm font-black text-forest transition hover:bg-lime/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
              >
                Explore TreeCoin
              </Link>
            </div>
          </div>
          <RewardTable />
        </div>
      </section>

      <section className="relative isolate overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <LivingBackdrop />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <FadeIn>
            <div className="living-card rounded-[2.25rem] p-6">
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
                  ["Photo proof", Camera],
                  ["Location", MapPinned],
                  ["Care promise", ShieldCheck],
                ].map(([item, Icon]) => (
                  <div key={item as string} className="rounded-2xl bg-white p-4">
                    <Icon
                      aria-hidden="true"
                      className="h-6 w-6 text-leaf"
                    />
                    <p className="mt-3 text-sm font-black text-forest">
                      {item as string}
                    </p>
                    <p className="mt-2 text-xs font-bold leading-5 text-forest/55">
                      Capture enough context for a trusted review.
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Image
                  src={brandAssets.proveImpact}
                  alt=""
                  aria-hidden="true"
                  width={260}
                  height={180}
                  className="h-auto w-32"
                />
                <Image
                  src={brandAssets.treeCoin}
                  alt=""
                  aria-hidden="true"
                  width={120}
                  height={120}
                  className="h-16 w-16"
                />
              </div>
              <Link
                href="/submit-proof"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-black text-white transition hover:bg-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
              >
                Submit Proof
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
          <SectionHeader
            eyebrow="Proof flow"
            title="Planting is the start. Care is the mission."
            description="The proof flow captures legal planting, local suitability, media evidence, and a care commitment before a reward is approved."
          />
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
            title="Track. Verify. See your impact grow."
            description="A personal dashboard makes rewards, reminders, badges, and tree survival easy to scan."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
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
            <div className="living-card rounded-[2rem] p-3">
              <Image
                src={GROWCRED_ASSETS.site.dashboardTrackImpact}
                alt="GrowCred dashboard preview for tracking verified tree impact"
                width={1536}
                height={1024}
                className="aspect-[16/10] w-full rounded-[1.5rem] object-cover"
              />
            </div>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {trees.slice(0, 2).map((tree) => (
              <TreeCard key={tree.id} tree={tree} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/70 px-4 py-16 sm:px-6 lg:px-8">
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
              description="Leaderboards celebrate verified trees, TreeCoins, badges, schools, cities, and challenge progress."
            />
            <div className="mt-8">
              <LeaderboardTable users={users} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <Image
              src={brandAssets.earthHeart}
              alt=""
              aria-hidden="true"
              width={260}
              height={260}
              className="mx-auto h-auto w-32 sm:w-36 lg:mx-0"
            />
            {badges.slice(0, 3).map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 rounded-full border border-forest/10 bg-white/80 px-5 py-4 shadow-sm shadow-forest/5 backdrop-blur">
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
