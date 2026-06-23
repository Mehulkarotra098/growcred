import Image from "next/image";
import { ArrowRight, Trophy } from "lucide-react";
import type { Challenge } from "@/lib/types";
import { brandAssets } from "@/lib/brand-assets";
import { GROWCRED_ASSETS } from "@/lib/assets";
import { formatNumber } from "@/lib/utils";
import { HoverLift } from "./motion";

interface ChallengeCardProps {
  challenge: Challenge;
}

const challengeBanners: Record<string, string> = {
  "challenge-1": GROWCRED_ASSETS.site.challengeBanners.birthdayTree,
  "challenge-2": GROWCRED_ASSETS.site.challengeBanners.oneStudentOneTree,
  "challenge-3": GROWCRED_ASSETS.site.challengeBanners.friendsGreen,
};

const challengeStickers: Record<string, string> = {
  "challenge-1": GROWCRED_ASSETS.stickers.birthdayTreeReward,
  "challenge-2": GROWCRED_ASSETS.stickers.plantToday,
  "challenge-3": GROWCRED_ASSETS.stickers.betterTogether,
};

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const banner = challengeBanners[challenge.id];
  const sticker = challengeStickers[challenge.id];

  return (
    <HoverLift className="h-full">
      <article className="living-card flex h-full flex-col overflow-hidden rounded-[2rem]">
        {banner ? (
          <div className="relative aspect-[16/9] bg-lime/15">
            <Image
              src={banner}
              alt={`${challenge.title} GrowCred challenge banner`}
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime/45 text-forest shadow-inner">
            <Trophy aria-hidden="true" className="h-6 w-6" />
          </span>
          {sticker ? (
            <Image
              src={sticker}
              alt=""
              aria-hidden="true"
              width={160}
              height={160}
              className="hidden h-14 w-14 object-contain sm:block"
            />
          ) : null}
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
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-sm font-bold text-forest/55">
            {formatNumber(challenge.participants)} participants
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm font-black text-white transition hover:bg-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
          >
            Join
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
        </div>
      </article>
    </HoverLift>
  );
}
