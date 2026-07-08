import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  MapPinned,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { GROWCRED_ASSETS } from "@/lib/assets";
import { BRAND_TAGLINE, SUPPORTING_LINE, TREECOIN_DISCLAIMER } from "@/lib/copy";
import { LivingBackdrop } from "./living-backdrop";
import { FadeIn } from "./motion";
import { StickerBadge } from "./sticker-badge";

const trustNotes = [
  ["Human review", "Proof is checked for context, permission, and care intent."],
  ["Survival-first", "Rewards grow when people return for real care updates."],
  ["Public impact", "Cities, schools, and growers can see verified progress."],
] as const;

const proofSignals = [
  { label: "Photo evidence", icon: BadgeCheck },
  { label: "Location context", icon: MapPinned },
  { label: "Care reminder", icon: Clock3 },
  { label: "Reviewer decision", icon: ShieldCheck },
] as const;

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden px-4 pb-10 pt-7 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
      <LivingBackdrop />
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <FadeIn className="max-w-3xl lg:py-12">
          <StickerBadge className="gap-1.5">
            <span>GrowCred</span>
            <span>community</span>
          </StickerBadge>

          <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-leaf sm:text-sm sm:tracking-[0.18em]">
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            {BRAND_TAGLINE}
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[1.04] tracking-tight text-forest sm:text-6xl sm:leading-[1.03] lg:text-7xl">
            Grow good. Earn green.
          </h1>

          <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-forest/72 sm:mt-6 sm:text-xl sm:leading-8">
            {SUPPORTING_LINE} Plant responsibly, upload proof a reviewer can
            trust, and return with care updates until the tree survives.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/submit-proof"
              className="inline-flex items-center justify-center gap-2 rounded-[0.85rem] bg-forest px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-forest/15 transition hover:bg-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf sm:px-6 sm:py-4"
            >
              Start Planting
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-[0.85rem] border border-forest/12 bg-white/78 px-5 py-3.5 text-sm font-black text-forest shadow-sm transition hover:bg-lime/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf sm:px-6 sm:py-4"
            >
              View Dashboard
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.12}>
          <figure className="human-proof-board overflow-hidden p-2.5 sm:p-3">
            <div className="gc-media-frame relative aspect-[16/9]">
              <Image
                src={GROWCRED_ASSETS.site.heroLanding}
                alt="GrowCred app preview showing tree proof, verified care, and TreeCoin rewards"
                fill
                priority
                sizes="(min-width: 1024px) 52vw, 94vw"
                className="object-cover"
              />
            </div>
            <figcaption className="grid gap-3 px-1 pb-1 pt-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(14rem,0.8fr)] sm:items-stretch sm:px-2">
              <div>
                <p className="text-sm font-black text-forest">
                  Real tree care, reviewed before rewards.
                </p>
                <p className="mt-1 text-xs font-bold leading-5 text-forest/58">
                  Proof, permission, and care commitment stay visible from the
                  first upload to the next survival check-in.
                </p>
              </div>
              <p className="rounded-[0.75rem] bg-lime/18 px-4 py-3 text-xs font-black leading-5 text-forest">
                {TREECOIN_DISCLAIMER}
              </p>
            </figcaption>
          </figure>
        </FadeIn>
      </div>

      <div className="mx-auto mt-8 grid max-w-7xl gap-3 lg:mt-7 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="grid gap-3 sm:grid-cols-3">
          {trustNotes.map(([title, text]) => (
            <article key={title} className="human-card p-4">
              <p className="text-sm font-black text-forest">{title}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-forest/58">
                {text}
              </p>
            </article>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {proofSignals.map((signal) => (
            <div
              key={signal.label}
              className="flex items-center gap-3 rounded-[0.8rem] border border-forest/10 bg-white/68 px-4 py-3 text-sm font-black text-forest shadow-sm shadow-forest/5"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-lime/32 text-forest">
                <signal.icon aria-hidden="true" className="h-4 w-4" />
              </span>
              {signal.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
