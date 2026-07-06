import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck2,
  CheckCircle2,
  Coins,
  FileCheck2,
  Gauge,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Sprout,
  Trophy,
} from "lucide-react";
import { GROWCRED_ASSETS } from "@/lib/assets";
import { BRAND_SLOGAN, BRAND_TAGLINE, TREECOIN_DISCLAIMER } from "@/lib/copy";
import { TREECOIN_REWARD_RULES } from "@/lib/treecoin/token";

export const metadata: Metadata = {
  title: "TreeCoin Rewards | GrowCred",
  description:
    "TreeCoin is GrowCred's reward layer for verified tree planting and long-term tree care.",
};

const launchStats = [
  ["12.4k", "Trees pledged", "Community proof pipeline"],
  ["3.9k", "Trees verified", "Human-reviewed records"],
  ["184k", "TreeCoins earned", "Reward points in the app"],
  ["82%", "Care follow-up", "Survival-first unlocks"],
] as const;

const rewardJourney = [
  {
    icon: Sprout,
    label: "Plant",
    title: "Add real tree details",
    description: "Name, species, date, city, permission, and local suitability.",
  },
  {
    icon: FileCheck2,
    label: "Prove",
    title: "Upload strong evidence",
    description: "Photo proof is required. Video, notes, and location help review.",
  },
  {
    icon: ShieldCheck,
    label: "Verify",
    title: "Pass trust checks",
    description: "Reviewers inspect media, context, fraud flags, and care intent.",
  },
  {
    icon: Coins,
    label: "Earn",
    title: "Release TreeCoins",
    description: "Approved actions unlock reward points tied to that proof record.",
  },
] as const;

const activityFeed = [
  {
    name: "Aarav M.",
    city: "Pune",
    action: "Mango planting proof approved",
    amount: "+10",
    status: "Verified",
  },
  {
    name: "Nia S.",
    city: "Bengaluru",
    action: "30-day care check submitted",
    amount: "+15",
    status: "Under Review",
  },
  {
    name: "Green Club",
    city: "Indore",
    action: "School garden campaign cleared",
    amount: "+120",
    status: "Verified",
  },
] as const;

const launchChecklist = [
  ["Reward standard", "Proof-bound TreeCoin"],
  ["Decimals", "Whole-point rewards"],
  ["Release policy", "After verification"],
  ["Reward trigger", "Verified proof approval"],
  ["Public status", "Active in GrowCred rewards"],
] as const;

const trustCards = [
  {
    icon: LockKeyhole,
    title: "Reward-only",
    description:
      "TreeCoin is designed to make verified tree care visible inside GrowCred, not to create speculation.",
  },
  {
    icon: BadgeCheck,
    title: "Proof-bound",
    description:
      "Every release is connected to a proof record, reviewer decision, and status trail.",
  },
  {
    icon: CalendarCheck2,
    title: "Care-weighted",
    description:
      "Survival updates and check-ins earn stronger rewards than one-time planting claims.",
  },
] as const;

const proofQueue = [
  ["Photo proof", "Required", "Clear tree and surroundings"],
  ["Location context", "Required", "City plus optional GPS"],
  ["Permission", "Required", "Allowed planting location"],
  ["Care promise", "Required", "Follow-up survival updates"],
] as const;

export default function TreeCoinPage() {
  return (
    <main className="product-page-shell treecoin-launch-shell px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[1.02fr_0.98fr] xl:items-stretch">
        <div className="relative overflow-hidden rounded-[2.25rem] border border-forest/10 bg-white/88 p-6 shadow-2xl shadow-forest/8 sm:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="absolute -left-28 -top-28 h-72 w-72 rounded-full bg-lime/30 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-0 right-0 h-72 w-72 translate-x-24 translate-y-24 rounded-full bg-aqua/20 blur-3xl"
          />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-leaf/15 bg-lime/24 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-forest">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              TreeCoin reward launch
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[0.96] text-forest sm:text-6xl lg:text-7xl">
              The reward layer for real tree care.
            </h1>

            <p className="mt-6 max-w-2xl text-base font-bold leading-7 text-forest/72 sm:text-lg sm:leading-8">
              TreeCoin turns verified GrowCred actions into visible progress:
              plant responsibly, prove the work, protect the tree, and earn
              points only after review.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {["Reward-only", "Proof-bound", "Review-approved", "Care-first"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-forest/10 bg-white/74 px-3 py-2 text-xs font-black text-forest shadow-sm shadow-forest/5"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>

            <div className="mt-6 max-w-2xl rounded-[1.5rem] border border-aqua/25 bg-aqua/10 p-4 text-sm font-extrabold leading-6 text-forest">
              {TREECOIN_DISCLAIMER}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/submit-proof"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-black text-white shadow-lg shadow-forest/15 transition hover:bg-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
              >
                Submit Proof
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-forest/10 bg-white px-5 py-3 text-sm font-black text-forest shadow-sm transition hover:bg-lime/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
              >
                View Reward Dashboard
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-4">
              {launchStats.map(([value, label, detail]) => (
                <div
                  key={label}
                  className="rounded-[1.35rem] border border-forest/10 bg-white/72 p-4 shadow-sm shadow-forest/5"
                >
                  <p className="text-2xl font-black text-forest">{value}</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-forest/52">
                    {label}
                  </p>
                  <p className="mt-2 text-xs font-bold leading-5 text-forest/58">
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <LaunchPass />
      </section>

      <section className="mx-auto mt-5 grid max-w-7xl gap-5 lg:grid-cols-[0.78fr_1.22fr]">
        <article className="rounded-[2rem] border border-forest/10 bg-white/82 p-5 shadow-xl shadow-forest/5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime/24 text-forest">
              <Gauge aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-leaf">
                Launch status
              </p>
              <h2 className="text-2xl font-black text-forest">
                Built for verified rewards.
              </h2>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {launchChecklist.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-forest/8 bg-off-white/72 p-4"
              >
                <span className="text-xs font-black uppercase tracking-[0.13em] text-forest/50">
                  {label}
                </span>
                <span className="text-right text-sm font-black text-forest">
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-leaf/15 bg-lime/16 p-4">
            <p className="text-sm font-black text-forest">
              TreeCoin is ready to explain clearly.
            </p>
            <p className="mt-2 text-sm font-bold leading-6 text-forest/64">
              Visitors can understand the rule in seconds: submit real proof,
              pass verification, then earn TreeCoins inside GrowCred.
            </p>
          </div>
        </article>

        <article className="rounded-[2rem] border border-forest/10 bg-white/82 p-5 shadow-xl shadow-forest/5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-leaf">
                Live reward feel
              </p>
              <h2 className="text-2xl font-black text-forest">
                Make visitors feel people are already growing.
              </h2>
            </div>
            <Link
              href="/community"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-forest/10 bg-white px-4 py-2.5 text-xs font-black text-forest shadow-sm transition hover:bg-lime/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
            >
              Community
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-5 grid gap-3">
            {activityFeed.map((item) => (
              <div
                key={`${item.name}-${item.action}`}
                className="grid gap-4 rounded-[1.5rem] border border-forest/8 bg-off-white/72 p-4 sm:grid-cols-[auto_1fr_auto]"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime/28 text-sm font-black text-forest">
                  {item.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-black text-forest">{item.name}</p>
                    <span className="text-xs font-bold text-forest/48">
                      {item.city}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-bold leading-6 text-forest/62">
                    {item.action}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className="rounded-full bg-lime/28 px-3 py-2 text-sm font-black text-forest">
                    {item.amount}
                  </span>
                  <span className="rounded-full border border-forest/10 bg-white px-3 py-2 text-xs font-black text-forest">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mx-auto mt-5 grid max-w-7xl gap-5 md:grid-cols-4">
        {rewardJourney.map((step, index) => (
          <article
            key={step.title}
            className="group rounded-[1.75rem] border border-forest/10 bg-white/78 p-5 shadow-xl shadow-forest/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-forest/10"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-lime/22 text-forest">
                <step.icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="text-xs font-black uppercase tracking-[0.18em] text-forest/40">
                0{index + 1}
              </span>
            </div>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-leaf">
              {step.label}
            </p>
            <h2 className="mt-2 text-lg font-black text-forest">
              {step.title}
            </h2>
            <p className="mt-3 text-sm font-bold leading-6 text-forest/62">
              {step.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-5 grid max-w-7xl gap-5 lg:grid-cols-[1.08fr_0.92fr]">
        <article className="overflow-hidden rounded-[2rem] border border-forest/10 bg-white/84 shadow-xl shadow-forest/5">
          <div className="grid min-h-full lg:grid-cols-[0.92fr_1.08fr]">
            <div className="forest-panel p-6 text-white sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-lime">
                {BRAND_TAGLINE}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">
                {BRAND_SLOGAN}
              </h2>
              <p className="mt-4 text-sm font-bold leading-7 text-white/72">
                Users should understand the reward instantly: clear proof,
                trusted review, then visible TreeCoins in their GrowCred record.
              </p>
              <div className="mt-6 grid gap-3">
                {proofQueue.map(([label, status, detail]) => (
                  <div
                    key={label}
                    className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-black">{label}</p>
                      <span className="rounded-full bg-lime px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-forest">
                        {status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-bold leading-5 text-white/64">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid content-center gap-3 bg-off-white p-4 sm:p-6">
              {proofQueue.map(([label, status, detail]) => (
                <div
                  key={`queue-${label}`}
                  className="rounded-[1.35rem] border border-forest/10 bg-white/78 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-forest">{label}</p>
                    <span className="rounded-full bg-lime/28 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-forest">
                      {status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-bold leading-5 text-forest/58">
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <div className="grid gap-5">
          <article className="rounded-[2rem] border border-forest/10 bg-white/82 p-6 shadow-xl shadow-forest/5 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime/24 text-forest">
                <Trophy aria-hidden="true" className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-leaf">
                  Reward rules
                </p>
                <h2 className="text-2xl font-black text-forest">
                  Clear before release.
                </h2>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {TREECOIN_REWARD_RULES.map((rule) => (
                <div
                  key={rule.title}
                  className="rounded-[1.35rem] border border-forest/8 bg-off-white/72 p-4"
                >
                  <h3 className="text-sm font-black text-forest">
                    {rule.title}
                  </h3>
                  <p className="mt-2 text-sm font-bold leading-6 text-forest/62">
                    {rule.description}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {trustCards.map((tile) => (
              <article
                key={tile.title}
                className="rounded-[1.75rem] border border-forest/10 bg-white/78 p-5 shadow-xl shadow-forest/5"
              >
                <tile.icon aria-hidden="true" className="h-6 w-6 text-leaf" />
                <h3 className="mt-4 text-base font-black text-forest">
                  {tile.title}
                </h3>
                <p className="mt-2 text-xs font-bold leading-5 text-forest/58">
                  {tile.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function LaunchPass() {
  return (
    <aside className="relative overflow-hidden rounded-[2.25rem] border border-forest/10 bg-gradient-to-br from-forest via-[#075226] to-[#02180f] p-6 text-white shadow-2xl shadow-forest/18 sm:p-8">
      <div
        aria-hidden="true"
        className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lime/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-28 left-8 h-56 w-56 rounded-full bg-aqua/18 blur-3xl"
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-lime">
              TreeCoin pass
            </p>
            <h2 className="mt-2 text-3xl font-black">Reward receipt</h2>
          </div>
          <Image
            src={GROWCRED_ASSETS.brand.treeCoin}
            alt="TreeCoin gold reward point"
            width={180}
            height={180}
            priority
            sizes="7rem"
            className="h-24 w-24 object-contain drop-shadow-2xl sm:h-28 sm:w-28"
          />
        </div>

        <div className="mt-8 rounded-[2rem] border border-white/12 bg-white/12 p-5 backdrop-blur">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/58">
                Next approval
              </p>
              <p className="mt-2 text-5xl font-black tracking-tight">+10</p>
              <p className="mt-1 text-sm font-extrabold text-lime">TreeCoins</p>
            </div>
            <span className="rounded-full bg-lime px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-forest">
              Under Review
            </span>
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/12">
            <div className="h-full w-[68%] rounded-full bg-lime shadow-[0_0_22px_rgba(163,255,18,0.45)]" />
          </div>
          <p className="mt-3 text-xs font-bold leading-5 text-white/68">
            Proof quality, permission, local suitability, and care promise are
            checked before release.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <PassStat label="Reward" value="TreeCoin" />
          <PassStat label="Amount" value="+10" />
          <PassStat label="Release" value="After review" />
          <PassStat label="Use" value="In app only" />
        </div>

        <div className="mt-5 rounded-[1.5rem] border border-lime/20 bg-lime/10 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-lime" />
            <p className="text-sm font-bold leading-6 text-white/76">
              Reward setup: whole-point TreeCoins, proof-bound release, and a
              non-transferable reward design.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function PassStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.35rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
      <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-white/50">
        {label}
      </p>
      <p className="mt-2 text-base font-black text-white">{value}</p>
    </div>
  );
}
