import type { Metadata } from "next";
import { ChallengeHub } from "@/components/challenge-hub";
import { LivingBackdrop } from "@/components/living-backdrop";
import { SectionHeader } from "@/components/section-header";
import { TREECOIN_DISCLAIMER } from "@/lib/copy";
import { challenges } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Challenges | GrowCred",
  description: "Join GrowCred challenges that reward verified tree care.",
};

export default function ChallengesPage() {
  return (
    <section className="relative isolate px-4 py-14 sm:px-6 lg:px-8">
      <LivingBackdrop />
      <div className="product-page-shell mx-auto max-w-7xl rounded-[2rem] p-4 sm:p-6 lg:rounded-[2.5rem] lg:p-8">
        <SectionHeader
          eyebrow="Grow missions"
          title="Challenges that make care social."
          description="Plant with friends, schools, campuses, and city teams. Rewards unlock when the impact is verified."
          align="center"
        />
        <ChallengeHub challenges={challenges} />
        <p className="mx-auto mt-8 max-w-3xl rounded-[1.25rem] bg-lime/20 p-4 text-center text-xs font-bold leading-6 text-forest/70">
          {TREECOIN_DISCLAIMER}
        </p>
      </div>
    </section>
  );
}
