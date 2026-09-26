import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { modelRouter } from './src/server/ai/ModelRouter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function sanitizeSecret(text: string): string {
  if (!text) return '';
  return text
    .replace(/Bearer\s+[A-Za-z0-9_\-\.]+/gi, 'Bearer [REDACTED]')
    .replace(/sk-[A-Za-z0-9_\-\.]+/gi, '[REDACTED]')
    .replace(/key=[A-Za-z0-9_\-\.]+/gi, 'key=[REDACTED]');
}

// Business Persona & Instruction (Generic Business Profile Layer)
const SYASA_SYSTEM_INSTRUCTION = `Anda adalah SYASA (Syamanah Sales Assistant), AI Sales & Customer Service Assistant untuk CV. Generasi Sugih Sejahtera (Syamanah Garment), produsen konveksi & garment terpercaya di Bandung, Indonesia.

VISI & PERAN UTAMA:
Peran Anda adalah: Menerima → Memahami → Memberikan Informasi Produk & Bahan → Mengedukasi → Melakukan Kualifikasi (Lead Qualification) → Merapikan Data Lead → Meneruskan kepada Human Sales yang tepat (Handover).

Bukan pengganti Sales/CS. Tugas Sales/CS manusia adalah:
- Menghitung harga detail & quotation resmi
- Memberikan surat penawaran
- Negosiasi harga & termin
- Closing penjualan

5 PILAR KUALIFIKASI YANG HARUS DIGALI SECARA NATURAL:
1. Produk: Apa jenis pakaian yang ingin dipesan (Jersey Custom Sublim, Jaket Varsity/Bomber/Coach/Hoodie, Kemeja PDH/PDL/Korsa, Kaos Combed, Polo Shirt Lacoste, Rompi Safety/Tactical)?
2. Quantity (Jumlah): Berapa pcs rencana pemesanan (MOQ: Jersey 12 pcs, Kemeja 18 pcs, Jaket 24 pcs, Kaos 24 pcs, Rompi 20 pcs)?
3. Desain: Apakah sudah ada file desain/sketsa (Corel/AI/PDF/Foto) atau minta dibantu dibuatkan tim desainer Syamanah (Free mockup untuk pesanan di atas MOQ)?
4. Bahan/Kain: Pilihan kain (e.g. Dryfit Milano/Serena/Brazil untuk jersey; American/Japan Drill Nagata untuk seragam; Taslan/Fleece untuk jaket; Cotton Combed 24s/30s untuk kaos)?
5. Spesifikasi Tambahan: Model kerah, lengan panjang/pendek, titik bordir/sablon, nama/nomor, atau deadline acara?

BATASAN KETAT HANDOVER (SANGAT PENTING):
- Jika customer bertanya tentang HARGA, BIAYA, DISKON, PRICELIST LENGKAP, QUOTATION, ESTIMASI TOTAL, atau meminta berbicara dengan Sales/CS manusia:
  1. JANGAN memberikan angka harga final yang mengikat atau membuat kesepakatan harga sepihak.
  2. Jawab dengan ramah dan edukatif bahwa Anda telah merapikan data kebutuhan mereka, dan untuk perhitungan diskon kuantiti harga terbaik serta penerbitan invoice/quotation resmi, Anda akan segera menyambungkannya dengan Sales Specialist yang bertugas.
  3. Set 'handoverTriggered' = true dan berikan 'handoverReason' yang jelas.

GAYA KOMUNIKASI:
- Bahasa Indonesia yang ramah, sopan, bersahabat ("Halo kak!", "Kak Budi", "Terima kasih telah menghubungi Syamanah Garment").
- Solutif, edukatif tentang keunggulan bahan tanpa membingungkan customer.
- Jangan gunakan jargon teknis yang berlebihan tanpa penjelasan.`;

// ==========================================
// AI MODEL ROUTER & CONFIGURATION ENDPOINTS
// ==========================================

// Get current AI router configuration summary (with masked keys)
app.get('/api/ai/config', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const summary = modelRouter.getConfigSummary();
    return res.json({ success: true, data: summary });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: sanitizeSecret(error.message) });
  }
});

// Update specific provider configuration (model, enabled, optional new key)
app.post('/api/ai/config', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { id, apiKey, model, enabled } = req.body || {};
    if (!id) {
      return res.status(400).json({ success: false, error: 'Provider id wajib disertakan.' });
    }

    const result = modelRouter.updateProvider(id, { apiKey, model, enabled });
    const summary = modelRouter.getConfigSummary();
    return res.json({ success: true, message: result.message, data: summary });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: sanitizeSecret(error.message) });
  }
});

// Set active AI model provider
app.post('/api/ai/active', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { activeProviderId } = req.body || {};
    if (!activeProviderId) {
      return res.status(400).json({ success: false, error: 'activeProviderId wajib disertakan.' });
    }

    const result = modelRouter.setActiveProvider(activeProviderId);
    const summary = modelRouter.getConfigSummary();
    return res.json({ success: true, message: result.message, data: summary });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: sanitizeSecret(error.message) });
  }
});

// Test connection to selected AI provider
app.post('/api/ai/test-connection', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { providerId } = req.body || {};
    if (!providerId) {
      return res.status(400).json({ success: false, message: 'providerId wajib disertakan.' });
    }

    const result = await modelRouter.testProviderConnection(providerId);
    return res.json(result);
  } catch (error: any) {
    const cleanMsg = (error?.message || 'Internal connection error')
      .replace(/Bearer\s+[A-Za-z0-9_\-\.]+/gi, 'Bearer [REDACTED]')
      .replace(/sk-[A-Za-z0-9_\-\.]+/gi, '[REDACTED]')
      .replace(/key=[A-Za-z0-9_\-\.]+/gi, 'key=[REDACTED]');
    return res.status(200).json({ success: false, message: `✕ Connection failed: ${cleanMsg}` });
  }
});

// ==========================================
// AGENTIC CHAT & QUALIFICATION ENDPOINT
// ==========================================

app.post('/api/chat', async (req, res) => {
  try {
    const {
      message,
      conversationHistory = [],
      customerName = 'Customer',
      currentQualification = {},
    } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Pesan (message) wajib diisi.' });
    }

    const activeProvider = modelRouter.getActiveProvider();

    // Check if the active provider is configured and enabled
    if (activeProvider.isConfigured() && activeProvider.isEnabled()) {
      const historyContext = conversationHistory
        .map((m: any) => `${m.senderName || m.sender}: ${m.text}`)
        .slice(-8)
        .join('\n');

      const prompt = `Riwayat percakapan terkini:
${historyContext}
Customer (${customerName}): ${message}

Status kualifikasi saat ini:
- Produk: ${currentQualification.product || 'Belum terisi'}
- Quantity: ${currentQualification.quantity || 'Belum terisi'}
- Desain: ${currentQualification.designStatus || 'Belum terisi'}
- Bahan: ${currentQualification.fabric || 'Belum terisi'}
- Spesifikasi: ${currentQualification.specs || 'Belum terisi'}

Tugas Anda:
1. Berikan balasan ramah dalam bahasa Indonesia sesuai SOP SYASA.
2. Ekstrak data kualifikasi terbaru dari percakapan.
3. Deteksi apakah perlu Handover ke Sales manusia (misal customer minta harga/diskon/penawaran/kontak sales).
4. Tentukan kategori Sales yang direkomendasikan ('Jersey' | 'Jaket' | 'Kemeja_PDH' | 'Kaos_Polo' | 'Rompi' | 'All_Rounder').
5. Buat ringkasan singkat 1-2 kalimat untuk Sales (aiSummary).

Format JSON yang wajib dihasilkan:
{
  "reply": "string teks balasan",
  "product": "string nama produk atau belum terisi",
  "quantity": "string jumlah pcs",
  "designStatus": "string status mockup desain",
  "fabric": "string jenis bahan kain",
  "specs": "string spesifikasi detail kerah/lengan/bordir",
  "handoverTriggered": boolean,
  "handoverReason": "string alasan jika true",
  "suggestedSalesCategory": "Jersey | Jaket | Kemeja_PDH | Kaos_Polo | Rompi | All_Rounder",
  "aiSummary": "string resume untuk sales",
  "qualificationScore": number antara 0 sampai 100
}`;

      try {
        const parsed = await modelRouter.structuredOutput({
          prompt,
          systemInstruction: SYASA_SYSTEM_INSTRUCTION,
        });

        return res.json({
          success: true,
          data: parsed,
          meta: {
            activeProvider: activeProvider.name,
            model: activeProvider.getModel(),
          },
        });
      } catch (err: any) {
        console.warn(`[API] Structured output via ModelRouter failed: ${err.message}. Engaging rule-based fallback.`);
      }
    }

    // Fallback engine if active AI provider fails or is not yet configured
    const lower = message.toLowerCase();
    let product = currentQualification.product || '';
    let quantity = currentQualification.quantity || '';
    let designStatus = currentQualification.designStatus || '';
    let fabric = currentQualification.fabric || '';
    let specs = currentQualification.specs || '';
    let handoverTriggered = false;
    let handoverReason = '';
    let suggestedSalesCategory = 'All_Rounder';
    let reply = '';

    if (lower.includes('jersey') || lower.includes('futsal') || lower.includes('bola')) {
      product = 'Jersey Custom Sublimasi';
      suggestedSalesCategory = 'Jersey';
    } else if (lower.includes('jaket') || lower.includes('varsity') || lower.includes('bomber') || lower.includes('coach')) {
      product = 'Jaket Custom (Varsity/Bomber/Coach)';
      suggestedSalesCategory = 'Jaket';
    } else if (lower.includes('kemeja') || lower.includes('pdh') || lower.includes('pdl') || lower.includes('seragam')) {
      product = 'Kemeja PDH / Seragam Kantor';
      suggestedSalesCategory = 'Kemeja_PDH';
    } else if (lower.includes('kaos') || lower.includes('polo') || lower.includes('tshirt')) {
      product = 'Kaos Combed / Polo Shirt';
      suggestedSalesCategory = 'Kaos_Polo';
    } else if (lower.includes('rompi') || lower.includes('safety')) {
      product = 'Rompi Safety K3 / Tactical';
      suggestedSalesCategory = 'Rompi';
    }

    // Number extraction for quantity
    const qtyMatch = message.match(/(\d+)\s*(pcs|buah|potong|lembar|orang)?/i);
    if (qtyMatch) {
      quantity = `${qtyMatch[1]} pcs`;
    }

    // Design check
    if (lower.includes('corel') || lower.includes('ai') || lower.includes('vektor') || lower.includes('ada desain') || lower.includes('sudah ada')) {
      designStatus = 'Sudah ada file desain/sketsa';
    } else if (lower.includes('belum ada') || lower.includes('bikinin') || lower.includes('bantu desain')) {
      designStatus = 'Minta dibantu dibuatkan desain oleh Syamanah';
    }

    // Fabric check
    if (lower.includes('milano')) fabric = 'Dryfit Milano 180gsm';
    else if (lower.includes('serena')) fabric = 'Dryfit Serena Glossy';
    else if (lower.includes('brazil')) fabric = 'Dryfit Brazil Waffle';
    else if (lower.includes('drill')) fabric = 'American Drill 1919';
    else if (lower.includes('nagata')) fabric = 'Japan Drill Nagata';
    else if (lower.includes('taslan')) fabric = 'Taslan Milky Water Repellent';
    else if (lower.includes('fleece')) fabric = 'Cotton Fleece 300gsm';
    else if (lower.includes('combed')) fabric = 'Cotton Combed 24s/30s';

    // Handover triggers: price, quotation, discount, negotiation
    if (
      lower.includes('harga') ||
      lower.includes('biaya') ||
      lower.includes('berapa') ||
      lower.includes('diskon') ||
      lower.includes('quotation') ||
      lower.includes('penawaran') ||
      lower.includes('nego') ||
      lower.includes('pricelist') ||
      lower.includes('sales')
    ) {
      handoverTriggered = true;
      handoverReason = 'Customer menanyakan kalkulasi harga resmi dan penawaran diskon.';
      reply = `Halo Kak ${customerName}! Terima kasih informasinya. Detail kebutuhan ${product || 'pesanan'} Anda (${quantity || 'rencana kuantiti'} pcs) sudah kami catat dengan rapi. Untuk perhitungan diskon harga terbaik, estimasi jadwal produksi kilat, serta pembuatan surat penawaran (quotation) resmi, saya langsung sambungkan dengan Sales Specialist ${suggestedSalesCategory} kami ya kak!`;
    } else if (!product) {
      reply = `Halo Kak ${customerName}! Selamat datang di Syamanah Garment (CV. Generasi Sugih Sejahtera). Kami memproduksi berbagai apparel berkualitas seperti Jersey Custom Sublimasi, Jaket (Varsity/Bomber/Coach), Kemeja PDH Seragam Kantor, Kaos Distro, dan Rompi. Boleh tahu produk apa yang sedang kakak butuhkan saat ini?`;
    } else if (!quantity) {
      reply = `Pilihan yang tepat kak! Untuk ${product}, minimal pemesanan di Syamanah sangat fleksibel (mulai 12-24 pcs) dan ukuran bisa bebas campur. Rencananya kakak ingin membuat sekitar berapa pcs?`;
    } else if (!fabric) {
      reply = `Siap kak, untuk ${quantity} ${product}. Apakah kakak sudah ada preferensi jenis bahan kain yang diinginkan, atau mau kami berikan rekomendasi bahan terbaik yang paling adem dan awet?`;
    } else {
      reply = `Mantap Kak ${customerName}! Data kebutuhan ${product} sebanyak ${quantity} dengan bahan ${fabric} sudah kami pahami. Apakah ada file desain yang sudah siap, atau butuh bantuan tim desainer Syamanah untuk pembuatan mockup 2D/3D gratisnya?`;
    }

    // Calculate score
    let score = 0;
    if (product) score += 20;
    if (quantity) score += 20;
    if (designStatus) score += 20;
    if (fabric) score += 20;
    if (specs) score += 20;

    return res.json({
      success: true,
      data: {
        reply,
        product: product || 'Belum terisi',
        quantity: quantity || 'Belum terisi',
        designStatus: designStatus || 'Belum terisi',
        fabric: fabric || 'Belum terisi',
        specs: specs || (lower.includes('lengan') || lower.includes('kerah') ? message : 'Standard'),
        handoverTriggered,
        handoverReason,
        suggestedSalesCategory,
        aiSummary: `Customer butuh ${product || 'produk garment'} ${quantity || ''}. Status kualifikasi: ${score}% terisi. ${handoverTriggered ? 'Menunggu tanggapan sales untuk quotation.' : 'Sedang dalam edukasi spek.'}`,
        qualificationScore: score,
      },
      meta: {
        activeProvider: activeProvider.name,
        isRuleFallback: true,
      },
    });
  } catch (error: any) {
    console.error('SYASA Chat API Error:', error);
    res.status(500).json({
      error: 'Terjadi kendala pada pemrosesan AI SYASA.',
      details: error.message,
    });
  }
});

// Endpoint: AI Knowledge Search / QA (Routed via ModelRouter)
app.post('/api/knowledge/ask', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query wajib diisi.' });

    const activeProvider = modelRouter.getActiveProvider();
    if (activeProvider.isConfigured() && activeProvider.isEnabled()) {
      const result = await modelRouter.generate({
        prompt: `Jawab pertanyaan seputar Syamanah Garment: "${query}" secara ringkas, akurat, dan profesional berdasarkan knowledge konveksi Syamanah Garment (Bandung).`,
        systemInstruction: SYASA_SYSTEM_INSTRUCTION,
      });
      return res.json({ answer: result.text, provider: result.providerId, model: result.model });
    }

    return res.json({
      answer: 'Syamanah Garment menyediakan garansi 100% cacat pabrik, MOQ fleksibel mulai 12 pcs, dan teknologi cetak sublimasi Epson HD original.',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  const summary = modelRouter.getConfigSummary();
  res.json({
    status: 'ok',
    service: 'SYASA AI Sales Assistant Engine',
    activeProvider: summary.activeProviderId,
    providersCount: summary.providers.length,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler for API routes to guarantee JSON response and prevent HTML fallthrough
app.all('/api/*', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({ success: false, error: 'API route not found' });
});

// Vite or Static file serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`SYASA Server is active on port ${PORT}`);
  });
}

setupServer();
