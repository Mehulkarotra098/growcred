import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Droplets,
  MapPinned,
  Sparkles,
} from "lucide-react";
import { brandAssets } from "@/lib/brand-assets";
import { FadeIn } from "./motion";
import { StickerBadge } from "./sticker-badge";
import { LivingBackdrop } from "./living-backdrop";

const proofSignals = [
  [Camera, "Photo"],
  [MapPinned, "Location"],
  [Droplets, "Care"],
  [BadgeCheck, "Verified"],
] as const;

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden px-4 pb-16 pt-10 sm:px-6 sm:pt-16 lg:px-8">
      <LivingBackdrop />
      <div className="mx-auto grid max-w-7xl gap-12 lg:min-h-[calc(100vh-6rem)] lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <FadeIn className="max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <StickerBadge>Real trees</StickerBadge>
            <StickerBadge>Proof-first</StickerBadge>
            <StickerBadge>Tree care rewards</StickerBadge>
          </div>
          <p className="mt-8 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-leaf">
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            Plant. Prove. Protect.
          </p>
          <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-tight text-forest sm:text-6xl lg:text-7xl">
            Grow good. Earn green.
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-forest/70 sm:text-xl">
            GrowCred turns tree planting into a living impact journey: plant
            the right tree, prove the action, protect it over time, and earn
            TreeCoins for verified care.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/submit-proof"
              className="kinetic-border isolate inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-4 text-sm font-black text-white shadow-xl shadow-forest/20 transition hover:bg-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
            >
              Start Planting
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href="/treecoin"
              className="inline-flex items-center justify-center rounded-full border border-forest/15 bg-white px-6 py-4 text-sm font-black text-forest shadow-sm transition hover:bg-lime/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
            >
              Explore TreeCoin
            </Link>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              ["01", "Plant with permission"],
              ["02", "Upload proof"],
              ["03", "Unlock rewards"],
            ].map(([step, label]) => (
              <div
                key={step}
                className="rounded-[1.25rem] border border-forest/10 bg-white/80 p-4 shadow-sm shadow-forest/5 backdrop-blur"
              >
                <p className="text-xs font-black text-leaf">{step}</p>
                <p className="mt-1 text-sm font-black leading-5 text-forest">
                  {label}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Image
              src={brandAssets.betterTogether}
              alt=""
              aria-hidden="true"
              width={360}
              height={240}
              className="float-soft h-auto w-36 sm:w-44"
            />
            <Image
              src={brandAssets.earnGreen}
              alt=""
              aria-hidden="true"
              width={260}
              height={260}
              className="float-soft-delay h-auto w-20 sm:w-24"
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.12} className="relative">
          <div className="kinetic-border rounded-[2.5rem]">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-3 shadow-2xl shadow-forest/15">
              <Image
                src={brandAssets.heroTreeCare}
                alt="GrowCred tree care visual with sapling, proof app, and TreeCoin reward"
                width={1600}
                height={1000}
                priority
                sizes="(min-width: 1024px) 52vw, 92vw"
                className="aspect-[16/10] w-full rounded-[2rem] object-cover"
              />
              <svg
                aria-hidden="true"
                viewBox="0 0 620 360"
                className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)]"
              >
                <path
                  d="M86 265 C190 225, 252 318, 333 250 S470 134, 546 92"
                  fill="none"
                  stroke="#00D4D8"
                  strokeLinecap="round"
                  strokeWidth="5"
                  className="proof-path opacity-80"
                />
              </svg>
              <div className="brand-lockup-shell absolute left-5 top-5 hidden rounded-2xl px-4 py-3 backdrop-blur sm:block">
                <Image
                  src={brandAssets.logoLockup}
                  alt="GrowCred - Plant. Prove. Protect."
                  width={2048}
                  height={640}
                  className="theme-logo-light h-auto w-48 object-contain"
                />
                <Image
                  src={brandAssets.logoLockupDark}
                  alt="GrowCred - Plant. Prove. Protect."
                  width={2048}
                  height={640}
                  className="theme-logo-dark h-auto w-48 object-contain"
                />
              </div>
              <div className="absolute bottom-5 left-5 max-w-[16rem] rounded-[1.5rem] border border-forest/10 bg-white/92 p-4 shadow-xl shadow-forest/10 backdrop-blur">
                <div className="flex items-center gap-3">
                  <Image
                    src={brandAssets.treeCoin}
                    alt=""
                    aria-hidden="true"
                    width={64}
                    height={64}
                    className="h-12 w-12 shrink-0"
                  />
                  <div>
                    <p className="text-sm font-black text-forest">
                      +10 TreeCoins
                    </p>
                    <p className="text-xs font-bold text-forest/55">
                      Planting proof approved
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute right-5 top-5 grid gap-2 rounded-[1.5rem] border border-white/80 bg-white/88 p-3 shadow-xl shadow-forest/10 backdrop-blur">
                {proofSignals.map(([Icon, label]) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-leaf/15 text-forest">
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-black text-forest">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-8 right-8 hidden rounded-full bg-lime px-4 py-2 text-xs font-black text-forest shadow-lg shadow-forest/10 md:block">
                Survival over one-time planting
              </div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              ["12.4k", "Trees pledged"],
              ["3.9k", "Verified"],
              ["184k", "TreeCoins"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-[1.25rem] bg-white/80 p-4 text-center shadow-sm shadow-forest/5 ring-1 ring-forest/10 backdrop-blur"
              >
                <p className="text-xl font-black text-forest">{value}</p>
                <p className="mt-1 text-[0.7rem] font-black uppercase tracking-[0.1em] text-forest/45">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
