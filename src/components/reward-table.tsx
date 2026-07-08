import Image from "next/image";
import { brandAssets } from "@/lib/brand-assets";
import { TREECOIN_DISCLAIMER } from "@/lib/copy";
import { FadeIn } from "./motion";

const rewards = [
  ["Verified planting proof", 10],
  ["30-day care check-in", 10],
  ["90-day survival proof", 20],
  ["180-day survival proof", 30],
  ["1-year survival proof", 50],
] as const;

export function RewardTable() {
  return (
    <FadeIn className="living-card overflow-hidden">
      <div className="forest-panel flex items-center justify-between gap-4 border-b border-white/10 p-5 text-white">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-lime">
            TreeCoin Rewards
          </p>
          <h3 className="mt-1 text-2xl font-black">
            Earn for verified care.
          </h3>
          <p className="mt-2 max-w-md text-sm font-bold leading-6 text-white/68">
            Whole-point rewards released only after GrowCred verification.
          </p>
        </div>
        <Image
          src={brandAssets.treeCoin}
          alt="TreeCoin gold reward point"
          width={96}
          height={96}
          className="h-16 w-16 shrink-0"
        />
      </div>
      <div className="divide-y divide-forest/10">
        {rewards.map(([action, amount], index) => (
          <div
            key={action}
            className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-4"
          >
            <span className="flex items-center gap-3 font-bold text-forest">
              <span className="grid h-8 w-8 place-items-center rounded-[0.65rem] bg-lime/40 text-xs font-black">
                {index + 1}
              </span>
              {action}
            </span>
            <span className="inline-flex items-center gap-1 rounded-[0.75rem] bg-leaf/15 px-3 py-1 text-sm font-black text-forest">
              +{amount} TreeCoins
            </span>
          </div>
        ))}
      </div>
      <p className="relaxed-copy border-t border-forest/10 bg-lime/20 px-5 py-4 text-sm font-bold leading-6 text-forest">
        {TREECOIN_DISCLAIMER}
      </p>
    </FadeIn>
  );
}
