import { motion } from "framer-motion";
import {
  Camera,
  Video,
  Clapperboard,
  Sparkles
} from "lucide-react";

export function Services() {
  const services = [
    {
      title: "Fotografia",
      description:
        "Ensaios e registros com estética cinematográfica, captando emoção, identidade e presença.",
      icon: Camera,
    },
    {
      title: "Cobertura de Eventos",
      description:
        "Registros dinâmicos e naturais que preservam cada momento com qualidade e impacto visual.",
      icon: Video,
    },
    {
      title: "Reels & Conteúdo",
      description:
        "Vídeos estratégicos para redes sociais, pensados para gerar engajamento e crescimento.",
      icon: Clapperboard,
    },
    {
      title: "Direção Criativa",
      description:
        "Planejamento visual e storytelling para transformar ideias em experiências marcantes.",
      icon: Sparkles,
    },
  ];

  return (
    <section
      id="services"
      className="bg-black text-white py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">

        {/* TITULO */}
        <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-bold mb-6 text-left"
        >
        Serviços
        </motion.h2>

        <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-gray-400 mb-20 max-w-2xl text-left"
        >
        Cada projeto é pensado para gerar impacto visual, conexão e valor
        para sua marca ou momento.
        </motion.p>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {services.map((service, i) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ delay: i * 0.15 }}
                className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent"
              >
                {/* CARD */}
                <div className="p-8 rounded-2xl bg-zinc-900 h-full transition duration-500 group-hover:bg-zinc-800 group-hover:-translate-y-2">

                  {/* ICON */}
                  <div className="mb-6 w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-[#D4AF37] transition duration-300">
                    <Icon className="w-6 h-6 text-white group-hover:text-black transition" />
                  </div>

                  {/* TITLE */}
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-[#D4AF37] transition">
                    {service.title}
                  </h3>

                  {/* DESC */}
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {service.description}
                  </p>

                  {/* LINHA ANIMADA */}
                  <div className="mt-6 w-0 h-[2px] bg-[#D4AF37] group-hover:w-full transition-all duration-300"></div>
                </div>
              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}