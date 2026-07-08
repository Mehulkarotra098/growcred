import type { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}

export function DashboardCard({
  label,
  value,
  detail,
  icon: Icon,
}: DashboardCardProps) {
  return (
    <article className="living-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.11em] text-forest/50">
            {label}
          </p>
          <p className="mt-2 text-3xl font-black tracking-tight text-forest">
            {value}
          </p>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-[0.9rem] bg-lime/45 text-forest shadow-inner">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-forest/65">{detail}</p>
    </article>
  );
}
