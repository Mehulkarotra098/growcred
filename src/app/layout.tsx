import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { GROWCRED_ASSETS } from "@/lib/assets";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://growcred.local"),
  title: "GrowCred — Plant. Prove. Protect.",
  description:
    "Plant real trees, prove your impact, and earn TreeCoins for verified tree care.",
  openGraph: {
    title: "GrowCred — Plant. Prove. Protect.",
    description:
      "Plant real trees, prove your impact, and earn TreeCoins for verified tree care.",
    siteName: "GrowCred",
    images: [
      {
        url: GROWCRED_ASSETS.site.heroLanding,
        width: 1536,
        height: 1024,
        alt: "GrowCred app landing visual for verified tree care",
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
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
