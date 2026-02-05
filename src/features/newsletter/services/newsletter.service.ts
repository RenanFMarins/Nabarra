import { NewsletterPayload } from "../types/newsletter.types";

export async function subscribeNewsletter(data: NewsletterPayload) {
  console.log("Enviando email:", data);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true };
}
