import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import FlowingPaths from "@/components/FlowingPaths";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import Sidebar from "@/components/Sidebar";
import AboutContent from "@/components/sections/AboutContent";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "About Us — Brivix",
  description:
    "Brivix is a web design and digital experience agency founded in 2024. We transform websites, optimize ecommerce stores, and build premium digital experiences from scratch.",
};

export default function AboutPage() {
  return (
    <SmoothScroll>
      {/* fixed chrome */}
      <FlowingPaths />
      <div className="noise z-2 left-1/2 top-1/2 pointer-events-none fixed" />
      <Loader />
      <Nav />
      <Sidebar />

      <main>
        <AboutContent />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
