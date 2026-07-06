import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  MapPinned,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { HumanProofBoard } from "./human-proof-board";
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
    <section className="relative isolate overflow-hidden px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8">
      <LivingBackdrop />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <FadeIn className="max-w-3xl lg:pt-24">
          <div className="flex flex-wrap gap-2">
            <StickerBadge>Real tree proof</StickerBadge>
            <StickerBadge>Care reminders</StickerBadge>
            <StickerBadge>Reward-only TreeCoins</StickerBadge>
          </div>

          <p className="mt-8 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-leaf">
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            Plant. Prove. Protect.
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-tight text-forest sm:text-6xl lg:text-7xl">
            Grow good. Earn green.
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-forest/72 sm:text-xl">
            GrowCred helps people plant responsibly, upload proof a reviewer can
            trust, and keep coming back until the tree survives.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/submit-proof"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-4 text-sm font-black text-white shadow-xl shadow-forest/18 transition hover:bg-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
            >
              Start Planting
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-forest/12 bg-white/78 px-6 py-4 text-sm font-black text-forest shadow-sm transition hover:bg-lime/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
            >
              View Dashboard
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.12}>
          <HumanProofBoard />
        </FadeIn>
      </div>

      <div className="mx-auto mt-8 grid max-w-7xl gap-3 lg:mt-7 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-3 sm:grid-cols-3">
          {trustNotes.map(([title, text]) => (
            <article key={title} className="human-card rounded-[1.35rem] p-4">
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
              className="flex items-center gap-3 rounded-full border border-forest/10 bg-white/68 px-4 py-3 text-sm font-black text-forest shadow-sm shadow-forest/5"
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
