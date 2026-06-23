"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Filter,
  Flame,
  Trophy,
  Users,
} from "lucide-react";
import type { Challenge } from "@/lib/types";
import { brandAssets } from "@/lib/brand-assets";
import { GROWCRED_ASSETS } from "@/lib/assets";
import { cn, formatDate, formatNumber } from "@/lib/utils";

const filters = [
  { label: "All", value: "all" },
  { label: "Solo", value: "solo" },
  { label: "Friends", value: "friends" },
  { label: "School", value: "school" },
  { label: "Campus", value: "campus" },
  { label: "City", value: "city" },
] as const;

type ChallengeFilter = (typeof filters)[number]["value"];

const challengeBanners: Record<string, string> = {
  "challenge-1": GROWCRED_ASSETS.site.challengeBanners.birthdayTree,
  "challenge-2": GROWCRED_ASSETS.site.challengeBanners.oneStudentOneTree,
  "challenge-3": GROWCRED_ASSETS.site.challengeBanners.friendsGreen,
};

interface ChallengeHubProps {
  challenges: Challenge[];
}

export function ChallengeHub({ challenges }: ChallengeHubProps) {
  const [activeFilter, setActiveFilter] = useState<ChallengeFilter>("all");
  const [joined, setJoined] = useState<Record<string, boolean>>({});

  const filteredChallenges = useMemo(() => {
    if (activeFilter === "all") return challenges;
    return challenges.filter((challenge) => challenge.category === activeFilter);
  }, [activeFilter, challenges]);

  const featured = challenges.reduce((best, challenge) =>
    challenge.participants > best.participants ? challenge : best,
  );
  const featuredBanner = challengeBanners[featured.id];

  return (
    <div className="mt-10 grid gap-8">
      <section className="forest-panel grid gap-6 overflow-hidden rounded-[2.25rem] p-6 text-white shadow-2xl shadow-forest/20 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
        <div>
          <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-lime">
            <Flame aria-hidden="true" className="h-4 w-4" />
            Featured mission
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight">
            {featured.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-white/72">
            {featured.description}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Metric label="Reward" value={`+${featured.reward}`} detail="TreeCoins" />
            <Metric
              label="Participants"
              value={formatNumber(featured.participants)}
              detail={featured.teamType}
            />
            <Metric label="Progress" value={`${featured.progress}%`} detail="Verified path" />
          </div>
        </div>
        <div className="rounded-[1.75rem] bg-white/10 p-3">
          {featuredBanner ? (
            <Image
              src={featuredBanner}
              alt={`${featured.title} GrowCred challenge banner`}
              width={1536}
              height={1024}
              className="mb-4 aspect-[16/9] w-full rounded-[1.35rem] object-cover"
            />
          ) : null}
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-black text-lime">Proof needed</p>
            <Image
              src={brandAssets.betterTogether}
              alt=""
              aria-hidden="true"
              width={260}
              height={180}
              className="hidden h-auto w-24 shrink-0 sm:block"
            />
          </div>
          <p className="mt-3 text-lg font-black">{featured.proofNeeded}</p>
          <div className="mt-5 h-3 rounded-full bg-white/15">
            <div
              className="h-3 rounded-full bg-lime"
              style={{ width: `${featured.progress}%` }}
            />
          </div>
          <button
            type="button"
            onClick={() => setJoined((current) => ({ ...current, [featured.id]: true }))}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-black text-forest transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
          >
            {joined[featured.id] ? "Joined" : "Join Featured Mission"}
            {joined[featured.id] ? (
              <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
            ) : (
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            )}
          </button>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-forest shadow-sm ring-1 ring-forest/10">
          <Filter aria-hidden="true" className="h-4 w-4 text-leaf" />
          Filter
        </span>
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            aria-pressed={activeFilter === filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf",
              activeFilter === filter.value
                ? "bg-forest text-white"
                : "border border-forest/10 bg-white text-forest hover:bg-lime/25",
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredChallenges.length === 0 ? (
          <div className="living-card rounded-[2rem] p-8 text-center md:col-span-2 xl:col-span-3">
            <Image
              src={GROWCRED_ASSETS.states.noChallenges}
              alt="No challenges empty state illustration"
              width={720}
              height={720}
              className="mx-auto h-auto w-44 rounded-[1.5rem] object-contain"
            />
            <h3 className="mt-4 text-2xl font-black text-forest">
              No missions in this filter.
            </h3>
            <p className="mt-2 text-sm font-bold leading-6 text-forest/60">
              Try another mission type to find a GrowCred challenge.
            </p>
          </div>
        ) : filteredChallenges.map((challenge) => (
          <article
            key={challenge.id}
            className="living-card flex min-h-[24rem] flex-col overflow-hidden rounded-[2rem]"
          >
            {challengeBanners[challenge.id] ? (
              <Image
                src={challengeBanners[challenge.id]}
                alt={`${challenge.title} GrowCred challenge banner`}
                width={1536}
                height={1024}
                className="aspect-[16/9] w-full object-cover"
              />
            ) : null}
            <div className="flex flex-1 flex-col p-6">
            <div className="flex items-start justify-between gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime/45 text-forest">
                <Trophy aria-hidden="true" className="h-6 w-6" />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf/15 px-3 py-1 text-xs font-black text-forest">
                <Image
                  src={brandAssets.treeCoin}
                  alt=""
                  aria-hidden="true"
                  width={28}
                  height={28}
                  className="h-5 w-5"
                />
                +{challenge.reward} TreeCoins
              </span>
            </div>
            <h3 className="mt-5 text-xl font-black text-forest">
              {challenge.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-6 text-forest/70">
              {challenge.description}
            </p>
            <div className="mt-5 grid gap-3 rounded-[1.5rem] bg-off-white p-4 text-sm font-bold text-forest/70">
              <p className="flex items-center gap-2">
                <Users aria-hidden="true" className="h-4 w-4 text-leaf" />
                {formatNumber(challenge.participants)} participants
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays aria-hidden="true" className="h-4 w-4 text-leaf" />
                Ends {formatDate(challenge.endDate)}
              </p>
              <p className="font-black text-forest">{challenge.proofNeeded}</p>
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-xs font-black text-forest/60">
                <span>Progress</span>
                <span>{challenge.progress}%</span>
              </div>
              <div className="mt-2 h-2.5 rounded-full bg-forest/10">
                <div
                  className="h-2.5 rounded-full bg-leaf"
                  style={{ width: `${challenge.progress}%` }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setJoined((current) => ({ ...current, [challenge.id]: true }))}
              className={cn(
                "mt-6 inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf",
                joined[challenge.id]
                  ? "bg-lime text-forest"
                  : "bg-forest text-white hover:bg-leaf",
              )}
            >
              {joined[challenge.id] ? "Joined" : "Join Challenge"}
              {joined[challenge.id] ? (
                <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
              ) : (
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              )}
            </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[1.25rem] bg-white/10 p-4">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-white/55">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-lime">{value}</p>
      <p className="text-xs font-bold text-white/60">{detail}</p>
    </div>
  );
}
