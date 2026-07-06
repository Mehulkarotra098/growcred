import Image from "next/image";
import {
  BadgeCheck,
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
    <div className="human-proof-board rounded-[2.35rem] p-3 shadow-2xl shadow-forest/12">
      <div className="rounded-[2rem] border border-forest/10 bg-white/82 p-4 backdrop-blur sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-forest/10 pb-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-leaf">
              Live proof board
            </p>
            <h2 className="mt-1 text-2xl font-black text-forest">
              Real people. Real trees. Human review.
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-lime/26 px-3 py-2 text-xs font-black text-forest">
            <Clock3 aria-hidden="true" className="h-4 w-4 text-leaf" />
            Queue moving
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="overflow-hidden rounded-[1.75rem] border border-forest/10 bg-off-white">
            <div className="relative aspect-[4/3]">
              <Image
                src={featuredSubmission.photoUrl}
                alt={`${featuredTree.nickname} proof photo submitted by ${featuredUser.name}`}
                fill
                priority
                sizes="(min-width: 1024px) 26vw, 88vw"
                className="object-cover"
              />
              <div className="absolute left-3 top-3">
                <StatusPill status={featuredSubmission.status} />
              </div>
              <div className="absolute bottom-3 left-3 right-3 rounded-[1.25rem] border border-white/60 bg-white/88 p-3 shadow-lg shadow-forest/10 backdrop-blur">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-forest text-xs font-black text-white">
                    {featuredUser.avatarUrl}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-forest">
                      {featuredUser.name}
                    </p>
                    <p className="truncate text-xs font-bold text-forest/58">
                      {featuredTree.locationName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-forest">
                    {featuredTree.nickname}
                  </h3>
                  <p className="text-sm font-bold text-forest/58">
                    {featuredTree.species} - submitted {formatDate(featuredSubmission.submittedAt)}
                  </p>
                </div>
                <span className="rounded-full bg-lime/24 px-3 py-1 text-xs font-black text-forest">
                  +10 pending
                </span>
              </div>
              <p className="rounded-[1.25rem] bg-white/72 p-3 text-sm font-bold leading-6 text-forest/66">
                {featuredSubmission.notes}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {proofChecks.map((check) => (
                <div
                  key={check.label}
                  className="rounded-[1.25rem] border border-forest/10 bg-off-white/82 p-4"
                >
                  <check.icon aria-hidden="true" className="h-5 w-5 text-leaf" />
                  <p className="mt-3 text-sm font-black text-forest">
                    {check.label}
                  </p>
                  <p className="mt-1 text-xs font-bold leading-5 text-forest/55">
                    Checked before reward approval.
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-[1.5rem] border border-forest/10 bg-white/72 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-leaf">
                    Reviewer note
                  </p>
                  <p className="mt-2 text-sm font-bold leading-6 text-forest/66">
                    Confirm the school permission and compare the location with
                    the next care update before releasing TreeCoins.
                  </p>
                </div>
                <BadgeCheck aria-hidden="true" className="h-8 w-8 shrink-0 text-leaf" />
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-leaf/18 bg-lime/18 p-4">
              <div className="flex items-center gap-3">
                <Image
                  src={GROWCRED_ASSETS.brand.treeCoin}
                  alt="TreeCoin gold reward point"
                  width={80}
                  height={80}
                  className="h-12 w-12 object-contain"
                />
                <div>
                  <p className="text-sm font-black text-forest">
                    Reward receipt
                  </p>
                  <p className="text-xs font-bold leading-5 text-forest/60">
                    TreeCoins release only after approval.
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs font-bold leading-5 text-forest/58">
                {TREECOIN_DISCLAIMER}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 border-t border-forest/10 pt-4 sm:grid-cols-2 xl:grid-cols-4">
          {recentProofs.map(({ proof, tree, user }) => (
            <article
              key={proof.id}
              className="rounded-[1.35rem] border border-forest/10 bg-white/68 p-3"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-lime/35 text-xs font-black text-forest">
                  {user.avatarUrl}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-forest">
                    {user.name}
                  </p>
                  <p className="truncate text-xs font-bold text-forest/52">
                    {user.city}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="truncate text-xs font-bold text-forest/62">
                  {tree.nickname}
                </p>
                <StatusPill status={proof.status} />
              </div>
            </article>
          ))}
        </div>
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
          className="human-card rounded-[1.65rem] p-5"
        >
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[1.25rem] bg-off-white ring-1 ring-forest/10">
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
          <div className="mt-4 flex items-center justify-between gap-3">
            <StatusPill status={proof.status} />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lime/22 px-3 py-1 text-xs font-black text-forest">
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
    <div className="human-card rounded-[1.75rem] p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-lime/28 text-forest">
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
            className="flex items-center gap-3 rounded-[1.15rem] bg-off-white/82 p-3"
          >
            <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0 text-leaf" />
            <span className="text-sm font-black text-forest">{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
