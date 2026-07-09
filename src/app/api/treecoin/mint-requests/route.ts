import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      mintRequests: [],
    });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { ok: false, error: "Sign in to view TreeCoin reward receipts." },
      { status: 401 },
    );
  }

  const { data, error } = await supabase
    .from("treecoin_mint_requests")
    .select(
      "id, ledger_id, proof_submission_id, recipient_address, amount, proof_hash, status, network, mint_address, recipient_token_account, transaction_signature, created_at, minted_at",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, mode: "supabase", mintRequests: data ?? [] });
}

export async function POST(request: NextRequest) {
  const supabase = await getServerSupabaseClient();
  const admin = getSupabaseAdminClient();

  if (!supabase || !admin) {
    return NextResponse.json({
      ok: false,
      mode: "preview",
      error: "Connect backend credentials before registering reward receipts.",
    });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { ok: false, error: "Sign in to register a reward recipient." },
      { status: 401 },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | { mintRequestId?: string; recipientAddress?: string }
    | null;
  const mintRequestId = body?.mintRequestId?.trim();
  const recipientAddress = body?.recipientAddress?.trim();

  if (!mintRequestId || !recipientAddress) {
    return NextResponse.json(
      { ok: false, error: "Mint request and recipient address are required." },
      { status: 400 },
    );
  }

  if (!isLikelySolanaPublicKey(recipientAddress)) {
    return NextResponse.json(
      { ok: false, error: "Recipient address is not a valid Solana address." },
      { status: 400 },
    );
  }

  const { data, error } = await admin
    .from("treecoin_mint_requests")
    .update({
      recipient_address: recipientAddress,
      status: "queued",
    })
    .eq("id", mintRequestId)
    .eq("user_id", user.id)
    .in("status", ["recipient_needed", "failed"])
    .select("id, status, recipient_address")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, mode: "supabase", mintRequest: data });
}

function isLikelySolanaPublicKey(value: string) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value);
}
