import Link from "next/link";
import { BRAND_SLOGAN, BRAND_TAGLINE, TREECOIN_DISCLAIMER } from "@/lib/copy";
import { LogoMark } from "./logo-mark";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/#how-it-works", label: "How it Works" },
  { href: "/treecoin", label: "TreeCoin" },
  { href: "/challenges", label: "Challenges" },
  { href: "/learn", label: "Learn" },
  { href: "mailto:hello@growcred.app", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-forest/10 bg-white/78">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-leaf/50 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:px-8">
        <div className="min-w-0">
          <LogoMark showWordmark size="sm" />
          <p className="mt-4 flex max-w-md flex-col gap-1 text-sm font-bold leading-6 text-forest/65 sm:flex-row sm:flex-wrap sm:gap-x-2 sm:gap-y-0">
            <span>{BRAND_TAGLINE}</span>
            <span>{BRAND_SLOGAN}</span>
          </p>
          <p className="relaxed-copy mt-3 max-w-xl text-xs font-semibold leading-5 text-forest/50">
            {TREECOIN_DISCLAIMER}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-1 sm:gap-2 lg:min-w-[24rem]">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm font-bold text-forest/62 transition hover:bg-lime/18 hover:text-forest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-forest/10 px-4 py-3 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-7xl text-xs font-bold text-forest/45">
          GrowCred turns real tree care into reviewable impact.
        </p>
      </div>
    </footer>
  );
}
