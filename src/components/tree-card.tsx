import Image from "next/image";
import type { Tree } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { StatusPill } from "./status-pill";

interface TreeCardProps {
  tree: Tree;
}

export function TreeCard({ tree }: TreeCardProps) {
  return (
    <article className="living-card overflow-hidden rounded-[1.75rem]">
      <div className="relative aspect-[4/3] bg-leaf/10">
        <Image
          src={tree.photos[0]}
          alt={`${tree.nickname} tree proof visual`}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-forest">{tree.nickname}</h3>
            <p className="text-sm font-bold text-forest/55">{tree.species}</p>
          </div>
          <StatusPill status={tree.status} />
        </div>
        <p className="mt-4 text-sm leading-6 text-forest/65">
          {tree.locationName}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-lime/25 p-3">
            <p className="font-black text-forest">{tree.treeCoinsEarned}</p>
            <p className="font-bold text-forest/55">TreeCoins</p>
          </div>
          <div className="rounded-2xl bg-leaf/10 p-3">
            <p className="font-black text-forest">{formatDate(tree.plantedAt)}</p>
            <p className="font-bold text-forest/55">Planted</p>
          </div>
        </div>
      </div>
    </article>
  );
}
