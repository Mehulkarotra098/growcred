import type { Metadata } from "next";
import { KeyRound, ShieldCheck, UploadCloud } from "lucide-react";
import { AuthPanel } from "@/components/auth-panel";
import { LivingBackdrop } from "@/components/living-backdrop";
import { SectionHeader } from "@/components/section-header";

export const metadata: Metadata = {
  title: "Sign In | GrowCred",
  description: "Sign in to GrowCred to track proof submissions, care reminders, and TreeCoin progress.",
};

export default function AuthPage() {
  return (
    <section className="relative isolate px-4 py-14 sm:px-6 lg:px-8">
      <LivingBackdrop />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <SectionHeader
            eyebrow="GrowCred account"
            title="Sign in to track your impact."
            description="Keep your trees, proof status, care reminders, badges, and TreeCoins connected to your GrowCred profile."
          />
          <div className="mt-8 grid gap-4">
            {[
              [KeyRound, "Email/password auth"],
              [UploadCloud, "Proof upload sessions"],
              [ShieldCheck, "Private user records"],
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
        </div>
        <AuthPanel />
      </div>
    </section>
  );
}
