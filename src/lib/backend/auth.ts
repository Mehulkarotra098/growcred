export function normalizeEmail(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

export function isAdminEmail(
  email: string | null | undefined,
  configuredEmails = process.env.GROWCRED_ADMIN_EMAILS ?? "",
) {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;

  return configuredEmails
    .split(",")
    .map((item) => normalizeEmail(item))
    .filter(Boolean)
    .includes(normalized);
}

export function canReviewProof({
  email,
  role,
  configuredAdminEmails = process.env.GROWCRED_ADMIN_EMAILS ?? "",
}: {
  email: string | null | undefined;
  role: string | null | undefined;
  configuredAdminEmails?: string;
}) {
  if (isAdminEmail(email, configuredAdminEmails)) return true;
  return role === "admin" || role === "reviewer";
}

export function getPublicSiteUrl(env?: Record<string, string | undefined>) {
  if (typeof window !== "undefined") return window.location.origin;

  const source =
    env ?? (typeof process !== "undefined" ? process.env : {});
  const explicit = source.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return trimTrailingSlash(explicit);

  const vercelUrl = source.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${trimTrailingSlash(vercelUrl)}`;

  return "http://localhost:3000";
}

export function buildAuthCallbackUrl({
  siteUrl = getPublicSiteUrl(),
  nextPath = "/dashboard",
}: {
  siteUrl?: string;
  nextPath?: string;
}) {
  const url = new URL("/auth/callback", trimTrailingSlash(siteUrl));
  url.searchParams.set("next", normalizeInternalPath(nextPath));
  return url.toString();
}

export function normalizeInternalPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}
