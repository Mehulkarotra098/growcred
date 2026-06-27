import { NextRequest, NextResponse } from "next/server";
import { careReminders } from "@/lib/mock-data";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const expectedSecret = process.env.REMINDER_WEBHOOK_SECRET;
  if (expectedSecret) {
    const provided = request.headers.get("authorization")?.replace("Bearer ", "");
    if (provided !== expectedSecret) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      queued: careReminders.filter((reminder) => reminder.status === "scheduled"),
    });
  }

  const now = new Date().toISOString();
  const { data: reminders, error } = await supabase
    .from("care_reminders")
    .select("id, user_id, tree_id, message, due_at, channel, status")
    .eq("status", "scheduled")
    .lte("due_at", now)
    .limit(50);

  if (error) {
    return NextResponse.json(
      { ok: false, mode: "supabase", error: error.message },
      { status: 500 },
    );
  }

  if (!reminders?.length) {
    return NextResponse.json({ ok: true, mode: "supabase", queued: [] });
  }

  const outboxRows = reminders.map((reminder) => ({
    user_id: reminder.user_id,
    care_reminder_id: reminder.id,
    channel: reminder.channel,
    subject: "GrowCred care reminder",
    body: reminder.message,
    status: "queued",
  }));

  const { error: outboxError } = await supabase
    .from("notification_outbox")
    .insert(outboxRows);

  if (outboxError) {
    return NextResponse.json(
      { ok: false, mode: "supabase", error: outboxError.message },
      { status: 500 },
    );
  }

  await supabase
    .from("care_reminders")
    .update({ status: "sent", sent_at: now })
    .in(
      "id",
      reminders.map((reminder) => reminder.id),
    );

  return NextResponse.json({
    ok: true,
    mode: "supabase",
    queued: reminders.length,
  });
}
