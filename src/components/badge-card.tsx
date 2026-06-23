import { BadgeCheck, Camera, Leaf, ShieldCheck, Sprout, Trees } from "lucide-react";
import type { Badge } from "@/lib/types";

const iconMap = {
  seedling: Sprout,
  leaf: Leaf,
  shield: ShieldCheck,
  planet: BadgeCheck,
  forest: Trees,
  camera: Camera,
};

interface BadgeCardProps {
  badge: Badge;
}

export function BadgeCard({ badge }: BadgeCardProps) {
  const Icon = iconMap[badge.icon as keyof typeof iconMap] ?? BadgeCheck;

  return (
    <article className="living-card rounded-[1.5rem] p-5">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime/45 text-forest">
        <Icon aria-hidden="true" className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-lg font-black text-forest">{badge.name}</h3>
      <p className="mt-2 text-sm leading-6 text-forest/65">
        {badge.description}
      </p>
      <p className="mt-4 rounded-full bg-leaf/10 px-3 py-2 text-xs font-black text-forest">
        {badge.requirement}
      </p>
    </article>
  );
}
