"use client";

import { useState } from "react";
import { Award, Building2, MapPinned, Trophy, Users } from "lucide-react";
import type { CommunityStanding, User } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import { LeaderboardTable } from "./leaderboard-table";

type CommunityTab = "growers" | "schools" | "cities" | "challenges";

const tabs: Array<{
  id: CommunityTab;
  label: string;
  icon: typeof Users;
}> = [
  { id: "growers", label: "Top Growers", icon: Users },
  { id: "schools", label: "Top Schools", icon: Building2 },
  { id: "cities", label: "Top Cities", icon: MapPinned },
  { id: "challenges", label: "Top Challenges", icon: Trophy },
];

interface CommunityHubProps {
  users: User[];
  schools: CommunityStanding[];
  cities: CommunityStanding[];
  challenges: CommunityStanding[];
}

export function CommunityHub({
  users,
  schools,
  cities,
  challenges,
}: CommunityHubProps) {
  const [activeTab, setActiveTab] = useState<CommunityTab>("growers");

  const standings: Record<Exclude<CommunityTab, "growers">, CommunityStanding[]> = {
    schools,
    cities,
    challenges,
  };

  return (
    <div className="mt-10 grid gap-8">
      <div
        role="tablist"
        aria-label="Community leaderboard tabs"
        className="flex flex-wrap justify-center gap-3"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-[0.9rem] px-5 py-3 text-sm font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf",
              activeTab === tab.id
                ? "bg-forest text-white shadow-lg shadow-forest/15"
                : "border border-forest/10 bg-white text-forest hover:bg-lime/20",
            )}
          >
            <tab.icon aria-hidden="true" className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "growers" ? (
        <LeaderboardTable users={users} />
      ) : (
        <StandingCards items={standings[activeTab]} />
      )}
    </div>
  );
}

function StandingCards({ items }: { items: CommunityStanding[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <article
          key={item.id}
          className="rounded-[0.95rem] border border-forest/10 bg-white p-6 shadow-lg shadow-forest/5"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-[0.9rem] bg-lime/40 text-forest">
              <Award aria-hidden="true" className="h-6 w-6" />
            </span>
            <span className="rounded-[0.7rem] bg-forest px-3 py-1 text-xs font-black text-white">
              #{index + 1}
            </span>
          </div>
          <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-leaf">
            {item.rankLabel}
          </p>
          <h3 className="mt-2 text-xl font-black text-forest">{item.name}</h3>
          <p className="mt-1 text-sm font-bold text-forest/55">
            {item.location}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Metric label="Trees" value={formatNumber(item.verifiedTrees)} />
            <Metric label="TreeCoins" value={formatNumber(item.treeCoinsEarned)} />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {item.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-[0.7rem] bg-leaf/10 px-3 py-1 text-xs font-black text-forest"
              >
                {badge}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[0.75rem] bg-off-white p-3">
      <p className="text-lg font-black text-forest">{value}</p>
      <p className="text-xs font-bold text-forest/50">{label}</p>
    </div>
  );
}
