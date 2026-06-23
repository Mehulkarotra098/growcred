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
    submitted: "bg-aqua/10 text-forest ring-aqua/30",
    under_review: "bg-lime/35 text-forest ring-lime/60",
    verified: "bg-leaf/15 text-forest ring-leaf/40",
    needs_more_info: "bg-aqua/15 text-forest ring-aqua/50",
    rejected: "bg-red-50 text-red-700 ring-red-200",
  };

  return classes[status];
}
