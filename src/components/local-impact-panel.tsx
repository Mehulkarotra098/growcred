"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Coins, FileCheck2, Trees } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getCurrentLocalUser,
  getLocalGrowCredState,
  subscribeToLocalGrowCred,
  type LocalGrowCredState,
} from "@/lib/local-growcred";
import { GROWCRED_ASSETS } from "@/lib/assets";
import { TREECOIN_DISCLAIMER } from "@/lib/copy";
import { formatDate } from "@/lib/utils";
import { StatusPill } from "./status-pill";

export function LocalImpactPanel() {
  const [state, setState] = useState<LocalGrowCredState>(() =>
    getLocalGrowCredState(),
  );

  useEffect(() => {
    const sync = () => setState(getLocalGrowCredState());
    sync();
    return subscribeToLocalGrowCred(sync);
  }, []);

  const user = getCurrentLocalUser(state);
  const userTrees = useMemo(
    () => state.trees.filter((tree) => tree.userId === user.id),
    [state.trees, user.id],
  );
  const userProofs = useMemo(
    () =>
      state.proofSubmissions
        .filter((proof) => proof.userId === user.id)
        .sort(
          (a, b) =>
            new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
        ),
    [state.proofSubmissions, user.id],
  );
  const pendingProofs = userProofs.filter((proof) => proof.status !== "verified");
  const creditedLedger = state.treeCoinLedger.filter(
    (entry) => entry.userId === user.id && entry.status === "verified",
  );
  const recentProof = userProofs[0];
  const recentTree = recentProof
    ? state.trees.find((tree) => tree.id === recentProof.treeId)
    : userTrees[0];
  const firstName = user.name.split(" ")[0] ?? "Your";

  return (
    <section className="dashboard-panel p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-leaf">
            Proof to reward
          </p>
          <h2 className="mt-1 max-w-full text-xl font-black leading-tight text-forest sm:text-2xl">
            {firstName}&apos;s proof and TreeCoins
          </h2>
          <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-forest/62">
            Upload a tree photo, wait for review, and verified TreeCoins appear
            here automatically.
          </p>
        </div>
        <Link
          href="/submit-proof"
          className="inline-flex items-center justify-center gap-2 rounded-[0.8rem] bg-forest px-4 py-3 text-sm font-black text-white transition hover:bg-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
        >
          Upload Care Proof
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-3 sm:grid-cols-3">
          <LiveMetric
            label="Your trees"
            value={String(userTrees.length)}
            detail={`${user.verifiedTrees} verified`}
            icon={Trees}
          />
          <LiveMetric
            label="Pending review"
            value={String(pendingProofs.length)}
            detail="Awaiting reviewer decision"
            icon={FileCheck2}
          />
          <LiveMetric
            label="TreeCoins"
            value={String(user.totalTreeCoins)}
            detail={`${creditedLedger.length} verified rewards`}
            icon={Coins}
            coin
          />
        </div>

        <article className="rounded-[0.9rem] border border-forest/10 bg-off-white/72 p-3">
          {recentProof && recentTree ? (
            <div className="grid gap-3 sm:grid-cols-[5.5rem_1fr]">
              <div className="relative aspect-square overflow-hidden rounded-[0.8rem] bg-white ring-1 ring-forest/10">
                <Image
                  src={recentProof.photoUrl}
                  alt={`${recentTree.nickname} uploaded proof photo`}
                  fill
                  unoptimized
                  sizes="6rem"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-black text-forest">
                      {recentTree.nickname}
                    </p>
                    <p className="mt-1 text-xs font-bold text-forest/55">
                      {recentTree.species} - {formatDate(recentProof.submittedAt)}
                    </p>
                  </div>
                  <StatusPill status={recentProof.status} />
                </div>
                <p className="mt-3 text-sm font-bold leading-6 text-forest/62">
                  {recentProof.status === "verified"
                    ? "+10 TreeCoins credited after verification."
                    : "+10 TreeCoins will unlock after approval."}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Image
                src={GROWCRED_ASSETS.states.noProofs}
                alt="No proof submissions yet"
                width={96}
                height={96}
                className="h-16 w-16 rounded-[0.75rem] object-contain"
              />
              <div>
                <p className="text-sm font-black text-forest">
                  No proof uploaded yet.
                </p>
                <p className="mt-1 text-xs font-bold leading-5 text-forest/58">
                  Start with one clear planting photo and care commitment.
                </p>
              </div>
            </div>
          )}
        </article>
      </div>

      <p className="relaxed-copy mt-4 rounded-[0.85rem] bg-lime/16 p-3 text-sm font-bold leading-6 text-forest/62">
        {TREECOIN_DISCLAIMER}
      </p>
    </section>
  );
}

function LiveMetric({
  label,
  value,
  detail,
  icon: Icon,
  coin = false,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Trees;
  coin?: boolean;
}) {
  return (
    <article className="dashboard-soft-tile rounded-[1.35rem] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.1em] text-forest/45">
            {label}
          </p>
          <p className="mt-2 text-3xl font-black text-forest">{value}</p>
        </div>
        {coin ? (
          <Image
            src={GROWCRED_ASSETS.brand.treeCoin}
            alt=""
            aria-hidden="true"
            width={72}
            height={72}
            className="h-12 w-12 object-contain"
          />
        ) : (
          <span className="grid h-12 w-12 place-items-center rounded-[0.9rem] bg-lime/28 text-forest">
            <Icon aria-hidden="true" className="h-5 w-5" />
          </span>
        )}
      </div>
      <p className="mt-3 text-xs font-bold leading-5 text-forest/56">
        {detail}
      </p>
    </article>
  );
}
