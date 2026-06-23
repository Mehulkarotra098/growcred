import type { Metadata } from "next";
import { BadgeCheck, ClipboardList, FileWarning, ShieldCheck } from "lucide-react";
import { AdminReviewTable } from "@/components/admin-review-table";
import { DashboardCard } from "@/components/dashboard-card";
import { LivingBackdrop } from "@/components/living-backdrop";
import { SectionHeader } from "@/components/section-header";
import { adminReviews, proofSubmissions, trees, users } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Admin Verification | GrowCred",
  description: "Admin verification dashboard for reviewing GrowCred tree proof submissions.",
};

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
        <div className="mt-10 grid gap-5 md:grid-cols-4">
          <DashboardCard
            label="Queue"
            value="6"
            detail="Proof submissions waiting for a decision."
            icon={ClipboardList}
          />
          <DashboardCard
            label="Flagged"
            value="3"
            detail="Items needing deeper review or clearer evidence."
            icon={FileWarning}
          />
          <DashboardCard
            label="Verified"
            value="2"
            detail="Approved proof records in the queue."
            icon={BadgeCheck}
          />
          <DashboardCard
            label="Care checks"
            value="7"
            detail="Checklist items before a reward decision."
            icon={ShieldCheck}
          />
        </div>
        <p className="mt-6 rounded-[1.25rem] bg-lime/20 p-4 text-sm font-bold leading-6 text-forest/70">
          TreeCoin is an in-app reward point during MVP and is not a tradable
          financial asset.
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
