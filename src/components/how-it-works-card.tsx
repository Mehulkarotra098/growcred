import type { LucideIcon } from "lucide-react";
import { HoverLift } from "./motion";

interface HowItWorksCardProps {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function HowItWorksCard({
  step,
  title,
  description,
  icon: Icon,
}: HowItWorksCardProps) {
  return (
    <HoverLift className="h-full">
      <article className="living-card growth-line h-full rounded-[2rem] p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full bg-lime/45 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-forest">
            {step}
          </span>
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-leaf text-white">
            <Icon aria-hidden="true" className="h-6 w-6" />
          </span>
        </div>
        <h3 className="mt-6 text-2xl font-black text-forest">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-forest/70">{description}</p>
      </article>
    </HoverLift>
  );
}
