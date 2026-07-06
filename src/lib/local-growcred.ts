"use client";

import {
  adminReviews as seedAdminReviews,
  proofSubmissions as seedProofSubmissions,
  treeCoinLedger as seedLedger,
  trees as seedTrees,
  users as seedUsers,
} from "@/lib/mock-data";
import type {
  AdminReview,
  ProofStatus,
  ProofSubmission,
  Tree,
  TreeCoinLedger,
  User,
} from "@/lib/types";

const stateKey = "growcred-local-state-v1";
const currentUserKey = "growcred-current-user-id";
const previewEmailKey = "growcred-preview-email";

export const localGrowCredChangedEvent = "growcred-local-state-changed";

export interface LocalGrowCredState {
  users: User[];
  trees: Tree[];
  proofSubmissions: ProofSubmission[];
  treeCoinLedger: TreeCoinLedger[];
  adminReviews: AdminReview[];
}

export interface LocalProofInput {
  nickname: string;
  species: string;
  plantedAt: string;
  locationName: string;
  coordinates?: string;
  notes?: string;
  photoFile: File;
  videoFile?: File | null;
}

export interface LocalReviewResult {
  ok: boolean;
  message: string;
  state: LocalGrowCredState;
}

function cloneSeedState(): LocalGrowCredState {
  return {
    users: seedUsers.map((user) => ({ ...user })),
    trees: seedTrees.map((tree) => ({ ...tree, photos: [...tree.photos] })),
    proofSubmissions: seedProofSubmissions.map((proof) => ({ ...proof })),
    treeCoinLedger: seedLedger.map((entry) => ({ ...entry })),
    adminReviews: seedAdminReviews.map((review) => ({
      ...review,
      fraudFlags: [...review.fraudFlags],
    })),
  };
}

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function createId(prefix: string) {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `${prefix}-${random}`;
}

function emitChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(localGrowCredChangedEvent));
}

export function getLocalGrowCredState(): LocalGrowCredState {
  if (!canUseStorage()) return cloneSeedState();

  const stored = window.localStorage.getItem(stateKey);
  if (!stored) {
    const seeded = cloneSeedState();
    saveLocalGrowCredState(seeded);
    return seeded;
  }

  try {
    const parsed = JSON.parse(stored) as LocalGrowCredState;
    if (
      !Array.isArray(parsed.users) ||
      !Array.isArray(parsed.trees) ||
      !Array.isArray(parsed.proofSubmissions) ||
      !Array.isArray(parsed.treeCoinLedger) ||
      !Array.isArray(parsed.adminReviews)
    ) {
      throw new Error("Invalid GrowCred state");
    }

    return parsed;
  } catch {
    const seeded = cloneSeedState();
    saveLocalGrowCredState(seeded);
    return seeded;
  }
}

export function saveLocalGrowCredState(state: LocalGrowCredState) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(stateKey, JSON.stringify(state));
  emitChange();
}

export function subscribeToLocalGrowCred(listener: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key === stateKey || event.key === currentUserKey) listener();
  };

  window.addEventListener(localGrowCredChangedEvent, listener);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(localGrowCredChangedEvent, listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function getCurrentLocalUser(state = getLocalGrowCredState()) {
  if (!canUseStorage()) return state.users[0];

  const currentUserId = window.localStorage.getItem(currentUserKey);
  const previewEmail = window.localStorage.getItem(previewEmailKey);

  return (
    state.users.find((user) => user.id === currentUserId) ??
    state.users.find((user) => user.email === previewEmail) ??
    state.users[0]
  );
}

export function upsertLocalAccount({
  name,
  email,
}: {
  name?: string;
  email: string;
}) {
  const normalizedEmail = email.trim().toLowerCase();
  const displayName =
    name?.trim() || normalizedEmail.split("@")[0] || "Green Champion";
  const state = getLocalGrowCredState();
  const existingIndex = state.users.findIndex(
    (user) => user.email.toLowerCase() === normalizedEmail,
  );

  const nextUser: User =
    existingIndex >= 0
      ? {
          ...state.users[existingIndex],
          name: displayName,
          email: normalizedEmail,
          avatarUrl: initialsFor(displayName),
        }
      : {
          id: createId("local-user"),
          name: displayName,
          email: normalizedEmail,
          avatarUrl: initialsFor(displayName),
          city: "Your city",
          country: "India",
          totalTreeCoins: 0,
          verifiedTrees: 0,
          badges: ["badge-1"],
          createdAt: new Date().toISOString(),
        };

  const nextUsers =
    existingIndex >= 0
      ? state.users.map((user, index) => (index === existingIndex ? nextUser : user))
      : [nextUser, ...state.users];

  const nextState = { ...state, users: nextUsers };
  saveLocalGrowCredState(nextState);
  window.localStorage.setItem(currentUserKey, nextUser.id);
  window.localStorage.setItem(previewEmailKey, nextUser.email);
  emitChange();

  return nextUser;
}

export function signOutLocalAccount() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(currentUserKey);
  window.localStorage.removeItem(previewEmailKey);
  emitChange();
}

export async function createLocalProof(input: LocalProofInput) {
  const state = getLocalGrowCredState();
  const user = getCurrentLocalUser(state);
  const now = new Date().toISOString();
  const treeId = createId("local-tree");
  const proofSubmissionId = createId("local-proof");
  const photoUrl = await imageFileToWebDataUrl(input.photoFile);
  const { latitude, longitude } = parseCoordinates(input.coordinates);

  const tree: Tree = {
    id: treeId,
    userId: user.id,
    nickname: input.nickname,
    species: input.species,
    locationName: input.locationName,
    latitude,
    longitude,
    plantedAt: input.plantedAt,
    status: "under_review",
    photos: [photoUrl],
    videoUrl: input.videoFile ? `Uploaded video: ${input.videoFile.name}` : undefined,
    treeCoinsEarned: 0,
    nextCareReminder: `30-day care check-in for ${input.nickname}`,
    survivalStage: "new",
  };

  const proof: ProofSubmission = {
    id: proofSubmissionId,
    treeId,
    userId: user.id,
    type: "planting",
    photoUrl,
    videoUrl: tree.videoUrl,
    notes: input.notes?.trim() || "Submitted planting proof for review.",
    status: "under_review",
    submittedAt: now,
  };

  const ledgerEntry: TreeCoinLedger = {
    id: createId("local-ledger"),
    userId: user.id,
    treeId,
    action: "Planting proof reward pending verification",
    amount: 10,
    status: "under_review",
    createdAt: now,
  };

  const nextState: LocalGrowCredState = {
    ...state,
    trees: [tree, ...state.trees],
    proofSubmissions: [proof, ...state.proofSubmissions],
    treeCoinLedger: [ledgerEntry, ...state.treeCoinLedger],
  };

  saveLocalGrowCredState(nextState);

  return { tree, proof, ledgerEntry, state: nextState };
}

export function reviewLocalProof({
  proofSubmissionId,
  decision,
  notes,
  fraudFlags = [],
}: {
  proofSubmissionId: string;
  decision: ProofStatus;
  notes?: string;
  fraudFlags?: string[];
}): LocalReviewResult {
  const state = getLocalGrowCredState();
  const proof = state.proofSubmissions.find((item) => item.id === proofSubmissionId);

  if (!proof) {
    return { ok: false, message: "Proof submission was not found.", state };
  }

  const reviewedAt = new Date().toISOString();
  const previousStatus = proof.status;
  const wasVerified = previousStatus === "verified";

  const nextProofs = state.proofSubmissions.map((item) =>
    item.id === proofSubmissionId
      ? { ...item, status: decision, reviewedAt, reviewerId: "local-admin" }
      : item,
  );

  const nextTrees = state.trees.map((tree) =>
    tree.id === proof.treeId
      ? {
          ...tree,
          status: decision,
          treeCoinsEarned:
            decision === "verified" && !wasVerified
              ? tree.treeCoinsEarned + 10
              : tree.treeCoinsEarned,
        }
      : tree,
  );

  const nextLedgerStatus: ProofStatus =
    decision === "verified" ? "verified" : decision;

  const nextLedger = state.treeCoinLedger.map((entry) =>
    entry.treeId === proof.treeId && entry.userId === proof.userId
      ? {
          ...entry,
          status: nextLedgerStatus,
          action:
            decision === "verified"
              ? "Verified planting proof reward"
              : entry.action,
        }
      : entry,
  );

  const nextUsers = state.users.map((user) =>
    user.id === proof.userId && decision === "verified" && !wasVerified
      ? {
          ...user,
          totalTreeCoins: user.totalTreeCoins + 10,
          verifiedTrees: user.verifiedTrees + 1,
        }
      : user,
  );

  const review: AdminReview = {
    id: createId("local-review"),
    proofSubmissionId,
    reviewerId: "local-admin",
    decision,
    notes: notes ?? "",
    fraudFlags,
    reviewedAt,
  };

  const nextReviews = [
    review,
    ...state.adminReviews.filter((item) => item.proofSubmissionId !== proofSubmissionId),
  ];

  const nextState = {
    users: nextUsers,
    trees: nextTrees,
    proofSubmissions: nextProofs,
    treeCoinLedger: nextLedger,
    adminReviews: nextReviews,
  };

  saveLocalGrowCredState(nextState);

  return {
    ok: true,
    message:
      decision === "verified"
        ? "Proof verified. +10 TreeCoins credited automatically."
        : "Review decision saved.",
    state: nextState,
  };
}

function initialsFor(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function parseCoordinates(value?: string) {
  if (!value) return {};
  const [lat, lng] = value
    .split(",")
    .map((part) => Number.parseFloat(part.trim()));

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return {};
  return { latitude: lat, longitude: lng };
}

async function imageFileToWebDataUrl(file: File) {
  const rawDataUrl = await readFileAsDataUrl(file);

  if (!file.type.startsWith("image/")) return rawDataUrl;

  try {
    const image = await loadImage(rawDataUrl);
    const maxSize = 1080;
    const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return rawDataUrl;
    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/webp", 0.82);
  } catch {
    return rawDataUrl;
  }
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}
