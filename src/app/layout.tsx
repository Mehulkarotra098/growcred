import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { GROWCRED_ASSETS } from "@/lib/assets";
import { SEO_DESCRIPTION } from "@/lib/copy";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const themeInitScript = `
(() => {
  try {
    const stored = localStorage.getItem("growcred-theme");
    const theme = stored === "dark" || stored === "light"
      ? stored
      : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch (_) {
    document.documentElement.dataset.theme = "light";
  }
})();
`;

function getMetadataBase() {
  const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelUrl = process.env.VERCEL_URL?.trim();
  const siteUrl =
    publicSiteUrl || (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000");

  try {
    return new URL(siteUrl);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: "GrowCred - Plant. Prove. Protect.",
  description: SEO_DESCRIPTION,
  openGraph: {
    title: "GrowCred - Plant. Prove. Protect.",
    description: SEO_DESCRIPTION,
    siteName: "GrowCred",
    images: [
      {
        url: GROWCRED_ASSETS.brand.logoWordmark,
        width: 2048,
        height: 640,
        alt: "GrowCred - Plant. Prove. Protect.",
      },
    ],
  },
  icons: {
    icon: GROWCRED_ASSETS.brand.logoEmblem,
    apple: GROWCRED_ASSETS.brand.logoEmblem,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakarta.variable} scroll-smooth`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
