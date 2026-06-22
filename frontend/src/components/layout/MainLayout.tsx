import type { ReactNode } from "react";

import Header from "./Header";
import Footer from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-20">{children}</main>
      <Footer />
    </div>
  );
}
