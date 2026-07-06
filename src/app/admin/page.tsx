import type { Metadata } from "next";
import { AdminQueueStats } from "@/components/admin-queue-stats";
import { AdminReviewTable } from "@/components/admin-review-table";
import { LivingBackdrop } from "@/components/living-backdrop";
import { SectionHeader } from "@/components/section-header";
import { TREECOIN_DISCLAIMER } from "@/lib/copy";
import { adminReviews, proofSubmissions, trees, users } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Admin Verification | GrowCred",
  description: "Admin verification dashboard for reviewing GrowCred tree proof submissions.",
};

export default function AdminPage() {
  return (
    <section className="relative isolate px-4 py-14 sm:px-6 lg:px-8">
      <LivingBackdrop />
      <div className="product-page-shell mx-auto max-w-7xl rounded-[2rem] p-4 sm:p-6 lg:rounded-[2.5rem] lg:p-8">
        <SectionHeader
          eyebrow="Verification desk"
          title="Verification should feel trustworthy."
          description="Review evidence, status, fraud flags, and care commitments before approving TreeCoin rewards."
        />
        <AdminQueueStats />
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
