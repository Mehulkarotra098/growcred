import Link from "next/link";
import { ArrowRight, BadgeCheck, Camera, ShieldCheck } from "lucide-react";
import { FadeIn } from "./motion";

export function CTASection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <FadeIn className="mx-auto max-w-6xl overflow-hidden rounded-[1.25rem] shadow-2xl shadow-forest/20">
        <div className="forest-panel relative grid gap-8 p-8 text-white sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-lime">
              Plant. Prove. Protect.
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">
              Ready to grow something people can trust?
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">
              Plant the right tree, submit clean proof, care for survival, and
              let GrowCred turn small actions into visible impact.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                [Camera, "Proof"],
                [ShieldCheck, "Care"],
                [BadgeCheck, "Verified"],
              ].map(([Icon, label]) => (
                <div
                  key={label as string}
                  className="rounded-[0.95rem] bg-white/10 p-4"
                >
                  <Icon aria-hidden="true" className="h-5 w-5 text-lime" />
                  <p className="mt-3 text-sm font-black">{label as string}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/submit-proof"
              className="inline-flex items-center justify-center gap-2 rounded-[0.9rem] bg-lime px-5 py-3 text-sm font-black text-forest transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
            >
              Start Planting
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href="/challenges"
              className="inline-flex items-center justify-center rounded-[0.9rem] border border-white/25 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Join a Mission
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
