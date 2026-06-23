export type ProofStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "verified"
  | "needs_more_info"
  | "rejected";

export type ProofType = "planting" | "care_checkin" | "survival_update";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  city: string;
  country: string;
  totalTreeCoins: number;
  verifiedTrees: number;
  badges: string[];
  createdAt: string;
}

export interface Tree {
  id: string;
  userId: string;
  nickname: string;
  species: string;
  locationName: string;
  latitude?: number;
  longitude?: number;
  plantedAt: string;
  status: ProofStatus;
  photos: string[];
  videoUrl?: string;
  treeCoinsEarned: number;
  nextCareReminder: string;
  survivalStage: "new" | "30_day" | "90_day" | "180_day" | "one_year";
}

export interface ProofSubmission {
  id: string;
  treeId: string;
  userId: string;
  type: ProofType;
  photoUrl: string;
  videoUrl?: string;
  notes: string;
  status: ProofStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewerId?: string;
}

export interface TreeCoinLedger {
  id: string;
  userId: string;
  treeId: string;
  action: string;
  amount: number;
  status: ProofStatus;
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  participants: number;
  startDate: string;
  endDate: string;
  status: "open" | "closing" | "completed";
  category: "solo" | "friends" | "school" | "campus" | "city";
  proofNeeded: string;
  progress: number;
  teamType: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
}

export interface AdminReview {
  id: string;
  proofSubmissionId: string;
  reviewerId: string;
  decision: ProofStatus;
  notes: string;
  fraudFlags: string[];
  reviewedAt?: string;
}

export interface CommunityStanding {
  id: string;
  name: string;
  location: string;
  verifiedTrees: number;
  treeCoinsEarned: number;
  badges: string[];
  rankLabel: string;
}

export interface CareGuideStep {
  id: string;
  dayRange: string;
  title: string;
  description: string;
  actions: string[];
  proofTip: string;
}

export interface CareReminder {
  id: string;
  userId: string;
  treeId: string;
  treeNickname: string;
  message: string;
  dueAt: string;
  channel: "in_app" | "email";
  status: "scheduled" | "sent" | "completed";
}

export interface ProofSubmissionResult {
  ok: boolean;
  mode: "demo" | "supabase";
  message: string;
  treeId?: string;
  proofSubmissionId?: string;
  status?: ProofStatus;
  issues?: string[];
}
