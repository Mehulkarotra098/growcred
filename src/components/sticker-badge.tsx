import { cn } from "@/lib/utils";

interface StickerBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function StickerBadge({ children, className }: StickerBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-forest/10 bg-white/85 px-3 py-1 text-sm font-bold text-forest shadow-sm shadow-forest/5 backdrop-blur transition hover:-translate-y-0.5 hover:bg-lime/30",
        className,
      )}
    >
      {children}
    </span>
  );
}
