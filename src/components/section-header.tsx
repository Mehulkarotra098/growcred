import { FadeIn } from "./motion";
import { StickerBadge } from "./sticker-badge";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
}: SectionHeaderProps) {
  const isDark = tone === "dark";

  return (
    <FadeIn
      className={
        align === "center"
          ? "mx-auto max-w-3xl text-center"
          : "max-w-3xl text-left"
      }
    >
      {eyebrow ? (
        <StickerBadge
          className={
            isDark
              ? "mb-4 border-white/10 bg-white/10 text-lime"
              : "mb-4 bg-lime/35"
          }
        >
          {eyebrow}
        </StickerBadge>
      ) : null}
      <h2
        className={
          isDark
            ? "text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl"
            : "text-3xl font-black tracking-tight text-forest sm:text-4xl lg:text-5xl"
        }
      >
        {title}
      </h2>
      {description ? (
        <p
          className={
            isDark
              ? "mt-4 text-base leading-7 text-white/70 sm:text-lg"
              : "mt-4 text-base leading-7 text-forest/70 sm:text-lg"
          }
        >
          {description}
        </p>
      ) : null}
    </FadeIn>
  );
}
