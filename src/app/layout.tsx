import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const denim = localFont({
  src: [
    { path: "../../public/fonts/font-1.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/font-2.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-denim",
  display: "swap",
});

const graebenbach = localFont({
  src: [
    { path: "../../public/fonts/font-3.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/font-4.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-graebenbach",
  display: "swap",
});

const SITE_DESCRIPTION =
  "Brivix transforms websites into modern, high-converting experiences. Web design and development, ecommerce optimization, branding, and digital marketing — built to capture attention and drive results.";

export const metadata: Metadata = {
  // Set NEXT_PUBLIC_SITE_URL in the deploy environment so OG/canonical URLs
  // resolve against the production domain instead of localhost.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: "Brivix — Web Design & Digital Experience Agency",
  description: SITE_DESCRIPTION,
  icons: { icon: "/seo/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "Brivix",
    title: "Brivix — Web Design & Digital Experience Agency",
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Brivix — Web Design & Digital Experience Agency",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Extensions (ad blockers, analytics/tracking add-ons) stamp attributes
    // onto <html> before React hydrates — e.g. `data-trendtrack-react-active`.
    // Nothing on our side renders differently between server and client, so
    // suppress the mismatch on this element only.
    <html
      lang="en"
      className={`${denim.variable} ${graebenbach.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-grey text-black at-top">{children}</body>
    </html>
  );
}
