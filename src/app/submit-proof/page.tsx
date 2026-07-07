import type { Metadata } from "next";
import { Camera, CheckCircle2, MapPin, ShieldCheck, Sprout } from "lucide-react";
import { ProofPacketMini } from "@/components/human-proof-board";
import { LivingBackdrop } from "@/components/living-backdrop";
import { ProofUploadForm } from "@/components/proof-upload-form";
import { TREECOIN_DISCLAIMER } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Submit Proof | GrowCred",
  description:
    "Submit photo, video, location, and care commitment proof for a GrowCred tree.",
};

export default function SubmitProofPage() {
  return (
    <section className="relative isolate px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <LivingBackdrop />
      <div className="product-page-shell mx-auto grid max-w-7xl gap-5 rounded-[1.75rem] p-4 sm:gap-7 sm:p-6 lg:grid-cols-[0.74fr_1.26fr] lg:items-start lg:rounded-[2rem] lg:p-7">
        <div className="product-page-rail rounded-[1.4rem] p-4 sm:p-5 lg:sticky lg:top-28 lg:p-6">
          <span className="inline-flex rounded-full bg-lime/35 px-4 py-2 text-sm font-black text-forest">
            Submit Proof
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-forest sm:text-4xl">
            Plant real trees. Prove your impact.
          </h1>
          <p className="mt-3 text-base font-bold leading-7 text-forest/68">
            Upload clear evidence, confirm legal planting, and commit to caring
            for the tree over time.
          </p>
          <div className="mt-6 hidden xl:block">
            <ProofPacketMini />
          </div>
          <div className="mt-5 hidden gap-3 sm:mt-7 sm:gap-3 lg:grid">
            {[
              [Sprout, "Native or locally suitable tree"],
              [Camera, "Photo proof with enough context"],
              [MapPin, "Location and city details"],
              [ShieldCheck, "Legal planting and care commitment"],
              [CheckCircle2, "10 TreeCoins after approval"],
            ].map(([Icon, label]) => (
              <div
                key={label as string}
                className="living-card flex items-center gap-3 rounded-[1.15rem] p-4"
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
          <p className="mt-5 hidden rounded-[1.15rem] bg-lime/16 p-4 text-xs font-bold leading-6 text-forest/70 lg:block">
            {TREECOIN_DISCLAIMER}
          </p>
        </div>
        <ProofUploadForm />
      </div>
    </section>
  );
}
