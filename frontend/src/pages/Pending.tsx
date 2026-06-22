import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Clock } from "lucide-react";

export default function Pending() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

    // Pega o id da URL (vindo do back_url do MP) ou do localStorage (navegação direta)
    const paymentId = searchParams.get("id") || localStorage.getItem("payment_id");

    if (!paymentId) return;

    localStorage.setItem("payment_id", paymentId);

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${BASE_URL}/payment/${paymentId}`);
        const data = await res.json();

        if (data.approved) {
          window.location.href = `/success?id=${paymentId}`;
        }
      } catch (error) {
        console.error("Erro ao verificar pagamento:", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-8 px-6">
      <div className="relative">
        <Clock size={64} className="text-yellow-400" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 animate-ping" />
      </div>

      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Aguardando pagamento</h1>
        <p className="text-gray-400 max-w-sm">
          Estamos aguardando a confirmação do Mercado Pago. Você será redirecionado
          automaticamente assim que o pagamento for aprovado.
        </p>
      </div>

      <div className="flex gap-2 mt-2">
        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-bounce [animation-delay:300ms]" />
      </div>

      <Link
        to="/"
        className="mt-4 text-sm text-gray-500 hover:text-white transition underline underline-offset-4"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
