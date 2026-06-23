"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LogoMark } from "./logo-mark";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { href: "/#how-it-works", label: "How it Works" },
  { href: "/#rewards", label: "Rewards" },
  { href: "/challenges", label: "Challenges" },
  { href: "/learn", label: "Learn" },
  { href: "/community", label: "Community" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-forest/10 bg-off-white/80 backdrop-blur-2xl">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          aria-label="GrowCred home"
          className="rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leaf"
        >
          <LogoMark showWordmark size="sm" />
        </Link>

        <div className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-extrabold text-forest/70 transition hover:bg-white hover:text-forest hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf",
                pathname === item.href && "bg-white text-forest",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <ThemeToggle />
          <Link
            href="/auth"
            className="rounded-full border border-forest/10 bg-white/80 px-5 py-3 text-sm font-black text-forest transition hover:bg-lime/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
          >
            Sign in
          </Link>
          <Link
            href="/submit-proof"
            className="kinetic-border rounded-full bg-forest px-5 py-3 text-sm font-black text-white shadow-lg shadow-forest/15 transition hover:bg-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
          >
            Start Planting
          </Link>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          {!open ? <ThemeToggle compact /> : null}
          <button
            type="button"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-forest shadow-sm ring-1 ring-forest/10 transition hover:bg-lime/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
          >
            {open ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-forest/10 bg-off-white/95 px-4 py-4 shadow-xl shadow-forest/5 xl:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            <div className="flex items-center justify-between rounded-2xl bg-white/70 p-3">
              <span className="text-sm font-black text-forest">
                Site theme
              </span>
              <ThemeToggle />
            </div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-black text-forest transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/auth"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm font-black text-forest transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
            >
              Sign in
            </Link>
            <Link
              href="/submit-proof"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-2xl bg-forest px-4 py-3 text-center text-sm font-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
            >
              Start Planting
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
