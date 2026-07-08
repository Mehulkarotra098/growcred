import Image from "next/image";
import {
  Camera,
  CheckCircle2,
  Clock3,
  Coins,
  Droplets,
  MapPinned,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import { GROWCRED_ASSETS } from "@/lib/assets";
import { TREECOIN_DISCLAIMER } from "@/lib/copy";
import { proofSubmissions, trees, users } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { StatusPill } from "./status-pill";

const proofChecks = [
  { label: "Tree visible", icon: Camera },
  { label: "Location context", icon: MapPinned },
  { label: "Permission confirmed", icon: ShieldCheck },
  { label: "Care follow-up set", icon: Droplets },
] as const;

const featuredSubmission =
  proofSubmissions.find((proof) => proof.status === "under_review") ??
  proofSubmissions[0];
const featuredTree = trees.find((tree) => tree.id === featuredSubmission.treeId) ?? trees[0];
const featuredUser = users.find((user) => user.id === featuredSubmission.userId) ?? users[0];

const recentProofs = proofSubmissions
  .filter((proof) => proof.status !== "draft")
  .map((proof) => {
    const tree = trees.find((item) => item.id === proof.treeId) ?? trees[0];
    const user = users.find((item) => item.id === proof.userId) ?? users[0];

    return { proof, tree, user };
  })
  .filter((item, index, list) => {
    return list.findIndex((candidate) => candidate.user.id === item.user.id) === index;
  })
  .slice(0, 4);

export function HumanProofBoard() {
  return (
    <div className="human-proof-board p-4 shadow-2xl shadow-forest/10 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-leaf">
            Live proof board
          </p>
          <h2 className="mt-2 text-2xl font-black leading-tight text-forest sm:text-3xl">
            Real people are planting, proving, and coming back.
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-forest/10 bg-white/70 px-3 py-2 text-xs font-black text-forest">
          <Clock3 aria-hidden="true" className="h-4 w-4 text-leaf" />
          18 proofs in review
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.02fr_0.98fr]">
        <article className="overflow-hidden rounded-[1rem] border border-forest/10 bg-white/72">
          <div className="relative aspect-[4/3]">
            <Image
              src={featuredSubmission.photoUrl}
              alt={`${featuredTree.nickname} proof photo submitted by ${featuredUser.name}`}
              fill
              priority
              sizes="(min-width: 1024px) 34vw, 92vw"
              className="object-cover"
            />
            <div className="absolute left-3 top-3">
              <StatusPill status={featuredSubmission.status} />
            </div>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-forest">
                  {featuredTree.nickname}
                </h3>
                <p className="mt-1 text-sm font-bold text-forest/58">
                  {featuredTree.species} in {featuredUser.city}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-[0.75rem] bg-lime/24 px-3 py-1.5 text-xs font-black text-forest">
                <Coins aria-hidden="true" className="h-3.5 w-3.5 text-leaf" />
                +10 after review
              </span>
            </div>
            <p className="mt-4 text-sm font-bold leading-6 text-forest/64">
              {featuredSubmission.notes}
            </p>
          </div>
        </article>

        <div className="grid content-start gap-3">
          {recentProofs.map(({ proof, tree, user }) => (
            <article
              key={proof.id}
              className="rounded-[0.95rem] border border-forest/10 bg-white/72 p-4"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lime/32 text-xs font-black text-forest">
                  {user.avatarUrl}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-black text-forest">{user.name}</p>
                    <StatusPill status={proof.status} />
                  </div>
                  <p className="mt-1 text-xs font-bold text-forest/55">
                    {user.city} - {formatDate(proof.submittedAt)}
                  </p>
                  <p className="mt-2 text-sm font-bold leading-5 text-forest/66">
                    Submitted {tree.nickname}, a {tree.species} tree.
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-forest/10 pt-5 sm:grid-cols-2 lg:grid-cols-4">
        {proofChecks.map((check) => (
          <div
            key={check.label}
            className="rounded-[0.9rem] border border-forest/10 bg-off-white/72 p-4"
          >
            <check.icon aria-hidden="true" className="h-5 w-5 text-leaf" />
            <p className="mt-3 text-sm font-black text-forest">{check.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-[0.95rem] border border-leaf/15 bg-lime/14 p-4 sm:flex-row sm:items-center">
        <Image
          src={GROWCRED_ASSETS.brand.treeCoin}
          alt="TreeCoin gold reward point"
          width={72}
          height={72}
          className="h-11 w-11 object-contain"
        />
        <p className="text-xs font-bold leading-5 text-forest/62">
          Rewards are released only after approval. {TREECOIN_DISCLAIMER}
        </p>
      </div>
    </div>
  );
}

export function HumanActivityStrip() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {recentProofs.slice(0, 3).map(({ proof, tree, user }) => (
        <article
          key={`activity-${proof.id}`}
          className="human-card p-4 sm:p-5"
        >
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[0.9rem] bg-off-white ring-1 ring-forest/10">
              <Image
                src={proof.photoUrl}
                alt={`${tree.nickname} tree proof thumbnail`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-forest">{user.name}</p>
              <p className="mt-1 text-xs font-bold text-forest/52">
                {user.city} - {formatDate(proof.submittedAt)}
              </p>
              <p className="mt-2 text-sm font-bold leading-6 text-forest/66">
                Submitted proof for {tree.nickname}, a {tree.species} tree.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <StatusPill status={proof.status} />
            <span className="inline-flex items-center gap-1.5 rounded-[0.75rem] bg-lime/22 px-3 py-1 text-xs font-black text-forest">
              <Coins aria-hidden="true" className="h-3.5 w-3.5 text-leaf" />
              {proof.status === "verified" ? "+10 earned" : "+10 after review"}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ProofPacketMini() {
  return (
    <div className="human-card p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-[0.9rem] bg-lime/28 text-forest">
          <Sprout aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-leaf">
            Proof packet
          </p>
          <h3 className="text-xl font-black text-forest">
            What a strong upload includes
          </h3>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {proofChecks.map((check) => (
          <div
            key={`mini-${check.label}`}
            className="flex items-center gap-3 rounded-[0.85rem] bg-off-white/82 p-3"
          >
            <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0 text-leaf" />
            <span className="text-sm font-black text-forest">{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
