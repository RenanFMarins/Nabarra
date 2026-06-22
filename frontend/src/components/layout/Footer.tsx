import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/10">

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">

          {/* Logo / Sobre */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              NABARRA
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed">
              Produção audiovisual focada em criar experiências e criatividade
              na produção de conteúdo para marcas, eventos e criadores.
            </p>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>

            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Email: nabarrafilms@gmail.com</li>
              <li>Rio de Janeiro - RJ</li>
            </ul>
          </div>

          {/* Redes */}
          <div>
            <h4 className="font-semibold mb-4">Redes</h4>

            <ul className="space-y-3 text-sm">

              {/* WhatsApp */}
              <li>
                <a
                  href="https://wa.me/5521981757728?text=Olá,%20vim%20pelo%20site%20e%20gostaria%20de%20um%20orçamento"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900 text-gray-300 hover:bg-[#25D366] hover:text-black transition duration-300"
                >
                  <FaWhatsapp />
                  Fale comigo no WhatsApp
                </a>
              </li>

              {/* Instagram */}
              <li>
                <a
                  href="https://www.instagram.com/nabarrafilms?igsh=MWx4NWJ2NWxmc2Q2Mw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900 text-gray-300 hover:bg-[#D4AF37] hover:text-black transition duration-300"
                >
                  <FaInstagram />
                  Vejam nossos trabalhos
                </a>
              </li>

              {/* TikTok */}
              <li>
                <a
                  href="https://www.tiktok.com/@nabarrafilms?_r=1&_t=ZS-97PBMwJY5TO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900 text-gray-300 hover:bg-white hover:text-black transition duration-300"
                >
                  <FaTiktok />
                  Tiktok
                </a>
              </li>

            </ul>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-2">

          <p>
            © {new Date().getFullYear()} Nabarra Films. Todos os direitos reservados.
          </p>

          <p className="text-gray-600">
            Desenvolvido por Renan Freitas
          </p>

        </div>
      </div>

    </footer>
  );
}