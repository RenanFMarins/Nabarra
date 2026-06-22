import { PortfolioPreview } from "@/components/sections/PortfolioPreview";
import Footer from "@/components/layout/Footer";

export default function Portfolio() {
  return (
    <>
      <div className="pt-20 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Portfólio</h1>
          <p className="text-gray-400 max-w-xl">
            Uma seleção dos nossos trabalhos em fotografia, eventos e criação de conteúdo.
          </p>
        </div>
        <PortfolioPreview showTitle={false} />
      </div>
      <Footer />
    </>
  );
}
