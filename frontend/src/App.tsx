import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/layout/Header";
import CartDrawer from "./components/ui/CartDrawer";
import Home from "./pages/Home";
import Fotos from "./pages/Photos";
import Pending from "./pages/Pending";
import Success from "./pages/Success";
import Admin from "./pages/Admin";

function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = hash.replace("#", "");

    // Pequeno delay para garantir que o DOM da página Home carregou
    const timeout = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 80);

    return () => clearTimeout(timeout);
  }, [hash, pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Header />
      <CartDrawer />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/photos" element={<Fotos />} />
        <Route path="/pending" element={<Pending />} />
        <Route path="/success" element={<Success />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
