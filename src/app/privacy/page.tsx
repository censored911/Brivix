import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import FlowingPaths from "@/components/FlowingPaths";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import Sidebar from "@/components/Sidebar";
import LegalContent from "@/components/sections/LegalContent";
import Footer from "@/components/sections/Footer";
import { PRIVACY } from "@/data/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — Brivix",
  description:
    "How Brivix collects, uses, shares, and protects personal data — and the rights you have over yours.",
};

export default function PrivacyPage() {
  return (
    <SmoothScroll>
      {/* fixed chrome */}
      <FlowingPaths />
      <div className="noise z-2 left-1/2 top-1/2 pointer-events-none fixed" />
      <Loader />
      <Nav />
      <Sidebar />

      <main>
        <LegalContent doc={PRIVACY} />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
