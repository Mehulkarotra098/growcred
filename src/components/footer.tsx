import Link from "next/link";
import Image from "next/image";
import { brandAssets } from "@/lib/brand-assets";
import { BRAND_SLOGAN, BRAND_TAGLINE, TREECOIN_DISCLAIMER } from "@/lib/copy";
import { LogoMark } from "./logo-mark";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/#how-it-works", label: "How it Works" },
  { href: "/#rewards", label: "Rewards" },
  { href: "/challenges", label: "Challenges" },
  { href: "/learn", label: "Learn" },
  { href: "mailto:hello@growcred.app", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-forest/10 bg-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-leaf/50 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <LogoMark showWordmark size="sm" />
          <p className="mt-4 max-w-md text-sm font-bold leading-6 text-forest/65">
            {BRAND_TAGLINE} {BRAND_SLOGAN}
          </p>
          <p className="mt-4 max-w-xl text-xs font-semibold leading-6 text-forest/50">
            {TREECOIN_DISCLAIMER}
          </p>
          <div className="mt-5 flex items-center gap-3">
            <Image
              src={brandAssets.earnGreen}
              alt=""
              aria-hidden="true"
              width={86}
              height={86}
              className="h-14 w-14"
            />
            <Image
              src={brandAssets.betterTogether}
              alt=""
              aria-hidden="true"
              width={180}
              height={120}
              className="h-auto w-28"
            />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm font-bold text-forest/65 transition hover:bg-lime/25 hover:text-forest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
