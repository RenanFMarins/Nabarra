import { MainLayout } from "@/components/layout/MainLayout";
import { NewsletterForm } from "@/features/newsletter/components/NewsletterForm";

export default function Home() {
  return (
    <MainLayout>
      <h1 className="text-5xl font-bold mb-8">Nabarra Films</h1>

      <NewsletterForm />
    </MainLayout>
  );
}
