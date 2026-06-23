"use client";

import { FormEvent, useEffect, useState } from "react";
import { LogIn, LogOut, Mail, UserPlus } from "lucide-react";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/config";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";

type AuthMode = "sign-in" | "sign-up";

export function AuthPanel() {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [currentEmail, setCurrentEmail] = useState(() => {
    if (typeof window === "undefined" || isSupabaseBrowserConfigured()) return "";
    return localStorage.getItem("growcred-demo-email") ?? "";
  });
  const [message, setMessage] = useState("");
  const configured = isSupabaseBrowserConfigured();

  useEffect(() => {
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      setCurrentEmail(data.user?.email ?? "");
    });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!configured) {
      localStorage.setItem("growcred-demo-email", email);
      setCurrentEmail(email);
      setMessage("Sign in to track your impact.");
      return;
    }

    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;

    const response =
      mode === "sign-in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } },
          });

    if (response.error) {
      setMessage(response.error.message);
      return;
    }

    setCurrentEmail(response.data.user?.email ?? email);
    setMessage(
      mode === "sign-in"
        ? "Signed in. Your proof and care progress can now be tracked."
        : "Account created. Check your email if confirmation is required.",
    );
  }

  async function signOut() {
    const supabase = getBrowserSupabaseClient();
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem("growcred-demo-email");
    setCurrentEmail("");
    setMessage("Signed out.");
  }

  return (
    <div className="living-card rounded-[2rem] p-6 sm:p-8">
      <div className="flex flex-wrap gap-2">
        {(["sign-in", "sign-up"] as const).map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={mode === item}
            onClick={() => setMode(item)}
            className={
              mode === item
                ? "rounded-full bg-forest px-4 py-2 text-sm font-black text-white"
                : "rounded-full border border-forest/10 bg-off-white px-4 py-2 text-sm font-black text-forest"
            }
          >
            {item === "sign-in" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      {currentEmail ? (
        <div className="mt-6 rounded-[1.5rem] bg-lime/25 p-4">
          <p className="text-sm font-black text-forest">
            Active session: {currentEmail}
          </p>
          <button
            type="button"
            onClick={signOut}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-xs font-black text-white transition hover:bg-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
          >
            <LogOut aria-hidden="true" className="h-4 w-4" />
            Sign out
          </button>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        {mode === "sign-up" ? (
          <label className="grid gap-2 text-sm font-black text-forest">
            Name
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="min-h-12 rounded-2xl border border-forest/15 bg-off-white px-4 text-sm font-bold text-forest focus:outline-none"
              placeholder="Aarav Mehta"
            />
          </label>
        ) : null}
        <label className="grid gap-2 text-sm font-black text-forest">
          Email
          <span className="flex min-h-12 items-center gap-3 rounded-2xl border border-forest/15 bg-off-white px-4">
            <Mail aria-hidden="true" className="h-5 w-5 text-leaf" />
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-12 w-full bg-transparent text-sm font-bold text-forest placeholder:text-forest/35 focus:outline-none"
              placeholder="you@example.com"
            />
          </span>
        </label>
        <label className="grid gap-2 text-sm font-black text-forest">
          Password
          <input
            required
            type="password"
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="min-h-12 rounded-2xl border border-forest/15 bg-off-white px-4 text-sm font-bold text-forest focus:outline-none"
            placeholder="At least 6 characters"
          />
        </label>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-4 text-sm font-black text-white shadow-xl shadow-forest/15 transition hover:bg-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
        >
          {mode === "sign-in" ? (
            <LogIn aria-hidden="true" className="h-4 w-4" />
          ) : (
            <UserPlus aria-hidden="true" className="h-4 w-4" />
          )}
          {mode === "sign-in" ? "Sign in" : "Create GrowCred account"}
        </button>
      </form>

      <p className="mt-5 rounded-[1.25rem] bg-aqua/10 p-4 text-sm font-bold leading-6 text-forest/70">
        {configured
          ? "Sign in to track your impact, proof status, care reminders, and TreeCoin progress."
          : "Preview the proof flow now. Sign in to track your impact when account saving is connected."}
      </p>
      {message ? (
        <p className="mt-4 text-sm font-black text-forest">{message}</p>
      ) : null}
    </div>
  );
}
