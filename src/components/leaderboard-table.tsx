import type { User } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface LeaderboardTableProps {
  users: User[];
}

export function LeaderboardTable({ users }: LeaderboardTableProps) {
  const sorted = [...users].sort((a, b) => b.totalTreeCoins - a.totalTreeCoins);

  return (
    <div className="living-card overflow-hidden">
      <div className="hidden md:block">
        <div className="forest-panel grid grid-cols-[72px_1.3fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-4 text-sm font-black text-white">
          <span>Rank</span>
          <span>Grower</span>
          <span>City</span>
          <span>Verified Trees</span>
          <span>TreeCoins</span>
          <span>Badge</span>
        </div>
        <div className="divide-y divide-forest/10">
          {sorted.map((user, index) => (
            <div
              key={user.id}
              className="grid grid-cols-[72px_1.3fr_1fr_1fr_1fr_1fr] items-center gap-4 px-5 py-4"
            >
              <span className="text-lg font-black text-leaf">#{index + 1}</span>
              <GrowerIdentity user={user} />
              <span className="text-sm font-bold text-forest/60">
                {user.city}
              </span>
              <span className="text-sm font-black text-forest">
                {user.verifiedTrees}
              </span>
              <span className="text-sm font-black text-forest">
                {formatNumber(user.totalTreeCoins)}
              </span>
              <BadgeLabel user={user} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 p-4 md:hidden">
        {sorted.map((user, index) => (
          <article
            key={user.id}
            className="rounded-[0.78rem] border border-forest/10 bg-white/70 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-leaf">
                  Rank
                </p>
                <p className="mt-1 text-2xl font-black text-forest">
                  #{index + 1}
                </p>
              </div>
              <BadgeLabel user={user} />
            </div>
            <div className="mt-4">
              <GrowerIdentity user={user} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <MobileMetric label="City" value={user.city} />
              <MobileMetric
                label="Verified trees"
                value={String(user.verifiedTrees)}
              />
              <MobileMetric
                label="TreeCoins"
                value={formatNumber(user.totalTreeCoins)}
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function GrowerIdentity({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-lime/45 text-sm font-black text-forest">
        {user.avatarUrl}
      </span>
      <div>
        <p className="font-black text-forest">{user.name}</p>
        <p className="text-xs font-bold text-forest/50">{user.country}</p>
      </div>
    </div>
  );
}

function BadgeLabel({ user }: { user: User }) {
  const label =
    user.badges.length >= 4
      ? "Planet Protector"
      : user.badges.length >= 3
        ? "Tree Hero"
        : user.badges.length >= 2
          ? "Green Friend"
          : "Seed Starter";

  return (
    <span className="inline-flex rounded-full bg-lime/30 px-3 py-1 text-xs font-black text-forest">
      {label}
    </span>
  );
}

function MobileMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-[0.7rem] bg-off-white p-3">
      <p className="break-words text-[0.65rem] font-black uppercase tracking-[0.04em] text-forest/45">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-black leading-5 text-forest">
        {value}
      </p>
    </div>
  );
}
