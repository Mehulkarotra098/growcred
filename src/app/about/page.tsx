import type { Metadata } from "next";
import { HeartHandshake, ShieldCheck, Sprout, Trees } from "lucide-react";
import { CTASection } from "@/components/cta-section";
import { HumanActivityStrip } from "@/components/human-proof-board";
import { LivingBackdrop } from "@/components/living-backdrop";
import { SectionHeader } from "@/components/section-header";

export const metadata: Metadata = {
  title: "About | GrowCred",
  description: "GrowCred is a youth-powered climate action platform for verified tree care.",
};

const values = [
  "Real impact over fake numbers",
  "Survival over one-time planting",
  "Community over individual ego",
  "Native/local trees over random planting",
  "Trust over hype",
];

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate px-4 py-14 sm:px-6 lg:px-8">
        <LivingBackdrop />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeader
            eyebrow="About GrowCred"
            title="Youth-powered climate action with proof."
            description="GrowCred is a youth-powered climate action platform that rewards verified tree care. We believe the future will not be saved by empty promises, but by real actions people can prove, track, and grow."
          />
          <div className="forest-panel rounded-[1.25rem] p-8 text-white shadow-2xl shadow-forest/20">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-lime">
              Mission
            </p>
            <h2 className="mt-4 text-3xl font-black">
              To make tree care rewarding, social, and verifiable.
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                [Sprout, "Plant"],
                [ShieldCheck, "Prove"],
                [Trees, "Protect"],
              ].map(([Icon, label]) => (
                <div
                  key={label as string}
                  className="rounded-[0.95rem] bg-white/10 p-4"
                >
                  <Icon aria-hidden="true" className="h-6 w-6 text-lime" />
                  <p className="mt-3 font-black">{label as string}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="What it looks like"
            title="A community that submits proof and comes back."
            description="People plant, upload proof, receive review decisions, and keep caring for the same trees over time."
          />
          <div className="mt-8">
            <HumanActivityStrip />
          </div>
        </div>
      </section>

      <section className="bg-white/70 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Values"
            title="Proof beats promises."
            description="GrowCred is designed to feel friendly like a youth movement and credible like a climate-tech product."
            align="center"
          />
          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {values.map((value) => (
              <article
                key={value}
                className="living-card p-5"
              >
                <HeartHandshake aria-hidden="true" className="h-6 w-6 text-leaf" />
                <p className="mt-4 text-sm font-black leading-6 text-forest">
                  {value}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
