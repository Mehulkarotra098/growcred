import type { ProofStatus } from "@/lib/types";
import { cn, statusClassName, statusLabel } from "@/lib/utils";

interface StatusPillProps {
  status: ProofStatus;
  className?: string;
}

export function StatusPill({ status, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full shrink-0 items-center justify-center rounded-[0.65rem] px-3 py-1 text-center text-xs font-extrabold leading-4 ring-1 sm:whitespace-nowrap",
        statusClassName(status),
        className,
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
