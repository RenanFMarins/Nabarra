import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative h-[100svh] w-full flex items-center bg-black text-white overflow-hidden"
    >
      {/* Video background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="hidden md:block w-full h-full object-cover object-center"
        >
          <source src="/videos/Hero1.mp4" type="video/mp4" />
        </video>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="block md:hidden absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/Hero2.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black z-10" />

      <div className="relative z-20 w-full">
        <div className="max-w-7xl mx-auto px-6 py-32">
          <div className="max-w-3xl -translate-y-12 md:-translate-y-20 lg:-translate-y-28">

            <p className="text-sm md:text-base text-gray-400 mb-2 tracking-widest uppercase">
              Rede Colaborativa de
            </p>
            <p className="text-sm md:text-base text-gray-400 mb-6 tracking-widest uppercase">
              Produção Audiovisual
            </p>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              Transformamos ideias em
              <span className="block text-gray-300">
                experiências cinematográficas
              </span>
            </motion.h1>

            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-xl">
              Produção audiovisual profissional para marcas, eventos e criadores
              que querem impactar de verdade.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/5521981757728?text=Olá,%20vim%20pelo%20site%20e%20gostaria%20de%20um%20orçamento"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-black font-semibold rounded-lg text-center
                  transition duration-300 ease-out hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
              >
                Solicitar Orçamento
              </a>

              <Link
                to="/#portfolio"
                className="px-8 py-4 bg-[#D6CBB5]/90 text-black font-semibold rounded-lg text-center backdrop-blur-sm
                  transition duration-300 ease-out hover:bg-[#E0C55A] hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
              >
                Ver Portfólio
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
