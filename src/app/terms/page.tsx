import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import FlowingPaths from "@/components/FlowingPaths";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import Sidebar from "@/components/Sidebar";
import LegalContent from "@/components/sections/LegalContent";
import Footer from "@/components/sections/Footer";
import { TERMS } from "@/data/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions — Brivix",
  description:
    "The terms that govern use of the Brivix website and the design, development, and marketing services we provide.",
};

export default function TermsPage() {
  return (
    <SmoothScroll>
      {/* fixed chrome */}
      <FlowingPaths />
      <div className="noise z-2 left-1/2 top-1/2 pointer-events-none fixed" />
      <Loader />
      <Nav />
      <Sidebar />

      <main>
        <LegalContent doc={TERMS} pdfHref="/terms/pdf" />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
