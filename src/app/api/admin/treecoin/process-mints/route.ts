import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  getTreeCoinMintServerConfig,
  sanitizeMintBatchLimit,
} from "@/lib/treecoin/server";

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.TREECOIN_MINT_WEBHOOK_SECRET;
  const providedSecret = request.headers
    .get("authorization")
    ?.replace("Bearer ", "")
    .trim();

  if (!expectedSecret) {
    return NextResponse.json(
      { ok: false, error: "TreeCoin mint processor secret is not configured." },
      { status: 503 },
    );
  }

  if (providedSecret !== expectedSecret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const configResult = getTreeCoinMintServerConfig();
  if (!configResult.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "TreeCoin Solana mint configuration is incomplete.",
        missing: configResult.missing,
      },
      { status: 503 },
    );
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Supabase service role is not configured." },
      { status: 503 },
    );
  }

  const limit = sanitizeMintBatchLimit(
    new URL(request.url).searchParams.get("limit") ?? undefined,
  );
  const { data: requests, error } = await supabase
    .from("treecoin_mint_requests")
    .select("id, recipient_address, amount, proof_hash, network")
    .eq("status", "queued")
    .not("recipient_address", "is", null)
    .limit(limit);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    mode: "supabase",
    processor: "external_worker_required",
    queued: requests?.length ?? 0,
    network: configResult.config.cluster,
    mintAddress: configResult.config.mintAddress,
    message:
      "Queued rewards are ready for the controlled TreeCoin mint worker. Run the operator mint script with the saved authority key.",
    requests: (requests ?? []).map((item) => ({
      id: item.id,
      amount: item.amount,
      proofHash: item.proof_hash,
      network: item.network,
    })),
  });
}
