import type { Metadata } from "next";
import { KeyRound, ShieldCheck, UploadCloud } from "lucide-react";
import { AuthPanel } from "@/components/auth-panel";
import { LivingBackdrop } from "@/components/living-backdrop";
import { StickerBadge } from "@/components/sticker-badge";

export const metadata: Metadata = {
  title: "Sign In | GrowCred",
  description: "Sign in to GrowCred to track proof submissions, care reminders, and TreeCoin progress.",
};

export default function AuthPage() {
  return (
    <section className="relative isolate px-4 py-14 sm:px-6 lg:px-8">
      <LivingBackdrop />
      <div className="product-page-shell mx-auto grid max-w-7xl gap-8 p-4 sm:p-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:p-8">
        <div className="product-page-rail p-4 sm:p-6 lg:sticky lg:top-28">
          <StickerBadge className="bg-lime/35">GrowCred account</StickerBadge>
          <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight text-forest sm:text-5xl">
            Sign in to track your impact.
          </h1>
          <p className="mt-4 text-base font-bold leading-7 text-forest/70 sm:text-lg">
            Keep your trees, proof status, care reminders, badges, and
            TreeCoins connected to your GrowCred profile.
          </p>
          <div className="mt-8 grid gap-4">
            {[
              [KeyRound, "Secure account access"],
              [UploadCloud, "Saved proof sessions"],
              [ShieldCheck, "Private impact records"],
            ].map(([Icon, label]) => (
              <div
                key={label as string}
                className="living-card flex items-center gap-3 p-4"
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
