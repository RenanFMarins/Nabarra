import { useState } from "react";
import { subscribeNewsletter } from "../services/newsletter.service";

export function useNewsletter() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function subscribe(email: string) {
    try {
      setLoading(true);
      await subscribeNewsletter({ email });
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  }

  return { subscribe, loading, success };
}
