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
        "inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-extrabold ring-1",
        statusClassName(status),
        className,
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
