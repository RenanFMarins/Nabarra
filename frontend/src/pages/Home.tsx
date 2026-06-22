import Hero from "@/components/sections/Hero";
import { PortfolioPreview } from "@/components/sections/PortfolioPreview";
import { About } from "@/components/sections/AboutPreview";
import { Services } from "@/components/sections/ServicesPreview";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <main className="pt-20">
        <Hero />
        <PortfolioPreview />
        <About />
        <Services />
      </main>
      <Footer />
    </>
  );
}
