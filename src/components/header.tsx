"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LogoMark } from "./logo-mark";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { href: "/#how-it-works", label: "How it Works" },
  { href: "/treecoin", label: "TreeCoin" },
  { href: "/challenges", label: "Challenges" },
  { href: "/learn", label: "Learn" },
  { href: "/community", label: "Community" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActivePath = (href: string) => !href.includes("#") && pathname === href;

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-forest/10 bg-off-white/80 backdrop-blur-2xl">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          aria-label="GrowCred home"
          className="rounded-[0.9rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leaf"
        >
          <LogoMark showWordmark size="xs" />
        </Link>

        <div className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => {
            const isActive = isActivePath(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-[0.85rem] px-2.5 py-2 text-sm font-extrabold text-forest/70 transition hover:bg-white hover:text-forest hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf",
                  isActive && "bg-white text-forest",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <ThemeToggle />
          <Link
            href="/auth"
            className="whitespace-nowrap rounded-[0.9rem] border border-forest/10 bg-white/80 px-4 py-3 text-sm font-black text-forest transition hover:bg-lime/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
          >
            Sign in
          </Link>
          <Link
            href="/submit-proof"
            className="kinetic-border whitespace-nowrap rounded-[0.9rem] bg-forest px-4 py-3 text-sm font-black text-white shadow-lg shadow-forest/15 transition hover:bg-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
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
            className="grid h-11 w-11 place-items-center rounded-[0.9rem] bg-white text-forest shadow-sm ring-1 ring-forest/10 transition hover:bg-lime/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
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
        <>
          <button
            type="button"
            aria-label="Close navigation menu overlay"
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-[4.55rem] z-40 bg-forest/25 backdrop-blur-sm xl:hidden"
          />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-x-4 top-[5.1rem] z-50 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-[1.15rem] border border-forest/10 bg-off-white/95 px-4 py-4 shadow-2xl shadow-forest/20 xl:hidden"
        >
          <div className="mx-auto grid max-w-7xl gap-2">
            <div className="flex items-center justify-between rounded-[0.9rem] bg-white/70 p-3">
              <span className="text-sm font-black text-forest">
                Site theme
              </span>
              <ThemeToggle />
            </div>
            {navItems.map((item) => {
              const isActive = isActivePath(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-[0.9rem] px-4 py-3 text-sm font-black text-forest transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf",
                    isActive && "bg-white shadow-sm",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/auth"
              onClick={() => setOpen(false)}
              className="rounded-[0.9rem] px-4 py-3 text-sm font-black text-forest transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
            >
              Sign in
            </Link>
            <Link
              href="/submit-proof"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-[0.9rem] bg-forest px-4 py-3 text-center text-sm font-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
            >
              Start Planting
            </Link>
          </div>
        </div>
        </>
      ) : null}
    </header>
  );
}
