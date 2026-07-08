import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Trophy, Users } from "lucide-react";
import { CommunityHub } from "@/components/community-hub";
import { HumanActivityStrip } from "@/components/human-proof-board";
import { LivingBackdrop } from "@/components/living-backdrop";
import { SectionHeader } from "@/components/section-header";
import { GROWCRED_ASSETS } from "@/lib/assets";
import { TREECOIN_DISCLAIMER } from "@/lib/copy";
import {
  challengeStandings,
  cityStandings,
  schoolStandings,
  users,
} from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Community | GrowCred",
  description: "GrowCred community leaderboard for top growers, schools, cities, and challenges.",
};

export default function CommunityPage() {
  return (
    <section className="relative isolate px-4 py-14 sm:px-6 lg:px-8">
      <LivingBackdrop />
      <div className="product-page-shell mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <SectionHeader
          eyebrow="Community"
          title="Real trees. Real change."
          description="See verified impact across growers, schools, cities, and challenge teams."
          align="center"
        />
        <div className="mt-7 hidden flex-wrap justify-center gap-4 sm:flex">
          <Image
            src={GROWCRED_ASSETS.stickers.betterTogether}
            alt=""
            aria-hidden="true"
            width={360}
            height={240}
            loading="eager"
            className="float-soft h-auto w-36 sm:w-44"
          />
          <Image
            src={GROWCRED_ASSETS.stickers.smallActionsBigFuture}
            alt=""
            aria-hidden="true"
            width={220}
            height={220}
            className="float-soft-delay h-auto w-24 sm:w-28"
          />
        </div>
        <div className="mt-8">
          <HumanActivityStrip />
        </div>
        <CommunityHub
          users={users}
          schools={schoolStandings}
          cities={cityStandings}
          challenges={challengeStandings}
        />
        <p className="relaxed-copy mx-auto mt-8 max-w-3xl rounded-[1rem] bg-lime/20 p-4 text-center text-sm font-bold leading-6 text-forest/70">
          {TREECOIN_DISCLAIMER}
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            [Users, "8,200 Growers", "Students, creators, and local teams."],
            [Building2, "120 Schools", "Campus teams competing on survival."],
            [Trophy, "540 Missions", "Challenge actions submitted for review."],
          ].map(([Icon, title, text]) => (
            <article
              key={title as string}
              className="living-card p-5 sm:p-6"
            >
              <Icon aria-hidden="true" className="h-7 w-7 text-leaf" />
              <h2 className="mt-5 text-2xl font-black text-forest">
                {title as string}
              </h2>
              <p className="mt-2 text-sm font-bold text-forest/60">
                {text as string}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            href="/challenges"
            className="inline-flex items-center gap-2 rounded-[0.9rem] bg-forest px-5 py-3 text-sm font-black text-white transition hover:bg-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
          >
            Join a Mission
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
