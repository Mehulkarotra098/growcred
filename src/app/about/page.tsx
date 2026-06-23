import type { Metadata } from "next";
import Image from "next/image";
import { HeartHandshake, ShieldCheck, Sprout, Trees } from "lucide-react";
import { CTASection } from "@/components/cta-section";
import { LivingBackdrop } from "@/components/living-backdrop";
import { SectionHeader } from "@/components/section-header";
import { brandAssets } from "@/lib/brand-assets";
import { GROWCRED_ASSETS } from "@/lib/assets";

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
          <div className="forest-panel rounded-[2.25rem] p-8 text-white shadow-2xl shadow-forest/20">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-lime">
              Mission
            </p>
            <h2 className="mt-4 text-3xl font-black">
              To make tree care rewarding, social, and verifiable.
            </h2>
            <Image
              src={brandAssets.earthHeart}
              alt=""
              aria-hidden="true"
              width={220}
              height={220}
              className="mt-6 h-auto w-28"
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                [Sprout, "Plant"],
                [ShieldCheck, "Prove"],
                [Trees, "Protect"],
              ].map(([Icon, label]) => (
                <div
                  key={label as string}
                  className="rounded-[1.5rem] bg-white/10 p-4"
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
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-forest/10 bg-white shadow-2xl shadow-forest/10">
          <Image
            src={GROWCRED_ASSETS.site.heroLanding}
            alt="GrowCred app landing visual with logo, TreeCoin reward, and verified tree care direction"
            width={1536}
            height={1024}
            className="w-full object-cover"
          />
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
                className="living-card rounded-[1.5rem] p-5"
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
