import { useState, useEffect } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { useCartStore, type CartItem } from "@/store/cartStore";


export default function Fotos() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("todas");
  const [fotos, setFotos] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { items, addItem, openCart } = useCartStore();

  const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

  useEffect(() => {
    fetch(`${BASE_URL}/photos`)
      .then((r) => r.json())
      .then((data: Array<{ id: number; title: string; price: number; category: string }>) => {
        setFotos(data.map((f) => ({ ...f, image: `${BASE_URL}/preview/${f.id}` })));
      })
      .finally(() => setLoading(false));
  }, [BASE_URL]);

  const categoriasDisponiveis = ["todas", ...new Set(fotos.map((f) => f.category))];

  const fotosFiltradas =
    categoriaAtiva === "todas"
      ? fotos
      : fotos.filter((f) => f.category === categoriaAtiva);

  const isInCart = (id: number) => items.some((i) => i.id === id);

  function handleAdd(foto: CartItem) {
    if (isInCart(foto.id)) openCart();
    else addItem(foto);
  }

  return (
    <>
      <div className="bg-black text-white min-h-screen pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-4xl md:text-5xl font-bold mb-4">Fotos</h1>
          <p className="text-gray-400 mb-10">
            Adicione as fotos que quiser ao carrinho e finalize a compra de uma vez.
          </p>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categoriasDisponiveis.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaAtiva(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition duration-200 ${
                  categoriaAtiva === cat
                    ? "bg-white text-black"
                    : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 size={36} className="animate-spin text-gray-500" />
            </div>
          )}

          {/* Grid */}
          {!loading && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {fotosFiltradas.map((foto) => {
                const inCart = isInCart(foto.id);
                return (
                  <div
                    key={foto.id}
                    className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/5"
                  >
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img
                        src={foto.image}
                        alt={foto.title}
                        className="w-full h-full object-cover blur-md group-hover:blur-none transition duration-500 scale-105 group-hover:scale-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs text-gray-300 capitalize">
                        {foto.category}
                      </span>
                      {inCart && (
                        <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-[#E0C55A] text-black text-xs font-bold flex items-center gap-1">
                          <Check size={11} /> No carrinho
                        </span>
                      )}
                    </div>

                    <div className="p-5">
                      <h2 className="text-lg font-semibold mb-1">{foto.title}</h2>
                      <p className="text-[#D4AF37] font-bold text-xl mb-4">
                        R$ {foto.price.toFixed(2).replace(".", ",")}
                      </p>
                      <button
                        onClick={() => handleAdd(foto)}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                          font-semibold text-sm transition duration-200 ${
                            inCart
                              ? "bg-[#E0C55A] text-black hover:bg-yellow-300"
                              : "bg-white text-black hover:bg-[#E0C55A]"
                          }`}
                      >
                        {inCart
                          ? <><Check size={16} /> Ver carrinho</>
                          : <><ShoppingCart size={16} /> Adicionar ao carrinho</>
                        }
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && fotosFiltradas.length === 0 && (
            <p className="text-gray-500 text-center py-20">Nenhuma foto nesta categoria.</p>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}
