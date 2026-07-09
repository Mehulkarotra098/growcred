import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  Droplets,
  Fence,
  Leaf,
  MapPinned,
  ShieldCheck,
  Sprout,
  SunMedium,
  ArrowRight,
} from "lucide-react";
import { LivingBackdrop } from "@/components/living-backdrop";
import { SectionHeader } from "@/components/section-header";
import { GROWCRED_ASSETS } from "@/lib/assets";
import { TREECOIN_DISCLAIMER } from "@/lib/copy";
import { careGuideSteps } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Tree Care Guide | GrowCred",
  description: "Learn how to plant legally, choose suitable trees, and care for the first 90 days.",
};

const guide = [
  {
    title: "Choose a native/local tree",
    description: "Pick a species that belongs in the local climate and has enough room to grow.",
    icon: Leaf,
  },
  {
    title: "Plant in the right place",
    description: "Avoid protected land, roadsides, utilities, and cramped spaces where survival is unlikely.",
    icon: MapPinned,
  },
  {
    title: "Get permission first",
    description: "Plant only where you have clear permission from the owner, school, society, or local body.",
    icon: ShieldCheck,
  },
  {
    title: "Watering basics",
    description: "Water deeply after planting, then keep a steady care rhythm through heat and dry weeks.",
    icon: Droplets,
  },
  {
    title: "First 90 days care",
    description: "Check mulch, soil moisture, lean, leaf health, and signs of damage every week.",
    icon: SunMedium,
  },
  {
    title: "Protect from damage",
    description: "Use safe guards where needed and keep the base clear from animals, foot traffic, and trash.",
    icon: Fence,
  },
  {
    title: "Avoid invasive species",
    description: "Do not plant species that harm local biodiversity or spread aggressively.",
    icon: AlertTriangle,
  },
  {
    title: "Proof beats promises",
    description: "Take clear photos and updates so the tree's survival story can be verified.",
    icon: Sprout,
  },
];

export default function LearnPage() {
  return (
    <>
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="product-page-shell relative isolate mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <LivingBackdrop />
          <SectionHeader
            eyebrow="Tree care guide"
            title="Planting is the start. Care is the mission."
            description="A fast guide for planting correctly, keeping trees alive, and earning TreeCoins with trustworthy proof."
            align="center"
          />
          <p className="relaxed-copy mx-auto mt-6 max-w-3xl rounded-[0.85rem] bg-lime/20 p-4 text-center text-sm font-bold leading-6 text-forest/70">
            {TREECOIN_DISCLAIMER}
          </p>
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="gc-media-frame relative aspect-[4/3]">
              <Image
                src={GROWCRED_ASSETS.site.treeCareGuide}
                alt="GrowCred tree care guide visual explaining native planting and survival care"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 92vw"
                className="object-contain p-3"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Image
                src={GROWCRED_ASSETS.stickers.nativeTreesOnly}
                alt=""
                aria-hidden="true"
                width={720}
                height={720}
                className="gc-sticker float-soft hidden h-auto w-full max-w-36 justify-self-end object-contain sm:block"
              />
              <Image
                src={GROWCRED_ASSETS.stickers.proofBeatsPromises}
                alt=""
                aria-hidden="true"
                width={720}
                height={720}
                className="gc-sticker float-soft-delay hidden h-auto w-full max-w-36 object-contain sm:block"
              />
              {[
                "Do not plant on protected or unsafe public land.",
                "Show the sapling and the surroundings in proof photos.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[0.78rem] border border-forest/10 bg-white/72 p-5 text-sm font-black leading-6 text-forest sm:col-span-2"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {guide.map((item) => (
              <article
                key={item.title}
                className="living-card p-5 sm:p-6"
              >
                <span className="grid h-12 w-12 place-items-center rounded-[0.9rem] bg-lime/35 text-forest">
                  <item.icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <h2 className="mt-5 text-xl font-black text-forest">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-forest/65">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-forest/10 bg-white/50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="product-page-shell grid gap-10 p-4 sm:p-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:p-8">
            <div className="lg:sticky lg:top-28">
              <SectionHeader
                eyebrow="90-day care path"
                title="Turn a planting moment into survival proof."
                description="The reward loop teaches users what to do next, what to avoid, and what evidence makes review trustworthy."
              />
              <div className="forest-panel mt-8 rounded-[0.85rem] p-6 text-white shadow-xl shadow-forest/18">
                <p className="text-sm font-black uppercase tracking-[0.14em] text-lime">
                  Key message
                </p>
                <p className="mt-3 text-2xl font-black">
                  Do not plant randomly in protected or public land.
                </p>
                <p className="mt-3 text-sm font-semibold leading-6 text-white/70">
                  Get permission, choose suitable species, and keep proof clear
                  enough for a human reviewer to trust.
                </p>
                <Link
                  href="/submit-proof"
                  className="mt-6 inline-flex items-center gap-2 rounded-[0.78rem] bg-lime px-5 py-3 text-sm font-black text-forest transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
                >
                  Start with a native tree
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-5">
              {careGuideSteps.map((step) => (
                <article
                  key={step.id}
                  className="living-card grid gap-5 p-5 sm:p-6 md:grid-cols-[10rem_1fr]"
                >
                  <div>
                    <span className="inline-flex rounded-full bg-lime/40 px-4 py-2 text-sm font-black text-forest">
                      {step.dayRange}
                    </span>
                    <p className="mt-4 text-sm font-bold uppercase tracking-[0.12em] text-leaf">
                      Care milestone
                    </p>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-forest">
                      {step.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-forest/65">
                      {step.description}
                    </p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {step.actions.map((action) => (
                        <div
                          key={action}
                          className="rounded-[0.78rem] bg-off-white p-4 text-sm font-bold leading-6 text-forest/70"
                        >
                          {action}
                        </div>
                      ))}
                    </div>
                    <p className="mt-5 rounded-[0.78rem] bg-aqua/10 p-4 text-sm font-black leading-6 text-forest">
                      Proof tip: {step.proofTip}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
