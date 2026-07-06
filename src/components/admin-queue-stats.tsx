"use client";

import { BadgeCheck, ClipboardList, FileWarning, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getLocalGrowCredState,
  subscribeToLocalGrowCred,
  type LocalGrowCredState,
} from "@/lib/local-growcred";
import type { ProofStatus } from "@/lib/types";

const pendingStatuses = new Set<ProofStatus>([
  "submitted",
  "under_review",
  "needs_more_info",
]);

const statMeta = [
  {
    key: "queue",
    label: "Queue",
    detail: "Proof submissions waiting for a decision.",
    icon: ClipboardList,
  },
  {
    key: "flagged",
    label: "Flagged",
    detail: "Items needing deeper review or clearer evidence.",
    icon: FileWarning,
  },
  {
    key: "verified",
    label: "Verified",
    detail: "Approved proof records in the queue.",
    icon: BadgeCheck,
  },
  {
    key: "careChecks",
    label: "Care checks",
    detail: "Evidence and care checks available to review.",
    icon: ShieldCheck,
  },
] as const;

export function AdminQueueStats() {
  const [state, setState] = useState<LocalGrowCredState>(() =>
    getLocalGrowCredState(),
  );

  useEffect(() => {
    const sync = () => setState(getLocalGrowCredState());
    sync();
    return subscribeToLocalGrowCred(sync);
  }, []);

  const values = useMemo(() => {
    const reviewable = state.proofSubmissions.filter(
      (proof) => proof.status !== "draft",
    );

    return {
      queue: reviewable.filter((proof) => pendingStatuses.has(proof.status)).length,
      flagged: state.adminReviews.filter((review) => review.fraudFlags.length > 0)
        .length,
      verified: state.proofSubmissions.filter(
        (proof) => proof.status === "verified",
      ).length,
      careChecks: reviewable.length,
    };
  }, [state]);

  return (
    <div className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-4 md:gap-5">
      {statMeta.map(({ key, label, detail, icon: Icon }) => (
        <article key={key} className="living-card rounded-[1.75rem] p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.11em] text-forest/50 sm:text-sm">
                {label}
              </p>
              <p className="mt-2 text-3xl font-black tracking-tight text-forest">
                {values[key]}
              </p>
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-lime/45 text-forest shadow-inner sm:h-11 sm:w-11">
              <Icon aria-hidden="true" className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-4 hidden text-sm leading-6 text-forest/65 md:block">
            {detail}
          </p>
        </article>
      ))}
    </div>
  );
}
