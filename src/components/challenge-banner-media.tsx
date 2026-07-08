import Image from "next/image";
import { cn } from "@/lib/utils";

interface ChallengeBannerMediaProps {
  alt: string;
  className?: string;
  eager?: boolean;
  priority?: boolean;
  sizes: string;
  src: string;
}

export function ChallengeBannerMedia({
  alt,
  className,
  eager = false,
  priority = false,
  sizes,
  src,
}: ChallengeBannerMediaProps) {
  return (
    <div
      className={cn(
        "relative aspect-[16/9] overflow-hidden bg-white",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? undefined : eager ? "eager" : "lazy"}
        sizes={sizes}
        className="object-cover scale-[1.075] transform-gpu"
      />
    </div>
  );
}
