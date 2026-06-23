import type { Metadata } from "next";
import { ChallengeHub } from "@/components/challenge-hub";
import { LivingBackdrop } from "@/components/living-backdrop";
import { SectionHeader } from "@/components/section-header";
import { challenges } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Challenges | GrowCred",
  description: "Join GrowCred challenges that reward verified tree care.",
};

export default function ChallengesPage() {
  return (
    <section className="relative isolate px-4 py-14 sm:px-6 lg:px-8">
      <LivingBackdrop />
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Grow missions"
          title="Challenges that make care social."
          description="Plant with friends, schools, campuses, and city teams. Rewards unlock when the impact is verified."
          align="center"
        />
        <ChallengeHub challenges={challenges} />
        <p className="mx-auto mt-8 max-w-3xl rounded-[1.25rem] bg-lime/20 p-4 text-center text-xs font-bold leading-6 text-forest/70">
          TreeCoin is an in-app reward point during MVP and is not a tradable
          financial asset.
        </p>
      </div>
    </section>
  );
}
