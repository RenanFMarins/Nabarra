import { useState, useEffect, useRef } from "react";
import { Trash2, Upload, Loader2, LogOut, Plus, Pencil, Check, X, ImagePlus } from "lucide-react";

interface Photo {
  id: number;
  title: string;
  price: number;
  category: string;
}

interface PendingFile {
  file: File;
  preview: string;
  title: string;
  price: string;
  category: string;
}

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
const CATEGORIES = ["ensaio", "evento", "rua", "geral"];

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token") || "");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Photo>>({});
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const headers = { "x-admin-key": token };

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("admin_token", data.token);
      setToken(data.token);
    } else {
      setLoginError(data.error || "Senha incorreta");
    }
  }

  function logout() {
    localStorage.removeItem("admin_token");
    setToken("");
  }

  async function fetchPhotos() {
    setLoading(true);
    const res = await fetch(`${BASE_URL}/photos`);
    setPhotos(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    if (token) fetchPhotos();
  }, [token]);

  function addFiles(files: FileList | File[]) {
    const arr = Array.from(files);
    arr.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const name = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
        setPending((prev) => [
          ...prev,
          { file, preview: e.target?.result as string, title: name, price: "", category: "ensaio" },
        ]);
      };
      reader.readAsDataURL(file);
    });
  }

  function updatePending(idx: number, field: keyof PendingFile, value: string) {
    setPending((prev) => prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));
  }

  function removePending(idx: number) {
    setPending((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleUploadAll(e: React.FormEvent) {
    e.preventDefault();
    if (pending.length === 0) return;
    setUploading(true);
    setUploadProgress(0);

    for (let i = 0; i < pending.length; i++) {
      const p = pending[i];
      const form = new FormData();
      form.append("file", p.file);
      form.append("title", p.title);
      form.append("price", p.price);
      form.append("category", p.category);

      await fetch(`${BASE_URL}/admin/photos`, { method: "POST", headers, body: form });
      setUploadProgress(i + 1);
    }

    await fetchPhotos();
    setPending([]);
    setUploading(false);
    setUploadProgress(0);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleDelete(id: number) {
    if (!confirm("Deletar esta foto?")) return;
    await fetch(`${BASE_URL}/admin/photos/${id}`, { method: "DELETE", headers });
    setPhotos((p) => p.filter((f) => f.id !== id));
  }

  async function handleEdit(id: number) {
    const res = await fetch(`${BASE_URL}/admin/photos/${id}`, {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ ...editData, price: Number(editData.price) }),
    });
    if (res.ok) {
      const updated = await res.json();
      setPhotos((p) => p.map((f) => (f.id === id ? updated : f)));
      setEditingId(null);
    }
  }

  // ── Login ────────────────────────────────────
  if (!token) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <form onSubmit={login} className="w-full max-w-sm bg-zinc-900 rounded-2xl p-8 border border-white/10">
          <h1 className="text-2xl font-bold text-white mb-2">Admin</h1>
          <p className="text-gray-400 text-sm mb-6">Nabarra Films</p>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white border border-white/10 mb-4 focus:outline-none focus:border-white/30"
          />
          {loginError && <p className="text-red-400 text-sm mb-3">{loginError}</p>}
          <button type="submit" className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-[#E0C55A] transition">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  // ── Painel ───────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white pt-8 pb-20 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold">Painel Admin</h1>
            <p className="text-gray-400 text-sm">Nabarra Films</p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm">
            <LogOut size={16} /> Sair
          </button>
        </div>

        {/* Upload em lote */}
        <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10 mb-10">
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <Plus size={18} /> Adicionar fotos
          </h2>

          {/* Drop zone */}
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
            className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-white/40 transition mb-6"
          >
            <ImagePlus size={36} className="mx-auto mb-2 text-gray-500" />
            <p className="text-gray-400 text-sm font-medium">Clique ou arraste as fotos aqui</p>
            <p className="text-gray-600 text-xs mt-1">Selecione quantas quiser de uma vez</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => { if (e.target.files) addFiles(e.target.files); }}
            />
          </div>

          {/* Lista de arquivos pendentes */}
          {pending.length > 0 && (
            <form onSubmit={handleUploadAll}>
              <div className="space-y-3 mb-5">
                {pending.map((p, i) => (
                  <div key={i} className="flex gap-3 items-center bg-zinc-800 rounded-xl p-3">
                    <img src={p.preview} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />

                    <div className="flex-1 grid sm:grid-cols-3 gap-2">
                      <input
                        value={p.title}
                        onChange={(e) => updatePending(i, "title", e.target.value)}
                        placeholder="Título"
                        required
                        className="px-3 py-2 rounded-lg bg-zinc-700 text-white text-sm border border-white/10 focus:outline-none focus:border-white/30"
                      />
                      <input
                        type="number"
                        value={p.price}
                        onChange={(e) => updatePending(i, "price", e.target.value)}
                        placeholder="Preço R$"
                        required
                        min="1"
                        step="0.01"
                        className="px-3 py-2 rounded-lg bg-zinc-700 text-white text-sm border border-white/10 focus:outline-none focus:border-white/30"
                      />
                      <select
                        value={p.category}
                        onChange={(e) => updatePending(i, "category", e.target.value)}
                        className="px-3 py-2 rounded-lg bg-zinc-700 text-white text-sm border border-white/10 focus:outline-none"
                      >
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => removePending(i)}
                      className="text-gray-500 hover:text-red-400 transition p-1 flex-shrink-0"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Barra de progresso durante upload */}
              {uploading && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Enviando fotos...</span>
                    <span>{uploadProgress}/{pending.length}</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#E0C55A] transition-all duration-300"
                      style={{ width: `${(uploadProgress / pending.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-[#E0C55A] transition disabled:opacity-50"
                >
                  {uploading
                    ? <><Loader2 size={16} className="animate-spin" /> Enviando {uploadProgress}/{pending.length}...</>
                    : <><Upload size={16} /> Publicar {pending.length} {pending.length === 1 ? "foto" : "fotos"}</>
                  }
                </button>
                <button
                  type="button"
                  onClick={() => setPending([])}
                  disabled={uploading}
                  className="text-sm text-gray-500 hover:text-white transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Lista de fotos publicadas */}
        <h2 className="text-lg font-semibold mb-5">Fotos publicadas ({photos.length})</h2>

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 size={32} className="animate-spin text-gray-500" /></div>
        ) : (
          <div className="space-y-3">
            {photos.map((foto) => (
              <div key={foto.id} className="flex items-center gap-4 bg-zinc-900 rounded-xl p-4 border border-white/5">
                <img src={`${BASE_URL}/preview/${foto.id}`} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />

                {editingId === foto.id ? (
                  <div className="flex-1 grid sm:grid-cols-3 gap-3">
                    <input
                      value={editData.title ?? foto.title}
                      onChange={(e) => setEditData((d) => ({ ...d, title: e.target.value }))}
                      className="px-3 py-2 rounded-lg bg-zinc-800 text-white text-sm border border-white/10 focus:outline-none"
                    />
                    <input
                      type="number"
                      value={editData.price ?? foto.price}
                      onChange={(e) => setEditData((d) => ({ ...d, price: Number(e.target.value) }))}
                      className="px-3 py-2 rounded-lg bg-zinc-800 text-white text-sm border border-white/10 focus:outline-none"
                    />
                    <select
                      value={editData.category ?? foto.category}
                      onChange={(e) => setEditData((d) => ({ ...d, category: e.target.value }))}
                      className="px-3 py-2 rounded-lg bg-zinc-800 text-white text-sm border border-white/10 focus:outline-none"
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                ) : (
                  <div className="flex-1">
                    <p className="font-medium">{foto.title}</p>
                    <p className="text-sm text-gray-400 capitalize">
                      {foto.category} · R$ {foto.price.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 flex-shrink-0">
                  {editingId === foto.id ? (
                    <>
                      <button onClick={() => handleEdit(foto.id)} className="p-2 rounded-lg bg-green-600 hover:bg-green-500 transition"><Check size={16} /></button>
                      <button onClick={() => setEditingId(null)} className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition"><X size={16} /></button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { setEditingId(foto.id); setEditData({ title: foto.title, price: foto.price, category: foto.category }); }}
                        className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition"
                      >
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(foto.id)} className="p-2 rounded-lg bg-zinc-700 hover:bg-red-600 transition">
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
