import type { Metadata } from "next";
import Image from "next/image";
import { Camera, CheckCircle2, MapPin, ShieldCheck, Sprout } from "lucide-react";
import { LivingBackdrop } from "@/components/living-backdrop";
import { ProofUploadForm } from "@/components/proof-upload-form";
import { SectionHeader } from "@/components/section-header";
import { GROWCRED_ASSETS } from "@/lib/assets";
import { TREECOIN_DISCLAIMER } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Submit Proof | GrowCred",
  description:
    "Submit photo, video, location, and care commitment proof for a GrowCred tree.",
};

export default function SubmitProofPage() {
  return (
    <section className="relative isolate px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <LivingBackdrop />
      <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <SectionHeader
            eyebrow="Submit Proof"
            title="Plant real trees. Prove your impact."
            description="Upload clear evidence, confirm legal planting, and commit to caring for the tree over time."
          />
          <div className="mt-6 overflow-hidden rounded-[2rem] border border-forest/10 bg-white p-2 shadow-xl shadow-forest/10 sm:p-3 lg:shadow-2xl">
            <Image
              src={GROWCRED_ASSETS.onboarding.plantProveProtect}
              alt="GrowCred onboarding visual showing Plant, Prove, Protect steps"
              width={1024}
              height={1024}
              priority
              sizes="(min-width: 1024px) 36vw, 92vw"
              className="aspect-[16/9] max-h-36 w-full rounded-[1.5rem] object-cover object-top sm:max-h-72 lg:aspect-square lg:max-h-none"
            />
          </div>
          <div className="mt-5 hidden gap-3 sm:mt-8 sm:gap-4 lg:grid">
            {[
              [Sprout, "Native or locally suitable tree"],
              [Camera, "Photo proof with enough context"],
              [MapPin, "Location and city details"],
              [ShieldCheck, "Legal planting and care commitment"],
              [CheckCircle2, "10 TreeCoins after approval"],
            ].map(([Icon, label]) => (
              <div
                key={label as string}
                className="living-card flex items-center gap-3 rounded-[1.25rem] p-4"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-lime/35 text-forest">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <p className="text-sm font-black text-forest">
                  {label as string}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5 hidden rounded-[1.25rem] bg-lime/20 p-4 text-xs font-bold leading-6 text-forest/70 lg:block">
            {TREECOIN_DISCLAIMER}
          </p>
        </div>
        <ProofUploadForm />
      </div>
    </section>
  );
}
