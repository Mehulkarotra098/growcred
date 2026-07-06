import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  BookOpen,
  CalendarCheck,
  Camera,
  Coins,
  Droplets,
  Flame,
  Globe2,
  Home,
  Leaf,
  LockKeyhole,
  Plus,
  ShieldCheck,
  Sprout,
  Trees,
  Trophy,
  Users,
} from "lucide-react";
import type { Badge, CareReminder, ProofStatus } from "@/lib/types";
import { LivingBackdrop } from "@/components/living-backdrop";
import { LocalImpactPanel } from "@/components/local-impact-panel";
import { LogoMark } from "@/components/logo-mark";
import { StatusPill } from "@/components/status-pill";
import { GROWCRED_ASSETS } from "@/lib/assets";
import { brandAssets } from "@/lib/brand-assets";
import { TREECOIN_DISCLAIMER } from "@/lib/copy";
import {
  badges,
  careReminders,
  challenges,
  treeCoinLedger,
  users,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

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

const dashboardNav = [
  { href: "/dashboard", label: "Dashboard", icon: Home, active: true },
  { href: "/dashboard#trees", label: "My Trees", icon: Sprout },
  { href: "/#rewards", label: "TreeCoins", icon: Coins },
  { href: "/dashboard#badges", label: "Badges", icon: ShieldCheck },
  { href: "/challenges", label: "Challenges", icon: Trophy },
  { href: "/community", label: "Community", icon: Users },
  { href: "/learn", label: "Learn", icon: BookOpen },
] as const;

const dashboardStats = [
  {
    label: "Total TreeCoins",
    value: "1,250",
    change: "+120 this month",
    image: brandAssets.treeCoin,
    imageAlt: "TreeCoin gold reward point",
  },
  {
    label: "Trees submitted",
    value: "24",
    change: "+5 this month",
    icon: Camera,
  },
  {
    label: "Verified trees",
    value: "18",
    change: "75% verified",
    icon: ShieldCheck,
  },
  {
    label: "Survival streak",
    value: "12 days",
    change: "Keep it growing",
    icon: Flame,
  },
] satisfies MetricCardProps[];

const treeRows = [
  {
    name: "Mango Tree",
    species: "Mangifera indica",
    status: "verified",
    coins: 50,
    image: GROWCRED_ASSETS.treeThumbnails.mango,
    imageAlt: "Healthy mango tree in a bright garden",
  },
  {
    name: "Neem Tree",
    species: "Azadirachta indica",
    status: "verified",
    coins: 50,
    image: GROWCRED_ASSETS.treeThumbnails.neem,
    imageAlt: "Healthy neem tree in a bright garden",
  },
  {
    name: "Gulmohar",
    species: "Delonix regia",
    status: "under_review",
    coins: 25,
    image: GROWCRED_ASSETS.treeThumbnails.gulmohar,
    imageAlt: "Flowering gulmohar tree in a bright garden",
  },
] satisfies Array<{
  name: string;
  species: string;
  status: ProofStatus;
  coins: number;
  image: string;
  imageAlt: string;
}>;

const communityStats = [
  { label: "Trees planted", value: "12,540", icon: Trees },
  { label: "Planters", value: "8,320", icon: Users },
  { label: "Tons CO2 tracked", value: "98.4", icon: Leaf },
  { label: "Cities active", value: "25", icon: Globe2 },
] as const;

const reminderMeta = [
  { label: "Tomorrow, 9 AM", icon: Droplets, tone: "aqua" },
  { label: "In 3 days", icon: CalendarCheck, tone: "earth" },
  { label: "This week", icon: Leaf, tone: "lime" },
] as const;

export default function DashboardPage() {
  const user = users[0];
  const recentLedger = treeCoinLedger
    .filter((item) => item.userId === user.id)
    .slice(0, 3);
  const nextChallenge = challenges[1];
  const unlockedBadges = badges.filter((badge) => user.badges.includes(badge.id));
  const recentBadges = [...unlockedBadges, ...badges].slice(0, 3);

  return (
    <section className="relative isolate px-3 py-8 sm:px-6 lg:px-8 lg:py-10">
      <LivingBackdrop />
      <div className="mx-auto max-w-[92rem]">
        <div className="dashboard-app-shell overflow-hidden rounded-[2rem] lg:rounded-[2.5rem]">
          <div className="grid min-h-[calc(100vh-9rem)] lg:grid-cols-[18.5rem_minmax(0,1fr)]">
            <DashboardSidebar />

            <div className="dashboard-main-surface min-w-0">
              <DashboardTopbar />

              <div className="px-4 pt-4 sm:px-5 xl:px-6">
                <LocalImpactPanel />
              </div>

              <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-[minmax(0,1fr)_21rem] xl:p-6">
                <section
                  aria-label="Dashboard stats"
                  className="grid gap-4 sm:grid-cols-2 xl:col-span-2 xl:grid-cols-4"
                >
                  {dashboardStats.map((stat) => (
                    <MetricCard key={stat.label} {...stat} />
                  ))}
                </section>

                <div className="grid min-w-0 gap-5">
                  <div className="grid gap-5 2xl:grid-cols-[0.95fr_0.9fr]">
                    <MyTreesPanel />
                    <ImpactPanel />
                  </div>

                  <CommunityImpactPanel />
                </div>

                <aside className="grid content-start gap-5">
                  <BadgeProgressPanel badges={recentBadges} />
                  <CareRemindersPanel />
                  <TreeCoinActionPanel ledger={recentLedger} challengeTitle={nextChallenge.title} />
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardSidebar() {
  return (
    <aside className="dashboard-sidebar border-b border-forest/10 p-4 sm:p-5 lg:border-b-0 lg:border-r lg:p-6">
      <div className="flex items-center justify-between gap-4 lg:block">
        <Link
          href="/"
          aria-label="GrowCred home"
          className="inline-flex rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leaf"
        >
          <LogoMark showWordmark size="sm" className="px-1.5" />
        </Link>
        <Link
          href="/submit-proof"
          className="inline-flex items-center gap-2 rounded-full bg-leaf px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-leaf/20 transition hover:bg-forest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf lg:hidden"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Add Tree
        </Link>
      </div>

      <nav
        aria-label="Dashboard navigation"
        className="no-scrollbar -mx-1 mt-5 flex gap-2 overflow-x-auto pb-1 lg:mx-0 lg:grid lg:overflow-visible lg:pb-0"
      >
        {dashboardNav.map((item) => {
          const isActive = "active" in item && item.active;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-[1.25rem] px-4 py-3 text-sm font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf",
                isActive
                  ? "bg-lime/25 text-forest shadow-sm ring-1 ring-leaf/10"
                  : "text-forest/70 hover:bg-white/70 hover:text-forest",
              )}
            >
              <item.icon aria-hidden="true" className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 hidden rounded-[1.75rem] border border-forest/10 bg-white/70 p-5 shadow-sm shadow-forest/5 lg:block">
        <div className="inline-flex rounded-2xl bg-lime/35 p-3 text-forest">
          <Users aria-hidden="true" className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-lg font-black text-forest">
          Invite friends. Grow together.
        </h2>
        <p className="mt-3 text-sm font-bold leading-6 text-forest/62">
          Earn bonus TreeCoins when friends plant and verify real tree care.
        </p>
        <Link
          href="/community"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-leaf px-5 py-3 text-sm font-black text-white transition hover:bg-forest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
        >
          Join a Mission
        </Link>
      </div>
    </aside>
  );
}

function DashboardTopbar() {
  return (
    <header className="dashboard-topbar px-4 py-5 sm:px-6 lg:px-7">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="max-w-full text-2xl font-black leading-tight tracking-tight text-forest sm:text-3xl">
            <span className="block sm:inline">Good morning,</span>{" "}
            <span className="block sm:inline">Green Champion.</span>
          </p>
          <p className="mt-2 max-w-[17rem] text-sm font-bold leading-6 text-forest/62 sm:max-w-xl sm:text-base">
            Track your impact. Earn rewards. Grow a greener tomorrow.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-[0.85fr_1.15fr_1.05fr] xl:w-[42rem] xl:min-w-0">
          <TopChip
            icon={Flame}
            label="Day streak"
            value="12"
            tone="fire"
          />
          <TopChip
            icon={CalendarCheck}
            label="Reminder"
            value="Tomorrow, 9 AM"
            tone="leaf"
          />
          <ProfileChip />
        </div>
      </div>
    </header>
  );
}

function TopChip({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: "fire" | "leaf";
}) {
  return (
    <div className="dashboard-panel flex items-center gap-3 rounded-[1.35rem] p-3">
      <span
        className={cn(
          "grid h-11 w-11 shrink-0 place-items-center rounded-2xl",
          tone === "fire" ? "bg-orange-100 text-orange-600" : "bg-lime/30 text-forest",
        )}
      >
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-[0.68rem] font-black uppercase leading-4 tracking-[0.06em] text-forest/45">
          {label}
        </p>
        <p className="mt-1 text-sm font-black leading-5 text-forest">{value}</p>
      </div>
    </div>
  );
}

function ProfileChip() {
  return (
    <Link
      href="/auth"
      className="dashboard-panel flex items-center gap-3 rounded-[1.35rem] p-3 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest text-sm font-black text-white">
        GC
      </span>
      <div className="min-w-0">
        <p className="text-sm font-black leading-5 text-forest">Green Champion</p>
        <p className="mt-0.5 text-xs font-bold leading-4 text-leaf">Level 3 Planter</p>
      </div>
      <ArrowRight aria-hidden="true" className="ml-auto h-4 w-4 shrink-0 text-forest/45" />
    </Link>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  icon?: LucideIcon;
  image?: string;
  imageAlt?: string;
}

function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  image,
  imageAlt = "",
}: MetricCardProps) {
  return (
    <article className="dashboard-panel rounded-[1.75rem] p-5">
      <div className="flex items-center gap-4">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-[1.35rem] bg-lime/22 text-forest">
          {image ? (
            <Image
              src={image}
              alt={imageAlt}
              width={96}
              height={96}
              sizes="4rem"
              className="h-14 w-14 object-contain drop-shadow-md"
            />
          ) : Icon ? (
            <Icon aria-hidden="true" className="h-7 w-7" />
          ) : null}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-forest/62">{label}</p>
          <p className="mt-1 text-3xl font-black tracking-tight text-forest">
            {value}
          </p>
          <p className="mt-1 text-sm font-black text-leaf">{change}</p>
        </div>
      </div>
    </article>
  );
}

function MyTreesPanel() {
  return (
    <section id="trees" className="dashboard-panel rounded-[2rem] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.12em] text-leaf">
            My Trees
          </p>
          <h2 className="mt-1 text-xl font-black text-forest">Living proof list</h2>
        </div>
        <Link
          href="/submit-proof"
          className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-black text-leaf transition hover:bg-lime/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
        >
          View all
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-5 overflow-hidden rounded-[1.55rem] border border-forest/10 bg-white/55">
        {treeRows.map((tree, index) => (
          <article
            key={tree.name}
            className={cn(
              "grid gap-3 p-3 sm:grid-cols-[4.7rem_1fr_auto] sm:items-center sm:p-4",
              index > 0 && "border-t border-forest/10",
            )}
          >
            <div className="relative h-20 overflow-hidden rounded-[1.35rem] bg-lime/15 ring-1 ring-forest/10">
              <Image
                src={tree.image}
                alt={tree.imageAlt}
                fill
                sizes="(max-width: 640px) 100vw, 5rem"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="font-black text-forest">{tree.name}</p>
              <p className="mt-1 text-sm font-bold italic text-forest/55">
                {tree.species}
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <StatusPill status={tree.status} />
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-black text-forest ring-1 ring-forest/10">
                +{tree.coins}
                <Image
                  src={brandAssets.treeCoin}
                  alt=""
                  aria-hidden="true"
                  width={36}
                  height={36}
                  sizes="1.25rem"
                  className="h-5 w-5 object-contain"
                />
              </span>
            </div>
          </article>
        ))}
      </div>

      <Link
        href="/submit-proof"
        className="mt-5 flex items-center justify-center gap-2 rounded-[1.35rem] border border-dashed border-leaf/40 bg-lime/12 px-4 py-4 text-sm font-black text-leaf transition hover:bg-lime/22 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
      >
        <Plus aria-hidden="true" className="h-4 w-4" />
        Add New Tree
      </Link>
    </section>
  );
}

function ImpactPanel() {
  const progress = 72;

  return (
    <section className="dashboard-panel rounded-[2rem] p-5">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.12em] text-leaf">
          Impact this month
        </p>
        <h2 className="mt-1 text-xl font-black text-forest">
          You are making a real difference.
        </h2>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[13rem_1fr] md:items-center 2xl:grid-cols-1">
        <div
          className="impact-ring mx-auto grid h-48 w-48 place-items-center rounded-full p-4 shadow-inner"
          style={{ "--progress": progress } as CSSProperties}
          role="img"
          aria-label={`${progress}% impact goal progress`}
        >
          <div className="grid h-full w-full place-items-center rounded-full bg-white/90 text-center shadow-inner">
            <Sprout aria-hidden="true" className="mx-auto h-8 w-8 text-leaf" />
            <p className="mt-2 text-4xl font-black text-forest">{progress}%</p>
            <p className="text-sm font-bold text-forest/58">Impact goal</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <ImpactMini icon={ShieldCheck} value="18" label="Trees verified" />
          <ImpactMini icon={Leaf} value="240 kg" label="CO2 tracked" />
          <ImpactMini icon={Users} value="12" label="Lives impacted" />
        </div>
      </div>

      <Link
        href="/submit-proof"
        className="mt-6 flex items-center justify-center gap-2 rounded-[1.35rem] border border-leaf/20 bg-lime/10 px-4 py-4 text-sm font-black text-forest transition hover:bg-lime/22 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
      >
        Upload Care Proof
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    </section>
  );
}

function ImpactMini({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="dashboard-soft-tile rounded-[1.25rem] p-3">
      <Icon aria-hidden="true" className="mx-auto h-5 w-5 text-leaf" />
      <p className="mt-2 text-lg font-black text-forest">{value}</p>
      <p className="mt-1 text-[0.68rem] font-bold leading-4 text-forest/55">
        {label}
      </p>
    </div>
  );
}

function BadgeProgressPanel({ badges: badgeList }: { badges: Badge[] }) {
  const progress = 65;

  return (
    <section id="badges" className="dashboard-panel rounded-[2rem] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.12em] text-leaf">
            Badge Progress
          </p>
          <h2 className="mt-1 text-xl font-black text-forest">Level 3 Planter</h2>
        </div>
        <Link
          href="/dashboard#badges"
          className="rounded-full px-3 py-2 text-sm font-black text-leaf transition hover:bg-lime/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
        >
          View all
        </Link>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-lime/30 ring-8 ring-lime/12">
          <Image
            src={brandAssets.logoMark}
            alt=""
            aria-hidden="true"
            width={96}
            height={96}
            sizes="4.5rem"
            className="h-14 w-14 object-contain"
          />
        </span>
        <div className="min-w-0 flex-1">
          <div className="h-3 rounded-full bg-forest/10">
            <div
              className="h-3 rounded-full bg-leaf"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-bold text-forest/60">
            650 / 1000 XP to unlock Green Guardian
          </p>
        </div>
      </div>

      <p className="mt-6 text-sm font-black text-forest">Recent badges</p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {badgeList.map((badge, index) => (
          <BadgeToken
            key={`${badge.id}-${index}`}
            badge={badge}
            unlocked={index < 2}
          />
        ))}
      </div>
    </section>
  );
}

function BadgeToken({ badge, unlocked }: { badge: Badge; unlocked: boolean }) {
  const Icon = badgeIconMap[badge.icon as keyof typeof badgeIconMap] ?? BadgeCheck;

  return (
    <div
      className={cn(
        "dashboard-soft-tile rounded-[1.25rem] p-3 text-center",
        !unlocked && "opacity-60",
      )}
    >
      <span
        className={cn(
          "mx-auto grid h-12 w-12 place-items-center rounded-2xl",
          unlocked ? "bg-lime/35 text-forest" : "bg-forest/10 text-forest/55",
        )}
      >
        {unlocked ? (
          <Icon aria-hidden="true" className="h-6 w-6" />
        ) : (
          <LockKeyhole aria-hidden="true" className="h-5 w-5" />
        )}
      </span>
      <p className="mt-2 line-clamp-2 text-[0.68rem] font-black leading-4 text-forest">
        {badge.name}
      </p>
      <p className="mt-1 text-[0.65rem] font-bold text-forest/50">
        {unlocked ? "Unlocked" : "Locked"}
      </p>
    </div>
  );
}

function CareRemindersPanel() {
  const scheduledReminders = careReminders
    .filter(
      (reminder) =>
        reminder.userId === "user-1" && reminder.status === "scheduled",
    )
    .slice(0, 3);
  const nextReminder = scheduledReminders[0];

  return (
    <section className="dashboard-panel rounded-[2rem] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.12em] text-leaf">
            Care Reminders
          </p>
          <h2 className="mt-1 text-xl font-black text-forest">
            {scheduledReminders.length} upcoming actions
          </h2>
        </div>
        <Bell aria-hidden="true" className="h-6 w-6 text-leaf" />
      </div>

      {nextReminder ? (
        <div className="mt-5 overflow-hidden rounded-[1.55rem] border border-leaf/18 bg-gradient-to-br from-forest via-[#075226] to-[#02180f] p-4 text-white shadow-lg shadow-forest/12">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-lime text-forest">
              <Droplets aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-lime">
                Next care action
              </p>
              <h3 className="mt-1 text-base font-black">
                Water {nextReminder.treeNickname}
              </h3>
              <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-white/68">
                {nextReminder.message}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-black">
            <span className="rounded-full bg-white/12 px-3 py-2">
              Tomorrow, 9 AM
            </span>
            <span className="rounded-full bg-white/12 px-3 py-2 capitalize">
              {formatReminderChannel(nextReminder.channel)}
            </span>
          </div>
        </div>
      ) : null}

      <div className="mt-4 grid gap-2.5">
        {scheduledReminders.map((reminder, index) => {
          const meta = reminderMeta[index] ?? reminderMeta[reminderMeta.length - 1];
          const Icon = meta.icon;

          return (
            <div
              key={reminder.id}
              className="dashboard-soft-tile grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[1.25rem] p-3"
            >
              <span
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-full",
                  meta.tone === "aqua" && "bg-aqua/12 text-aqua",
                  meta.tone === "earth" && "bg-earth/12 text-earth",
                  meta.tone === "lime" && "bg-lime/25 text-forest",
                )}
              >
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-forest">
                  {formatReminderTitle(reminder, index)}
                </p>
                <p className="mt-1 truncate text-xs font-bold text-forest/55">
                  {reminder.treeNickname}
                </p>
              </div>
              <span className="rounded-full bg-lime/20 px-3 py-1.5 text-[0.68rem] font-black text-forest">
                {meta.label}
              </span>
            </div>
          );
        })}
      </div>

      {scheduledReminders.length === 0 ? (
        <div className="mt-5 rounded-[1.35rem] border border-dashed border-leaf/25 bg-lime/10 p-4 text-sm font-bold leading-6 text-forest/62">
          No care reminders are waiting. Add a tree or upload proof to create
          the next care milestone.
        </div>
      ) : null}

      <Link
        href="/submit-proof"
        className="mt-5 flex items-center justify-center gap-2 rounded-[1.35rem] border border-leaf/20 bg-white/72 px-4 py-3 text-sm font-black text-forest transition hover:bg-lime/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
      >
        <Sprout aria-hidden="true" className="h-4 w-4" />
        Log Care Activity
      </Link>
    </section>
  );
}

function formatReminderTitle(reminder: CareReminder, index: number) {
  if (index === 0) {
    return "Water check";
  }

  if (reminder.message.toLowerCase().includes("proof")) {
    return "Care proof window";
  }

  return "Tree health check";
}

function formatReminderChannel(channel: CareReminder["channel"]) {
  return channel === "in_app" ? "in app" : channel;
}

function TreeCoinActionPanel({
  ledger,
  challengeTitle,
}: {
  ledger: typeof treeCoinLedger;
  challengeTitle: string;
}) {
  return (
    <section className="forest-panel overflow-hidden rounded-[2rem] p-5 text-white shadow-xl shadow-forest/20">
      <div className="flex items-start gap-4">
        <Image
          src={brandAssets.treeCoin}
          alt="TreeCoin gold reward point"
          width={120}
          height={120}
          sizes="4.5rem"
          className="h-16 w-16 shrink-0 object-contain drop-shadow-xl"
        />
        <div>
          <p className="text-sm font-black uppercase tracking-[0.12em] text-lime">
            Earn More TreeCoins
          </p>
          <h2 className="mt-2 text-xl font-black">
            Complete care actions and climb the leaderboard.
          </h2>
        </div>
      </div>

      <div className="mt-5 rounded-[1.35rem] bg-white/10 p-4">
        <p className="text-sm font-black text-lime">Active challenge</p>
        <p className="mt-1 text-sm font-semibold leading-6 text-white/78">
          {challengeTitle}
        </p>
      </div>

      <div className="mt-4 grid gap-2">
        {ledger.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-[1rem] bg-white/10 px-3 py-2 text-sm"
          >
            <span className="font-semibold text-white/78">{item.action}</span>
            <span className="font-black text-lime">+{item.amount}</span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs font-semibold leading-5 text-white/68">
        {TREECOIN_DISCLAIMER}
      </p>

      <Link
        href="/challenges"
        className="mt-5 flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-forest transition hover:bg-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
      >
        <Trophy aria-hidden="true" className="h-4 w-4" />
        Explore Challenges
      </Link>
    </section>
  );
}

function CommunityImpactPanel() {
  return (
    <section className="dashboard-panel rounded-[2rem] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.12em] text-leaf">
            Community impact
          </p>
          <h2 className="mt-1 text-xl font-black text-forest">
            Together, we are creating a greener, better world.
          </h2>
        </div>
        <Link
          href="/community"
          className="inline-flex items-center gap-2 rounded-full bg-lime/18 px-4 py-2 text-sm font-black text-forest transition hover:bg-lime/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
        >
          Join a Mission
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {communityStats.map((stat) => (
          <div
            key={stat.label}
            className="dashboard-soft-tile flex items-center gap-3 rounded-[1.25rem] p-4"
          >
            <stat.icon aria-hidden="true" className="h-7 w-7 shrink-0 text-leaf" />
            <div>
              <p className="text-xl font-black text-forest">{stat.value}</p>
              <p className="mt-1 text-xs font-bold text-forest/55">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-[1.35rem] bg-lime/16 p-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest text-xs font-black text-white">
          MR
        </span>
        <p className="text-sm font-bold leading-6 text-forest/72">
          Maya from Bengaluru just unlocked the Impact Hero badge.
        </p>
      </div>
    </section>
  );
}
