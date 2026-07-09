import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildAuthCallbackUrl,
  canReviewProof,
  isAdminEmail,
  normalizeEmail,
} from "../src/lib/backend/auth";

describe("backend auth helpers", () => {
  it("normalizes email addresses before comparisons", () => {
    assert.equal(normalizeEmail("  ADMIN@GrowCred.App "), "admin@growcred.app");
    assert.equal(normalizeEmail(null), "");
  });

  it("checks configured admin emails case-insensitively", () => {
    assert.equal(
      isAdminEmail("admin@growcred.app", "owner@growcred.app, ADMIN@GROWCRED.APP"),
      true,
    );
    assert.equal(isAdminEmail("grower@growcred.app", "owner@growcred.app"), false);
  });

  it("builds a safe absolute Supabase auth callback URL", () => {
    assert.equal(
      buildAuthCallbackUrl({
        siteUrl: "https://greencred.vercel.app/",
        nextPath: "/dashboard?tab=proofs",
      }),
      "https://greencred.vercel.app/auth/callback?next=%2Fdashboard%3Ftab%3Dproofs",
    );
    assert.equal(
      buildAuthCallbackUrl({
        siteUrl: "https://greencred.vercel.app",
        nextPath: "https://evil.example/phish",
      }),
      "https://greencred.vercel.app/auth/callback?next=%2Fdashboard",
    );
  });

  it("allows proof review only for admin/reviewer roles or configured admin emails", () => {
    assert.equal(
      canReviewProof({
        email: "owner@growcred.app",
        role: "grower",
        configuredAdminEmails: "owner@growcred.app",
      }),
      true,
    );
    assert.equal(
      canReviewProof({
        email: "reviewer@growcred.app",
        role: "reviewer",
        configuredAdminEmails: "",
      }),
      true,
    );
    assert.equal(
      canReviewProof({
        email: "grower@growcred.app",
        role: "grower",
        configuredAdminEmails: "owner@growcred.app",
      }),
      false,
    );
  });
});
