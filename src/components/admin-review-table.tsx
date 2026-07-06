"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  FileWarning,
  MapPinned,
  MessageSquare,
  ShieldCheck,
  Video,
  XCircle,
} from "lucide-react";
import { reviewProofAction } from "@/app/admin/actions";
import type { AdminReview, ProofStatus, ProofSubmission, Tree, User } from "@/lib/types";
import {
  getLocalGrowCredState,
  reviewLocalProof,
  subscribeToLocalGrowCred,
  type LocalGrowCredState,
} from "@/lib/local-growcred";
import { cn, formatDate } from "@/lib/utils";
import { StatusPill } from "./status-pill";

interface AdminReviewTableProps {
  reviews: AdminReview[];
  submissions: ProofSubmission[];
  trees: Tree[];
  users: User[];
}

type ReviewRow = {
  review: AdminReview;
  submission: ProofSubmission;
  tree: Tree;
  user: User;
  status: ProofStatus;
};

type QueueFilter = "pending" | "all" | ProofStatus;

const filters: Array<{ label: string; value: QueueFilter }> = [
  { label: "Pending", value: "pending" },
  { label: "All", value: "all" },
  { label: "Verified", value: "verified" },
  { label: "Needs Info", value: "needs_more_info" },
  { label: "Rejected", value: "rejected" },
];

const reviewActions: Array<{
  label: string;
  shortLabel: string;
  decision: ProofStatus;
  note: string;
  icon: typeof CheckCircle2;
  className: string;
}> = [
  {
    label: "Approve",
    shortLabel: "Approve",
    decision: "verified",
    note: "Approved after evidence, permission, and care commitment review.",
    icon: CheckCircle2,
    className: "bg-leaf text-white hover:bg-forest",
  },
  {
    label: "Reject",
    shortLabel: "Reject",
    decision: "rejected",
    note: "Rejected because the proof does not meet verification standards.",
    icon: XCircle,
    className: "bg-red-50 text-red-700 ring-1 ring-red-200 hover:bg-red-100",
  },
  {
    label: "Request more info",
    shortLabel: "More info",
    decision: "needs_more_info",
    note: "Requested clearer evidence or missing planting context.",
    icon: MessageSquare,
    className: "bg-aqua/15 text-forest ring-1 ring-aqua/35 hover:bg-aqua/25",
  },
  {
    label: "Mark for field verification",
    shortLabel: "Field check",
    decision: "under_review",
    note: "Marked for field verification before a final reward decision.",
    icon: MapPinned,
    className: "bg-forest text-white hover:bg-leaf",
  },
];

const pendingStatuses = new Set<ProofStatus>([
  "submitted",
  "under_review",
  "needs_more_info",
]);

export function AdminReviewTable({
  reviews,
  submissions,
  trees,
  users,
}: AdminReviewTableProps) {
  const [activeFilter, setActiveFilter] = useState<QueueFilter>("pending");
  const [selectedId, setSelectedId] = useState(submissions[0]?.id ?? "");
  const [queueState, setQueueState] = useState<LocalGrowCredState>({
    users,
    trees,
    proofSubmissions: submissions,
    adminReviews: reviews,
    treeCoinLedger: [],
  });
  const [actionMessage, setActionMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    function syncQueue() {
      const nextState = getLocalGrowCredState();
      setQueueState(nextState);
      setSelectedId((current) => current || nextState.proofSubmissions[0]?.id || "");
    }

    syncQueue();
    return subscribeToLocalGrowCred(syncQueue);
  }, []);

  const rows = useMemo(() => {
    return queueState.proofSubmissions
      .map((submission) => {
        const tree = queueState.trees.find((item) => item.id === submission.treeId);
        const user = queueState.users.find((item) => item.id === submission.userId);
        const review =
          queueState.adminReviews.find((item) => item.proofSubmissionId === submission.id) ??
          ({
            id: `review-${submission.id}`,
            proofSubmissionId: submission.id,
            reviewerId: "admin",
            decision: submission.status,
            notes: "Awaiting review.",
            fraudFlags: [],
          } satisfies AdminReview);

        if (!tree || !user) return null;

        return {
          review,
          submission,
          tree,
          user,
          status: submission.status,
        };
      })
      .filter(Boolean) as ReviewRow[];
  }, [queueState]);

  const filteredRows = rows.filter((row) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "pending") return pendingStatuses.has(row.status);
    return row.status === activeFilter;
  });

  const selectedRow =
    rows.find((row) => row.submission.id === selectedId) ?? filteredRows[0] ?? rows[0];

  function handleReview(row: ReviewRow, action: (typeof reviewActions)[number]) {
    setActionMessage("");
    startTransition(async () => {
      const localResult = reviewLocalProof({
        proofSubmissionId: row.submission.id,
        decision: action.decision,
        notes: action.note,
        fraudFlags: row.review.fraudFlags,
      });

      if (localResult.ok) {
        setQueueState(localResult.state);
      }

      let serverMessage = "";

      try {
        const serverResult = await reviewProofAction({
          proofSubmissionId: row.submission.id,
          decision: action.decision,
          notes: action.note,
          fraudFlags: row.review.fraudFlags,
        });
        serverMessage = serverResult.message;
      } catch {
        serverMessage = "Review saved in this browser.";
      }

      setActionMessage(localResult.ok ? localResult.message : serverMessage);
    });
  }

  return (
    <div className="grid gap-6">
      <div className="living-card rounded-[2rem] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-leaf">
              Pending proof submissions
            </p>
            <h2 className="mt-1 text-2xl font-black text-forest">
              Review queue
            </h2>
          </div>
          <div
            role="tablist"
            aria-label="Verification queue filters"
            className="flex flex-wrap gap-2"
          >
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                role="tab"
                aria-selected={activeFilter === filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf",
                  activeFilter === filter.value
                    ? "bg-forest text-white"
                    : "border border-forest/10 bg-white text-forest hover:bg-lime/20",
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {actionMessage ? (
          <p
            role="status"
            className="mt-4 rounded-[1.25rem] bg-lime/20 p-4 text-sm font-black text-forest"
          >
            {actionMessage}
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="living-card min-w-0 overflow-hidden rounded-[1.75rem]">
          <div className="hidden max-w-full overflow-x-auto xl:block">
            <table className="min-w-[76rem] border-collapse text-left">
              <thead className="forest-panel text-sm font-black text-white">
                <tr>
                  <th scope="col" className="px-5 py-4">
                    Submitted user
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Tree
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Location
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Date submitted
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Evidence
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Fraud flags
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/10">
                {filteredRows.map((row) => (
                  <tr key={row.submission.id} className="align-top">
                    <td className="px-5 py-5">
                      <UserCell row={row} />
                    </td>
                    <td className="px-5 py-5">
                      <TreeCell row={row} />
                    </td>
                    <td className="px-5 py-5">
                      <LocationCell row={row} />
                    </td>
                    <td className="px-5 py-5 text-sm font-bold text-forest/65">
                      {formatDate(row.submission.submittedAt)}
                    </td>
                    <td className="px-5 py-5">
                      <EvidenceCell row={row} compact />
                    </td>
                    <td className="px-5 py-5">
                      <StatusPill status={row.status} />
                    </td>
                    <td className="px-5 py-5">
                      <FraudFlags flags={row.review.fraudFlags} />
                    </td>
                    <td className="px-5 py-5">
                      <button
                        type="button"
                        onClick={() => setSelectedId(row.submission.id)}
                        className="rounded-full bg-forest px-4 py-2 text-xs font-black text-white transition hover:bg-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 p-3 xl:hidden">
            {filteredRows.map((row) => (
              <article
                key={row.submission.id}
                className="rounded-[1.25rem] border border-forest/10 bg-white/75 p-3 shadow-sm shadow-forest/5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <UserCell row={row} />
                  <StatusPill status={row.status} />
                </div>
                <div className="mt-3 rounded-[1rem] bg-off-white/72 p-3">
                  <EvidenceCell row={row} compact />
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <TreeCell row={row} />
                  <LocationCell row={row} />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.1em] text-forest/45">
                      Date submitted
                    </p>
                    <p className="mt-1 text-sm font-black text-forest">
                      {formatDate(row.submission.submittedAt)}
                    </p>
                  </div>
                  <FraudFlags flags={row.review.fraudFlags} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {reviewActions.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      disabled={isPending}
                      onClick={() => {
                        setSelectedId(row.submission.id);
                        handleReview(row, action);
                      }}
                      className={cn(
                        "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[0.72rem] font-black leading-tight transition disabled:cursor-wait disabled:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf",
                        action.className,
                      )}
                    >
                      <action.icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                      <span>{action.shortLabel}</span>
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        {selectedRow ? (
          <aside className="living-card hidden rounded-[2rem] p-5 2xl:sticky 2xl:top-28 2xl:block 2xl:self-start">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.14em] text-leaf">
                  Active review
                </p>
                <h3 className="mt-1 text-2xl font-black text-forest">
                  {selectedRow.tree.nickname}
                </h3>
                <p className="mt-1 text-sm font-bold text-forest/55">
                  {selectedRow.tree.species} by {selectedRow.user.name}
                </p>
              </div>
              <StatusPill status={selectedRow.status} />
            </div>

            <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-forest/10 bg-off-white">
              <div className="relative aspect-[4/3]">
                <Image
                  src={selectedRow.submission.photoUrl}
                  alt={`${selectedRow.tree.nickname} proof evidence preview`}
                  fill
                  unoptimized={selectedRow.submission.photoUrl.startsWith("data:")}
                  sizes="384px"
                  className="object-cover"
                />
              </div>
              <div className="grid gap-3 p-4 text-sm font-bold leading-6 text-forest/65">
                <p>{selectedRow.submission.notes}</p>
                <div className="flex flex-wrap gap-2">
                  <EvidenceBadge icon={Camera}>Photo evidence</EvidenceBadge>
                  {selectedRow.submission.videoUrl ? (
                    <EvidenceBadge icon={Video}>Video attached</EvidenceBadge>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                ["Species and planting date align", ShieldCheck],
                ["Location and permission are plausible", MapPinned],
                ["Evidence shows tree and surroundings", Camera],
                ["Fraud flags are reviewed", FileWarning],
              ].map(([label, Icon]) => (
                <div
                  key={label as string}
                  className="flex items-center gap-3 rounded-[1.25rem] bg-white/70 p-3 text-sm font-black text-forest"
                >
                  <Icon aria-hidden="true" className="h-4 w-4 text-leaf" />
                  {label as string}
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3">
              {reviewActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  disabled={isPending}
                  onClick={() => handleReview(selectedRow, action)}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-black transition disabled:cursor-wait disabled:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf",
                    action.className,
                  )}
                >
                  <action.icon aria-hidden="true" className="h-4 w-4" />
                  {action.label}
                </button>
              ))}
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}

function UserCell({ row }: { row: ReviewRow }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-lime/35 text-sm font-black text-forest">
        {row.user.avatarUrl}
      </span>
      <div className="min-w-0">
        <p className="font-black text-forest">{row.user.name}</p>
        <p className="break-all text-xs font-bold text-forest/50">{row.user.email}</p>
      </div>
    </div>
  );
}

function TreeCell({ row }: { row: ReviewRow }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.1em] text-forest/45">
        Tree nickname
      </p>
      <p className="mt-1 font-black text-forest">{row.tree.nickname}</p>
      <p className="text-sm font-bold text-forest/55">{row.tree.species}</p>
    </div>
  );
}

function LocationCell({ row }: { row: ReviewRow }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.1em] text-forest/45">
        Location
      </p>
      <p className="mt-1 text-sm font-bold leading-6 text-forest/65">
        {row.tree.locationName}
      </p>
    </div>
  );
}

function EvidenceCell({
  row,
  compact = false,
}: {
  row: ReviewRow;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3", compact ? "min-w-40" : "")}>
      <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-off-white ring-1 ring-forest/10">
        <Image
          src={row.submission.photoUrl}
          alt={`${row.tree.nickname} proof thumbnail`}
          fill
          unoptimized={row.submission.photoUrl.startsWith("data:")}
          sizes="64px"
          className="object-cover"
        />
      </div>
      <div>
        <p className="text-sm font-black text-forest">Photo proof</p>
        <p className="text-xs font-bold text-forest/50">
          {row.submission.videoUrl ? "Video included" : "No video"}
        </p>
      </div>
    </div>
  );
}

function FraudFlags({ flags }: { flags: string[] }) {
  if (flags.length === 0) {
    return (
      <span className="inline-flex rounded-full bg-leaf/10 px-3 py-1 text-xs font-black text-forest">
        No flags
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {flags.map((flag) => (
        <span
          key={flag}
          className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700 ring-1 ring-red-200"
        >
          <AlertTriangle aria-hidden="true" className="h-3.5 w-3.5" />
          {flag}
        </span>
      ))}
    </div>
  );
}

function EvidenceBadge({
  icon: Icon,
  children,
}: {
  icon: typeof Camera;
  children: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-black text-forest ring-1 ring-forest/10">
      <Icon aria-hidden="true" className="h-3.5 w-3.5 text-leaf" />
      {children}
    </span>
  );
}
