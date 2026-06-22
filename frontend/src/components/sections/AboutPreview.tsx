export function About() {
  return (
    <section id="about" className="bg-zinc-950 text-white py-28">
      <div className="max-w-4xl mx-auto px-6 text-center">

        <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
          Criamos momentos com{" "}
          <span className="text-[#D4AF37]">impacto visual</span>
        </h2>

        <p className="text-gray-400 text-lg leading-relaxed mb-6">
          A Nabarra Films nasce da paixão por contar histórias reais com estética
          cinematográfica. Cada projeto que passa por aqui é tratado como único,
          com atenção aos detalhes, direção criativa e um olhar voltado para o que
          realmente importa.
        </p>

        <p className="text-gray-500 text-base leading-relaxed mb-6">
          Atuamos com fotografia, cobertura de eventos e criação de
          conteúdos estratégicos para redes sociais. Nosso foco não é apenas
          registrar, mas criar materiais que posicionam, valorizam e geram
          conexão com o público.
        </p>

        <p className="text-gray-500 text-base leading-relaxed mb-10">
          Seja para eternizar um momento importante ou fortalecer a presença da
          sua marca, entregamos mais do que imagens — entregamos identidade,
          presença e resultado.
        </p>

        <a
          href="https://wa.me/5521981757728?text=Olá,%20vim%20pelo%20site%20e%20gostaria%20de%20um%20orçamento"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-[#E0C55A] hover:scale-[1.03] transition duration-300"
        >
          Solicitar orçamento
        </a>

      </div>
    </section>
  );
}