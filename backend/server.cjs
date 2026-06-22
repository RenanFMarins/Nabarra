require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { MercadoPagoConfig, Preference } = require("mercadopago");

// ── Fotos (catálogo) ──────────────────────────────────────
const PHOTOS_FILE = path.join(__dirname, "photos.json");
const UPLOAD_TMP = path.join(__dirname, "tmp");
if (!fs.existsSync(UPLOAD_TMP)) fs.mkdirSync(UPLOAD_TMP);

function loadPhotos() {
  try {
    if (fs.existsSync(PHOTOS_FILE)) return JSON.parse(fs.readFileSync(PHOTOS_FILE, "utf8"));
  } catch {}
  return [];
}
function savePhotos(data) {
  fs.writeFileSync(PHOTOS_FILE, JSON.stringify(data, null, 2));
}

const upload = multer({ dest: UPLOAD_TMP });

function adminAuth(req, res, next) {
  const key = req.headers["x-admin-key"];
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Não autorizado" });
  }
  next();
}

const PAYMENTS_FILE = path.join(__dirname, "payments.json");

function loadPayments() {
  try {
    if (fs.existsSync(PAYMENTS_FILE)) {
      return JSON.parse(fs.readFileSync(PAYMENTS_FILE, "utf8"));
    }
  } catch (e) {
    console.error("Erro ao carregar pagamentos salvos:", e.message);
  }
  return {};
}

function savePayments(data) {
  try {
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Erro ao persistir pagamentos:", e.message);
  }
}

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const API_URL = process.env.API_URL || `http://localhost:${PORT}`;
const NOTIFICATION_URL = process.env.NOTIFICATION_URL || `${API_URL}/webhook`;

app.use(
  cors({
    origin: [FRONTEND_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json());

const IMAGE_DIR = path.join(__dirname, "public", "images", "fotografia");

function resolvePhotoPath(photoId) {
  const candidates = [`${photoId}.png`, `${photoId}.jpeg`, `${photoId}.jpg`];

  return candidates
    .map((fileName) => path.join(IMAGE_DIR, fileName))
    .find((filePath) => fs.existsSync(filePath));
}

// 🔑 MERCADO PAGO
const accessToken = process.env.ACCESS_TOKEN || "";

if (!accessToken) {
  console.warn("⚠️ ACCESS_TOKEN não configurado. O pagamento via Mercado Pago não funcionará até definir a variável de ambiente.");
}

const client = new MercadoPagoConfig({
  accessToken,
});

const pagamentos = loadPayments();

// =============================
// 🚀 CRIAR PAGAMENTO
// =============================
app.post("/create-payment", async (req, res) => {
  try {
    // Aceita array de itens (carrinho) ou item único (legado)
    const rawItems = req.body.items ?? [
      { title: req.body.title, price: req.body.price, photoId: req.body.photoId },
    ];

    const uniqueId = Date.now().toString();
    const photoIds = rawItems.map((i) => String(i.photoId));

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: rawItems.map((i) => ({
          title: i.title,
          unit_price: Number(i.price),
          quantity: 1,
        })),

        external_reference: `${uniqueId}|${photoIds.join(",")}`,

        back_urls: {
          success: `${FRONTEND_URL}/success?id=${uniqueId}`,
          failure: `${FRONTEND_URL}/pending?id=${uniqueId}`,
          pending: `${FRONTEND_URL}/pending?id=${uniqueId}`,
        },

        notification_url: NOTIFICATION_URL,
      },
    });

    pagamentos[uniqueId] = {
      approved: false,
      photoIds,
    };
    savePayments(pagamentos);

    res.json({
      url: response.init_point,
      ref: uniqueId,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// =============================
// 🔔 WEBHOOK
// =============================
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.type === "payment") {
      const paymentId = body.data.id;

      const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          },
        }
      );

      const payment = await response.json();

      if (payment.status === "approved") {
        const [ref, photoIdsStr] = payment.external_reference.split("|");
        const photoIds = photoIdsStr ? photoIdsStr.split(",") : [];

        pagamentos[ref] = {
          approved: true,
          photoIds,
        };
        savePayments(pagamentos);

        console.log("✅ PAGAMENTO APROVADO:", ref);
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// =============================
// ✅ VERIFICAR PAGAMENTO (consulta o MP diretamente)
// Usado pela página /success — não depende do webhook ter chegado
// =============================
app.get("/verify-payment", async (req, res) => {
  const { payment_id, ref } = req.query;

  // Se já temos aprovado localmente, retorna imediatamente
  if (ref && pagamentos[ref]?.approved) {
    return res.json({ approved: true, photoIds: pagamentos[ref].photoIds });
  }

  if (!payment_id) {
    return res.json({ approved: false });
  }

  try {
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${payment_id}`,
      { headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` } }
    );

    const payment = await response.json();

    if (payment.status === "approved" && payment.external_reference) {
      const [payRef, photoIdsStr] = payment.external_reference.split("|");
      const photoIds = photoIdsStr ? photoIdsStr.split(",") : [];

      pagamentos[payRef] = { approved: true, photoIds };
      savePayments(pagamentos);

      return res.json({ approved: true, photoIds });
    }

    return res.json({ approved: false });
  } catch (err) {
    console.error("Erro ao verificar pagamento no MP:", err.message);
    return res.json({ approved: false });
  }
});

// =============================
// 🧪 HEALTH CHECK
// =============================
app.get("/health", (_req, res) => {
  res.json({ status: "ok", port: PORT, frontendUrl: FRONTEND_URL, apiUrl: API_URL });
});

// =============================
// 📋 CATÁLOGO PÚBLICO
// =============================
app.get("/photos", (_req, res) => {
  res.json(loadPhotos());
});

// =============================
// 🔐 ADMIN — LOGIN
// =============================
app.post("/admin/login", (req, res) => {
  if (req.body.password === process.env.ADMIN_KEY) {
    res.json({ token: process.env.ADMIN_KEY });
  } else {
    res.status(401).json({ error: "Senha incorreta" });
  }
});

// =============================
// 🔐 ADMIN — UPLOAD FOTO
// =============================
app.post("/admin/photos", adminAuth, upload.single("file"), (req, res) => {
  try {
    const photos = loadPhotos();
    const newId = photos.length > 0 ? Math.max(...photos.map((p) => p.id)) + 1 : 1;
    const ext = path.extname(req.file.originalname).toLowerCase() || ".jpg";
    const dest = path.join(IMAGE_DIR, `${newId}${ext}`);

    fs.renameSync(req.file.path, dest);

    const newPhoto = {
      id: newId,
      title: req.body.title || `Foto ${newId}`,
      price: Number(req.body.price) || 0,
      category: req.body.category || "geral",
    };

    photos.push(newPhoto);
    savePhotos(photos);
    res.json(newPhoto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// 🔐 ADMIN — EDITAR FOTO
// =============================
app.patch("/admin/photos/:id", adminAuth, (req, res) => {
  const id = Number(req.params.id);
  const photos = loadPhotos();
  const idx = photos.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ error: "Foto não encontrada" });

  photos[idx] = { ...photos[idx], ...req.body };
  savePhotos(photos);
  res.json(photos[idx]);
});

// =============================
// 🔐 ADMIN — DELETAR FOTO
// =============================
app.delete("/admin/photos/:id", adminAuth, (req, res) => {
  const id = Number(req.params.id);
  const photos = loadPhotos().filter((p) => p.id !== id);
  savePhotos(photos);

  const filePath = resolvePhotoPath(id);
  if (filePath) {
    try { fs.unlinkSync(filePath); } catch {}
  }

  res.json({ ok: true });
});

// =============================
// 🖼️ PREVIEW DA FOTO
// =============================
app.get("/preview/:photoId", (req, res) => {
  const { photoId } = req.params;
  const filePath = resolvePhotoPath(photoId);

  if (!filePath) {
    return res.status(404).json({ error: "Preview não encontrado" });
  }

  return res.sendFile(filePath);
});

// =============================
// 🔍 CONSULTAR PAGAMENTO
// =============================
app.get("/payment/:id", (req, res) => {
  const data = pagamentos[req.params.id];

  if (!data) {
    return res.json({ approved: false });
  }

  res.json(data);
});

// =============================
// 🔐 DOWNLOAD SEGURO
// =============================
app.get("/secure-download/:photoId", (req, res) => {
  const { photoId } = req.params;
  const paymentId = req.query.payment_id;

  if (!paymentId) {
    return res.status(400).json({ error: "Pagamento não informado" });
  }

  const pagamento = pagamentos[paymentId];

  if (!pagamento) {
    return res.status(404).json({ error: "Pagamento não encontrado" });
  }

  if (!pagamento.approved) {
    return res.status(403).json({ error: "Pagamento não aprovado" });
  }

  const ids = pagamento.photoIds ?? (pagamento.photoId ? [String(pagamento.photoId)] : []);
  if (!ids.includes(String(photoId))) {
    return res.status(403).json({ error: "Foto inválida para este pagamento" });
  }

  const filePath = resolvePhotoPath(photoId);

  if (!filePath) {
    return res.status(404).json({ error: "Arquivo não encontrado" });
  }

  return res.download(filePath);
});

// =============================
app.listen(PORT, () => {
  console.log(`🚀 API rodando em ${API_URL}`);
  console.log(`🌐 Frontend esperado em ${FRONTEND_URL}`);
});