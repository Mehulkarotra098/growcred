import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ProofStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function statusLabel(status: ProofStatus) {
  const labels: Record<ProofStatus, string> = {
    draft: "Draft",
    submitted: "Submitted",
    under_review: "Under Review",
    verified: "Verified",
    needs_more_info: "Needs More Info",
    rejected: "Rejected",
  };

  return labels[status];
}

export function statusClassName(status: ProofStatus) {
  const classes: Record<ProofStatus, string> = {
    draft: "bg-slate-100 text-slate-700 ring-slate-200",
    submitted: "bg-cyan-50 text-cyan-800 ring-cyan-200",
    under_review: "bg-lime/40 text-[#0d2b1e] ring-lime/70",
    verified: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    needs_more_info: "bg-cyan-50 text-cyan-800 ring-cyan-200",
    rejected: "bg-red-50 text-red-700 ring-red-200",
  };

  return classes[status];
}
