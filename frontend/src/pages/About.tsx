import { About as AboutSection } from "@/components/sections/AboutPreview";
import { Services } from "@/components/sections/ServicesPreview";
import Footer from "@/components/layout/Footer";

export default function About() {
  return (
    <>
      <div className="pt-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Sobre nós</h1>
          <p className="text-gray-400 max-w-xl">
            Conheça a Nabarra Films e a nossa história.
          </p>
        </div>
        <AboutSection />
        <Services />
      </div>
      <Footer />
    </>
  );
}
