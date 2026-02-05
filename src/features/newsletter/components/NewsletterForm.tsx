import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useNewsletter } from "../hooks/useNewsletter";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const { subscribe, loading, success } = useNewsletter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    subscribe(email);
  }

  if (success) {
    return <p className="text-green-400">Inscrito com sucesso!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <Input
        placeholder="Seu melhor email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button disabled={loading}>
        {loading ? "Enviando..." : "Inscrever"}
      </Button>
    </form>
  );
}
