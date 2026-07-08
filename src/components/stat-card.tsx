import { formatNumber } from "@/lib/utils";
import { HoverLift } from "./motion";

interface StatCardProps {
  label: string;
  value: number | string;
  suffix?: string;
  detail?: string;
}

export function StatCard({ label, value, suffix, detail }: StatCardProps) {
  const display = typeof value === "number" ? formatNumber(value) : value;

  return (
    <HoverLift className="h-full">
      <article className="living-card metric-glow h-full p-5">
        <p className="text-sm font-black uppercase tracking-[0.12em] text-forest/50">
          {label}
        </p>
        <p className="mt-3 text-3xl font-black tracking-tight text-forest">
          {display}
          {suffix ? <span className="text-leaf">{suffix}</span> : null}
        </p>
        {detail ? (
          <p className="mt-3 text-sm font-bold leading-6 text-forest/55">
            {detail}
          </p>
        ) : null}
      </article>
    </HoverLift>
  );
}
