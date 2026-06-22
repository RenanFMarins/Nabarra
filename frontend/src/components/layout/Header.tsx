import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

function isActive(to: string, location: ReturnType<typeof useLocation>) {
  if (to.includes("#")) {
    const [, hash] = to.split("#");
    return location.hash === `#${hash}`;
  }
  // "Home" só fica ativo quando está na raiz SEM hash
  return location.pathname === to && !location.hash;
}

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Fotos", to: "/photos" },
  { label: "Portfólio", to: "/#portfolio" },
  { label: "Sobre", to: "/#about" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { items, openCart } = useCartStore();
  const cartCount = items.length;

  function handleHomeClick(e: React.MouseEvent) {
    e.preventDefault();
    setOpen(false);
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Limpa o hash sem recarregar
      history.replaceState(null, "", "/");
    } else {
      navigate("/");
    }
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        <div className="text-xl font-bold tracking-wide text-[#D6CBB5]">
          <a href="/" onClick={handleHomeClick} className="cursor-pointer">
            NABARRA <span className="text-gray-400 font-normal">films</span>
          </a>
        </div>

        {/* Right side: nav + cart + mobile toggle */}
        <div className="flex items-center gap-3">

          <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-white">
            {navLinks.map((link) =>
              link.to === "/" ? (
                <a
                  key={link.to}
                  href="/"
                  onClick={handleHomeClick}
                  className={`transition hover:text-[#E0C55A] cursor-pointer ${
                    isActive(link.to, location) ? "text-[#E0C55A]" : ""
                  }`}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`transition hover:text-[#E0C55A] ${
                    isActive(link.to, location) ? "text-[#E0C55A]" : ""
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}

            {/* Cart icon */}
            <button
              onClick={openCart}
              className="relative text-white p-2 -m-2 rounded-lg hover:bg-white/10 transition"
              aria-label="Carrinho"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#E0C55A] text-black text-xs font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/5 px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) =>
            link.to === "/" ? (
              <a
                key={link.to}
                href="/"
                onClick={handleHomeClick}
                className={`text-lg font-medium transition hover:text-[#E0C55A] cursor-pointer ${
                  isActive(link.to, location) ? "text-[#E0C55A]" : "text-white"
                }`}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`text-lg font-medium transition hover:text-[#E0C55A] ${
                  isActive(link.to, location) ? "text-[#E0C55A]" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </div>
      )}
    </header>
  );
}
