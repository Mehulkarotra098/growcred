"use client";

import Image from "next/image";
import { useState } from "react";
import { Bell, CheckCircle2, Mail, Sprout } from "lucide-react";
import type { CareReminder } from "@/lib/types";
import { GROWCRED_ASSETS } from "@/lib/assets";
import { cn, formatDate } from "@/lib/utils";

interface ReminderCenterProps {
  reminders: CareReminder[];
}

export function ReminderCenter({ reminders }: ReminderCenterProps) {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  return (
    <div className="living-card rounded-[2rem] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-leaf">
            Care reminders
          </p>
          <h2 className="mt-2 text-2xl font-black text-forest">
            Care reminders are ready.
          </h2>
        </div>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime/35 text-forest">
          <Bell aria-hidden="true" className="h-6 w-6" />
        </span>
      </div>

      <div className="mt-6 grid gap-3">
        {reminders.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-forest/15 bg-off-white p-5 text-center">
            <Image
              src={GROWCRED_ASSETS.states.noReminders}
              alt="No care reminders empty state illustration"
              width={720}
              height={720}
              className="mx-auto h-auto w-36 rounded-[1.25rem] object-contain"
            />
            <p className="mt-4 text-lg font-black text-forest">
              No reminders yet.
            </p>
            <p className="mt-2 text-sm font-bold leading-6 text-forest/60">
              Care reminders appear after you submit and track your first tree.
            </p>
          </div>
        ) : reminders.map((reminder) => {
          const isCompleted = completed[reminder.id];

          return (
            <article
              key={reminder.id}
              className={cn(
                "rounded-[1.5rem] border p-4 transition",
                isCompleted
                  ? "border-leaf/30 bg-leaf/10"
                  : "border-forest/10 bg-off-white",
              )}
            >
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-forest shadow-sm ring-1 ring-forest/10">
                  {reminder.channel === "email" ? (
                    <Mail aria-hidden="true" className="h-5 w-5" />
                  ) : (
                    <Sprout aria-hidden="true" className="h-5 w-5" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-black text-forest">
                    {reminder.treeNickname}
                  </p>
                  <p className="mt-1 text-sm font-bold leading-6 text-forest/65">
                    {reminder.message}
                  </p>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-forest/45">
                    Due {formatDate(reminder.dueAt)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setCompleted((current) => ({
                    ...current,
                    [reminder.id]: !current[reminder.id],
                  }))
                }
                className={cn(
                  "mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf",
                  isCompleted
                    ? "bg-leaf text-white"
                    : "bg-forest text-white hover:bg-leaf",
                )}
              >
                <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                {isCompleted ? "Completed" : "Mark cared"}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
