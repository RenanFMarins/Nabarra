import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PortfolioItem {
  title: string;
  category: string;
  image: string;
  position: string;
}

export function PortfolioPreview({ showTitle = true }: { showTitle?: boolean }) {
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

  const items: PortfolioItem[] = [
    {
      title: "Ensaio Fotográfico",
      category: "Fotografia",
      image: `${apiBaseUrl}/preview/1`,
      position: "object-[center_58%]",
    },
    {
      title: "Cobertura de Evento",
      category: "Eventos",
      image: `${apiBaseUrl}/preview/2`,
      position: "object-center",
    },
    {
      title: "Criativo",
      category: "Edição",
      image: `${apiBaseUrl}/preview/3`,
      position: "object-[center_45%]",
    },
  ];

  return (
    <section id="portfolio" className="bg-black text-white py-24">
      <div className="max-w-7xl mx-auto px-6">

        {showTitle && (
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Portfólio</h2>
        )}

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ delay: i * 0.15 }}
              onClick={() => setSelected(item)}
              className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer"
            >
              {/* IMAGEM */}
              <img
                src={item.image}
                alt={item.title}
                className={`w-full h-full object-cover ${item.position} transition duration-500 group-hover:scale-110`}
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition duration-300" />

              {/* TEXTO */}
              <div className="absolute bottom-4 left-4 z-10 transform translate-y-2 group-hover:translate-y-0 transition duration-300">
                <p className="text-sm text-gray-300">
                  {item.category}
                </p>

                <h3 className="text-lg font-semibold group-hover:text-[#D4AF37] transition">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative max-w-5xl w-full flex flex-col items-center"
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* BOTÃO FECHAR */}
              <button
                onClick={() => setSelected(null)}
                className="absolute -top-14 right-0 w-11 h-11 flex items-center justify-center 
                rounded-full bg-white/10 backdrop-blur-md border border-white/20 
                text-white text-xl hover:bg-white hover:text-black hover:rotate-90 
                transition-all duration-300 shadow-lg"
              >
                ✕
              </button>

              {/* IMAGEM */}
              <img
                src={selected.image}
                alt={selected.title}
                className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-xl shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}