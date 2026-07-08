import Image from "next/image";
import { brandAssets } from "@/lib/brand-assets";
import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
  showWordmark?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
}

const markSizeClassName = {
  xs: "h-8 w-8",
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-16 w-16",
};

const lockupSizeClassName = {
  xs: "h-7 w-auto max-w-[8.25rem] sm:h-8 sm:max-w-[9.75rem]",
  sm: "h-8 w-auto max-w-[9.75rem] sm:h-9 sm:max-w-[10.75rem]",
  md: "h-14 w-auto max-w-[17rem]",
  lg: "h-20 w-auto max-w-[24rem]",
};

export function LogoMark({
  className,
  showWordmark = false,
  size = "md",
}: LogoMarkProps) {
  if (showWordmark) {
    return (
      <span
        role="img"
        aria-label="GrowCred - Plant. Prove. Protect."
        className={cn(
          "brand-lockup-shell logo-breathe inline-flex shrink-0 items-center rounded-2xl px-2.5 py-1.5 backdrop-blur",
          className,
        )}
      >
        <Image
          src={brandAssets.logoLockup}
          alt=""
          aria-hidden="true"
          width={2048}
          height={640}
          preload={size === "sm"}
          sizes={
            size === "lg"
              ? "24rem"
              : size === "md"
                ? "17rem"
                : size === "sm"
                  ? "11.5rem"
                  : "9rem"
          }
          className={cn(
            "theme-logo-light object-contain",
            lockupSizeClassName[size],
          )}
        />
        <Image
          src={brandAssets.logoLockupDark}
          alt=""
          aria-hidden="true"
          width={2048}
          height={640}
          preload={size === "sm"}
          sizes={
            size === "lg"
              ? "24rem"
              : size === "md"
                ? "17rem"
                : size === "sm"
                  ? "11.5rem"
                  : "9rem"
          }
          className={cn(
            "theme-logo-dark object-contain",
            lockupSizeClassName[size],
          )}
        />
      </span>
    );
  }

  return (
    <Image
      src={brandAssets.logoMark}
      alt="GrowCred"
      width={512}
      height={512}
      sizes={
        size === "lg"
          ? "4rem"
          : size === "md"
            ? "2.75rem"
            : size === "sm"
              ? "2.25rem"
              : "2rem"
      }
      className={cn("logo-breathe shrink-0 object-contain", markSizeClassName[size], className)}
    />
  );
}
