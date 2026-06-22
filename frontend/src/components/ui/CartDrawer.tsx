import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
  const total = items.reduce((sum, i) => sum + i.price, 0);

  async function handleCheckout() {
    if (items.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/create-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            title: i.title,
            price: i.price,
            photoId: i.id,
          })),
        }),
      });

      if (!res.ok) throw new Error("Falha ao criar pagamento");

      const data = await res.json();
      localStorage.setItem("payment_id", data.ref);
      window.location.href = data.url;
    } catch {
      setError("Erro ao iniciar pagamento. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-zinc-950 border-l border-white/10 z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-2 text-white font-semibold text-lg">
                <ShoppingBag size={20} />
                Carrinho
                {items.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-white text-black text-xs font-bold">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="text-gray-400 hover:text-white transition p-1"
              >
                <X size={22} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="text-sm">Seu carrinho está vazio</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 items-center bg-zinc-900 rounded-xl p-3"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {item.title}
                      </p>
                      <p className="text-[#D4AF37] font-bold mt-0.5">
                        R$ {item.price.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-500 hover:text-red-400 transition flex-shrink-0 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-white/10 space-y-4">
                <div className="flex justify-between text-white">
                  <span className="text-gray-400">Total</span>
                  <span className="font-bold text-xl">
                    R$ {total.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                {error && (
                  <p className="text-red-400 text-xs">{error}</p>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-white text-black font-semibold
                    hover:bg-[#E0C55A] transition duration-200
                    disabled:opacity-60 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Aguarde...
                    </>
                  ) : (
                    `Finalizar compra · ${items.length} ${items.length === 1 ? "foto" : "fotos"}`
                  )}
                </button>

                <button
                  onClick={clearCart}
                  className="w-full text-xs text-gray-500 hover:text-white transition underline underline-offset-4"
                >
                  Limpar carrinho
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
