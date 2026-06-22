import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Clock, Download, Loader2, XCircle } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

type Status = "loading" | "approved" | "pending" | "failed";

export default function Success() {
  const [status, setStatus] = useState<Status>("loading");
  const [photoIds, setPhotoIds] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const clearCart = useCartStore((s) => s.clearCart);

  const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

  // O MP envia esses parâmetros na URL de retorno
  const ref = searchParams.get("id");
  const mpPaymentId = searchParams.get("payment_id");
  const mpStatus = searchParams.get("status");

  useEffect(() => {
    if (!ref) { setStatus("failed"); return; }

    let cancelled = false;

    const check = async () => {
      // Se o MP já mandou status=approved na URL, consulta direto na API do MP
      // sem precisar esperar o webhook
      const endpoint = mpPaymentId
        ? `${BASE_URL}/verify-payment?ref=${ref}&payment_id=${mpPaymentId}`
        : `${BASE_URL}/payment/${ref}`;

      for (let i = 0; i < 20; i++) {
        if (cancelled) return;

        try {
          const res = await fetch(endpoint);
          const data = await res.json();

          if (data.approved) {
            const ids: string[] = data.photoIds ?? (data.photoId ? [String(data.photoId)] : []);
            setPhotoIds(ids);
            setStatus("approved");
            clearCart();
            return;
          }
        } catch { /* continua */ }

        await new Promise((r) => setTimeout(r, 2000));
      }

      if (!cancelled) setStatus("pending");
    };

    // Se o MP já informou que foi aprovado na URL, não precisa esperar tanto
    if (mpStatus === "approved") {
      check();
    } else {
      check();
    }

    return () => { cancelled = true; };
  }, [ref, mpPaymentId, mpStatus, BASE_URL, clearCart]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6 px-6">
        <Loader2 size={48} className="animate-spin text-[#D4AF37]" />
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Verificando pagamento...</h1>
          <p className="text-gray-400 text-sm">Confirmando com o Mercado Pago</p>
        </div>
      </div>
    );
  }

  if (status === "approved") {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-8 px-6">
        <CheckCircle size={64} className="text-green-400" />
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Pagamento aprovado!</h1>
          <p className="text-gray-400 mb-8 max-w-sm">
            {photoIds.length === 1
              ? "Sua foto está pronta para download em alta resolução."
              : `Suas ${photoIds.length} fotos estão prontas para download.`}
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          {photoIds.map((pid, idx) => (
            <a
              key={pid}
              href={`${BASE_URL}/secure-download/${pid}?payment_id=${ref}`}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white text-black font-semibold
                hover:bg-[#E0C55A] transition duration-200"
            >
              <Download size={18} />
              {photoIds.length > 1 ? `Baixar foto ${idx + 1}` : "Baixar foto"}
            </a>
          ))}

          <Link
            to="/photos"
            className="text-center px-6 py-4 rounded-xl bg-zinc-800 text-white font-semibold
              hover:bg-zinc-700 transition duration-200"
          >
            Ver mais fotos
          </Link>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-8 px-6">
        <Clock size={64} className="text-yellow-400" />
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-3">Pagamento em processamento</h1>
          <p className="text-gray-400 mb-2 max-w-sm">
            O Mercado Pago ainda está processando. Clique em verificar novamente em alguns instantes.
          </p>
          {ref && <p className="text-gray-600 text-xs font-mono mt-2">{ref}</p>}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setStatus("loading")}
            className="px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-[#E0C55A] transition"
          >
            Verificar novamente
          </button>
          <Link to="/" className="px-8 py-4 rounded-xl bg-zinc-800 text-white font-semibold hover:bg-zinc-700 transition text-center">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-8 px-6">
      <XCircle size={64} className="text-red-400" />
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-3">Algo deu errado</h1>
        <p className="text-gray-400 mb-8">Não foi possível verificar o pagamento.</p>
      </div>
      <Link to="/photos" className="px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-[#E0C55A] transition">
        Tentar novamente
      </Link>
    </div>
  );
}
