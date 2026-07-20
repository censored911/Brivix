import SmoothScroll from "@/components/SmoothScroll";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import Sidebar from "@/components/Sidebar";
import Hero from "@/components/Hero";
import ActivateNerves from "@/components/sections/ActivateNerves";
import StimulateMemory from "@/components/sections/StimulateMemory";
import Services from "@/components/sections/Services";
import Footer from "@/components/sections/Footer";
import GLBackground from "@/components/gl/GLBackground";

export default function Home() {
  return (
    <SmoothScroll>
      {/* fixed chrome */}
      <div className="noise z-2 left-1/2 top-1/2 pointer-events-none fixed" />
      <Loader />
      <Nav />
      <Sidebar />

      <main>
        <Hero />
        <ActivateNerves />
        <StimulateMemory />
        <Services />
        <Footer />
      </main>

      <GLBackground />
    </SmoothScroll>
  );
}
