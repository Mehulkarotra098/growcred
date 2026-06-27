import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  CalendarCheck,
  Camera,
  CheckCircle2,
  Coins,
  Flame,
  Leaf,
  LockKeyhole,
  ShieldCheck,
  Sprout,
  Trees,
  UploadCloud,
} from "lucide-react";
import type { Badge, Tree } from "@/lib/types";
import { DashboardCard } from "@/components/dashboard-card";
import { LivingBackdrop } from "@/components/living-backdrop";
import { ReminderCenter } from "@/components/reminder-center";
import { SectionHeader } from "@/components/section-header";
import { StatusPill } from "@/components/status-pill";
import { TreeCard } from "@/components/tree-card";
import { brandAssets } from "@/lib/brand-assets";
import { GROWCRED_ASSETS } from "@/lib/assets";
import { TREECOIN_DISCLAIMER } from "@/lib/copy";
import {
  badges,
  careReminders,
  challenges,
  treeCoinLedger,
  trees,
  users,
} from "@/lib/mock-data";
import { cn, formatDate, formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard | GrowCred",
  description: "GrowCred impact dashboard with TreeCoins, trees, badges, and reminders.",
};

const badgeIconMap = {
  seedling: Sprout,
  leaf: Leaf,
  shield: ShieldCheck,
  planet: BadgeCheck,
  forest: Trees,
  camera: Camera,
};

const careDays = ["M", "T", "W", "T", "F", "S", "S"] as const;

export default function DashboardPage() {
  const user = users[0];
  const myTrees = trees.filter((tree) => tree.userId === user.id);
  const myLedger = treeCoinLedger.filter((item) => item.userId === user.id);
  const nextBadgeTarget = 10;
  const nextBadgeProgress = Math.min(
    100,
    Math.round((user.verifiedTrees / nextBadgeTarget) * 100),
  );

  return (
    <section className="relative isolate px-4 py-14 sm:px-6 lg:px-8">
      <LivingBackdrop />
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="Impact dashboard"
            title={`Welcome back, ${user.name.split(" ")[0]}.`}
            description="Track your TreeCoins, verified trees, care streak, badges, and the next action that keeps your impact growing."
          />
          <Link
            href="/submit-proof"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-black text-white shadow-xl shadow-forest/15 transition hover:bg-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
          >
            <UploadCloud aria-hidden="true" className="h-4 w-4" />
            Upload Care Proof
          </Link>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.82fr_0.82fr]">
          <ProgressPanel
            title="Progress to next badge"
            label="Tree Hero"
            value={`${user.verifiedTrees}/${nextBadgeTarget} verified trees`}
            progress={nextBadgeProgress}
            detail="Keep submitting care proof to unlock stronger badge status."
          />
          <NextRewardCard />
          <CareStreakCard />
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          <DashboardCard
            label="Total TreeCoins"
            value={formatNumber(user.totalTreeCoins)}
            detail="Reward points earned from verified care."
            icon={Coins}
          />
          <DashboardCard
            label="Trees submitted"
            value={String(myTrees.length)}
            detail="Proofs across draft, review, and verified states."
            icon={Trees}
          />
          <DashboardCard
            label="Verified trees"
            value={String(user.verifiedTrees)}
            detail="Accepted by admin verification."
            icon={BadgeCheck}
          />
          <DashboardCard
            label="Survival streak"
            value="42 days"
            detail="Keep care check-ins moving."
            icon={Flame}
          />
          <DashboardCard
            label="Next reminder"
            value="Tomorrow"
            detail="Water your neem tree."
            icon={Bell}
          />
        </div>

        <div className="mt-8 overflow-hidden rounded-[2.25rem] border border-forest/10 bg-white p-3 shadow-2xl shadow-forest/10">
          <Image
            src={GROWCRED_ASSETS.site.dashboardTrackImpact}
            alt="GrowCred dashboard showcase for TreeCoins, verified trees, care streaks, and impact tracking"
            width={1536}
            height={1024}
            priority
            sizes="(min-width: 1024px) 1180px, 92vw"
            className="aspect-[16/8] w-full rounded-[1.75rem] object-cover"
          />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-8">
            <section>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-black text-forest">My Trees</h2>
                <Link
                  href="/submit-proof"
                  className="inline-flex items-center gap-2 rounded-full border border-forest/10 bg-white px-4 py-2 text-sm font-black text-forest transition hover:bg-lime/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
                >
                  Upload Care Proof
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
              {myTrees.length > 0 ? (
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {myTrees.map((tree) => (
                    <TreeCard key={tree.id} tree={tree} />
                  ))}
                </div>
              ) : (
                <EmptyTreeState />
              )}
            </section>

            <TreeTimeline tree={myTrees[0]} />
          </div>

          <div className="grid gap-8">
            <div className="living-card rounded-[2rem] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-leaf">
                    Rewards
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-forest">
                    TreeCoin Ledger
                  </h2>
                </div>
                <Image
                  src={brandAssets.treeCoin}
                  alt="TreeCoin gold reward point"
                  width={80}
                  height={80}
                  className="h-14 w-14 shrink-0"
                />
              </div>
              <div className="mt-5 divide-y divide-forest/10">
                {myLedger.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-3 py-4 sm:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <p className="font-black text-forest">{item.action}</p>
                      <p className="text-sm font-bold text-forest/50">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 sm:justify-end">
                      <span className="font-black text-forest">
                        +{item.amount}
                      </span>
                      <StatusPill status={item.status} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 rounded-[1.25rem] bg-lime/20 p-4 text-xs font-bold leading-6 text-forest/70">
                {TREECOIN_DISCLAIMER}
              </p>
            </div>

            <section className="living-card rounded-[2rem] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-leaf">
                    Badge case
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-forest">
                    Locked and unlocked badges
                  </h2>
                </div>
                <BadgeCheck aria-hidden="true" className="h-7 w-7 text-leaf" />
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {badges.map((badge) => (
                  <BadgeStateCard
                    key={badge.id}
                    badge={badge}
                    unlocked={user.badges.includes(badge.id)}
                  />
                ))}
              </div>
            </section>

            <ReminderCenter
              reminders={careReminders.filter((item) => item.userId === user.id)}
            />

            <div className="forest-panel rounded-[2rem] p-6 text-white shadow-xl shadow-forest/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-lime">
                    Challenge progress
                  </p>
                  <h2 className="mt-3 text-2xl font-black">
                    {challenges[1].title}
                  </h2>
                </div>
                <Image
                  src={brandAssets.earnGreen}
                  alt=""
                  aria-hidden="true"
                  width={120}
                  height={120}
                  className="hidden h-16 w-16 shrink-0 sm:block"
                />
              </div>
              <div className="mt-5 h-3 rounded-full bg-white/15">
                <div className="h-3 w-[64%] rounded-full bg-lime" />
              </div>
              <p className="mt-3 text-sm font-bold text-white/70">
                64% complete with your campus team.
              </p>
              <Link
                href="/challenges"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-black text-forest transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
              >
                Join Challenge
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgressPanel({
  title,
  label,
  value,
  progress,
  detail,
}: {
  title: string;
  label: string;
  value: string;
  progress: number;
  detail: string;
}) {
  return (
    <article className="living-card rounded-[2rem] p-6">
      <p className="text-sm font-black uppercase tracking-[0.14em] text-leaf">
        {title}
      </p>
      <div className="mt-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-forest">{label}</h2>
          <p className="mt-1 text-sm font-bold text-forest/55">{value}</p>
        </div>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime/35 text-forest">
          <BadgeCheck aria-hidden="true" className="h-6 w-6" />
        </span>
      </div>
      <div className="mt-5 h-3 rounded-full bg-forest/10">
        <div
          className="h-3 rounded-full bg-leaf"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-sm font-bold leading-6 text-forest/65">
        {detail}
      </p>
    </article>
  );
}

function NextRewardCard() {
  return (
    <article className="living-card rounded-[2rem] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-leaf">
            Next reward unlock
          </p>
          <h2 className="mt-3 text-2xl font-black text-forest">
            30-day care check-in
          </h2>
        </div>
        <Image
          src={brandAssets.treeCoin}
          alt="TreeCoin gold reward point"
          width={74}
          height={74}
          className="h-12 w-12 shrink-0"
        />
      </div>
      <p className="mt-3 text-sm font-bold leading-6 text-forest/65">
        Upload fresh care proof for Peepal Pal to unlock +10 TreeCoins after
        approval.
      </p>
      <Link
        href="/submit-proof"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-black text-white transition hover:bg-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
      >
        Upload Care Proof
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    </article>
  );
}

function CareStreakCard() {
  return (
    <article className="living-card rounded-[2rem] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-leaf">
            Care streak
          </p>
          <h2 className="mt-3 text-2xl font-black text-forest">42 days</h2>
        </div>
        <Flame aria-hidden="true" className="h-8 w-8 text-leaf" />
      </div>
      <div className="mt-5 grid grid-cols-7 gap-2">
        {careDays.map((day, index) => (
          <div key={`${day}-${index}`} className="grid gap-2 text-center">
            <span
              className={cn(
                "grid aspect-square place-items-center rounded-full text-xs font-black",
                index < 5 ? "bg-leaf text-white" : "bg-lime/35 text-forest",
              )}
            >
              {index < 5 ? (
                <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
              ) : (
                day
              )}
            </span>
            <span className="text-[0.65rem] font-black text-forest/45">
              {day}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm font-bold leading-6 text-forest/65">
        Two care actions left this week to keep the streak alive.
      </p>
    </article>
  );
}

function TreeTimeline({ tree }: { tree?: Tree }) {
  if (!tree) return null;

  const items = [
    {
      label: "Planting proof verified",
      date: "Apr 21, 2026",
      status: "Verified",
      icon: CheckCircle2,
    },
    {
      label: "30-day care check-in",
      date: "May 20, 2026",
      status: "Verified",
      icon: CalendarCheck,
    },
    {
      label: "90-day survival proof",
      date: "Jun 10, 2026",
      status: "Verified",
      icon: ShieldCheck,
    },
    {
      label: "180-day survival proof",
      date: "Next milestone",
      status: "Locked",
      icon: LockKeyhole,
    },
  ];

  return (
    <section className="living-card rounded-[2rem] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-leaf">
            Tree status timeline
          </p>
          <h2 className="mt-1 text-2xl font-black text-forest">
            {tree.nickname}
          </h2>
        </div>
        <StatusPill status={tree.status} />
      </div>
      <div className="mt-6 grid gap-4">
        {items.map((item, index) => (
          <div
            key={item.label}
            className="grid grid-cols-[2.75rem_1fr] gap-4 rounded-[1.5rem] bg-white/70 p-4"
          >
            <span
              className={cn(
                "grid h-11 w-11 place-items-center rounded-2xl",
                index < 3 ? "bg-leaf text-white" : "bg-forest/10 text-forest/45",
              )}
            >
              <item.icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <p className="font-black text-forest">{item.label}</p>
              <p className="mt-1 text-sm font-bold text-forest/55">
                {item.date} · {item.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BadgeStateCard({
  badge,
  unlocked,
}: {
  badge: Badge;
  unlocked: boolean;
}) {
  const Icon = badgeIconMap[badge.icon as keyof typeof badgeIconMap] ?? BadgeCheck;

  return (
    <article
      className={cn(
        "rounded-[1.5rem] border p-5",
        unlocked
          ? "border-leaf/25 bg-lime/20"
          : "border-forest/10 bg-off-white/80 opacity-80",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "grid h-12 w-12 place-items-center rounded-2xl",
            unlocked ? "bg-leaf text-white" : "bg-forest/10 text-forest/45",
          )}
        >
          <Icon aria-hidden="true" className="h-6 w-6" />
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black",
            unlocked ? "bg-white text-forest" : "bg-forest/10 text-forest/55",
          )}
        >
          {unlocked ? (
            <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5 text-leaf" />
          ) : (
            <LockKeyhole aria-hidden="true" className="h-3.5 w-3.5" />
          )}
          {unlocked ? "Unlocked" : "Locked"}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-black text-forest">{badge.name}</h3>
      <p className="mt-2 text-sm leading-6 text-forest/65">
        {badge.description}
      </p>
      <p className="mt-4 rounded-full bg-white/70 px-3 py-2 text-xs font-black text-forest">
        {badge.requirement}
      </p>
    </article>
  );
}

function EmptyTreeState() {
  return (
    <div className="mt-5 rounded-[2rem] border border-dashed border-forest/20 bg-white/70 p-8 text-center">
      <Image
        src={GROWCRED_ASSETS.states.noTrees}
        alt="No trees yet empty state illustration"
        width={720}
        height={720}
        className="mx-auto h-auto w-40 rounded-[1.5rem] object-contain"
      />
      <h3 className="mt-4 text-2xl font-black text-forest">
        No trees yet.
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm font-bold leading-6 text-forest/60">
        Your first submitted tree, proof status, and reward preview will appear
        here after you submit proof.
      </p>
      <Link
        href="/submit-proof"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-black text-white transition hover:bg-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
      >
        Start Planting
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    </div>
  );
}
