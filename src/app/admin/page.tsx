import type { Metadata } from "next";
import { BadgeCheck, ClipboardList, FileWarning, ShieldCheck } from "lucide-react";
import { AdminReviewTable } from "@/components/admin-review-table";
import { DashboardCard } from "@/components/dashboard-card";
import { LivingBackdrop } from "@/components/living-backdrop";
import { SectionHeader } from "@/components/section-header";
import { TREECOIN_DISCLAIMER } from "@/lib/copy";
import { adminReviews, proofSubmissions, trees, users } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Admin Verification | GrowCred",
  description: "Admin verification dashboard for reviewing GrowCred tree proof submissions.",
};

const adminStats = [
  {
    label: "Queue",
    value: "6",
    detail: "Proof submissions waiting for a decision.",
    icon: ClipboardList,
  },
  {
    label: "Flagged",
    value: "3",
    detail: "Items needing deeper review or clearer evidence.",
    icon: FileWarning,
  },
  {
    label: "Verified",
    value: "2",
    detail: "Approved proof records in the queue.",
    icon: BadgeCheck,
  },
  {
    label: "Care checks",
    value: "7",
    detail: "Checklist items before a reward decision.",
    icon: ShieldCheck,
  },
] as const;

export default function AdminPage() {
  return (
    <section className="relative isolate px-4 py-14 sm:px-6 lg:px-8">
      <LivingBackdrop />
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Verification desk"
          title="Verification should feel trustworthy."
          description="Review evidence, status, fraud flags, and care commitments before approving TreeCoin rewards."
        />
        <div className="mt-8 grid grid-cols-2 gap-3 md:hidden">
          {adminStats.map(({ icon: Icon, label, value }) => (
            <article
              key={label}
              className="rounded-[1.25rem] border border-forest/10 bg-white/75 p-4 shadow-sm shadow-forest/5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-black uppercase tracking-[0.1em] text-forest/50">
                  {label}
                </p>
                <Icon aria-hidden="true" className="h-4 w-4 text-leaf" />
              </div>
              <p className="mt-2 text-2xl font-black text-forest">
                {value}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-10 hidden gap-5 md:grid md:grid-cols-4">
          {adminStats.map((stat) => (
            <DashboardCard key={stat.label} {...stat} />
          ))}
        </div>
        <p className="mt-6 rounded-[1.25rem] bg-lime/20 p-4 text-sm font-bold leading-6 text-forest/70">
          {TREECOIN_DISCLAIMER}
        </p>
        <div className="mt-10">
          <AdminReviewTable
            reviews={adminReviews}
            submissions={proofSubmissions}
            trees={trees}
            users={users}
          />
        </div>
      </div>
    </section>
  );
}
