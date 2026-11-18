import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import {
  type KnowledgeEntry,
  VERIFIED_KNOWLEDGE_BASE,
  WHATSAPP_NUMBER_DISPLAY,
  UNKNOWN_FALLBACK_REPLY,
  buildWhatsappSupportUrl,
  formatKnowledgeBaseForPrompt,
  matchVerifiedStarterReply,
} from './src/data/knowledgeBase';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.join(__dirname, 'data');
const STORE_PATH = path.join(DATA_DIR, 'chatbot-store.json');

interface ChatLogEntry {
  id: string;
  sessionId: string;
  userQuestion: string;
  botReply: string;
  status: 'ANSWERED' | 'UNKNOWN';
  matchedCategories: string[];
  createdAt: string;
}

interface UserInquiryEntry {
  id: string;
  name: string;
  phone: string;
  message: string;
  sourceQuestion?: string;
  status: 'new' | 'reviewed';
  createdAt: string;
}

interface ChatbotStore {
  knowledgeBase: KnowledgeEntry[];
  chatLogs: ChatLogEntry[];
  inquiries: UserInquiryEntry[];
}

const DEFAULT_KNOWLEDGE_BASE: KnowledgeEntry[] = VERIFIED_KNOWLEDGE_BASE;

function ensureStoreFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    const initial: ChatbotStore = {
      knowledgeBase: DEFAULT_KNOWLEDGE_BASE,
      chatLogs: [],
      inquiries: [],
    };
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), 'utf8');
  }
}

function readStore(): ChatbotStore {
  ensureStoreFile();
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<ChatbotStore>;
    return {
      knowledgeBase: Array.isArray(parsed.knowledgeBase)
        ? parsed.knowledgeBase
        : DEFAULT_KNOWLEDGE_BASE,
      chatLogs: Array.isArray(parsed.chatLogs) ? parsed.chatLogs : [],
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
    };
  } catch {
    return {
      knowledgeBase: DEFAULT_KNOWLEDGE_BASE,
      chatLogs: [],
      inquiries: [],
    };
  }
}

function writeStore(store: ChatbotStore): void {
  ensureStoreFile();
  const tempPath = `${STORE_PATH}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(store, null, 2), 'utf8');
  fs.renameSync(tempPath, STORE_PATH);
}

function createGeminiClient(): GoogleGenAI | null {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

interface GeminiStructuredReply {
  status: 'ANSWERED' | 'UNKNOWN';
  reply: string;
  matchedCategories: string[];
}

async function generateGroundedReply(
  userQuestion: string,
  history: Array<{ role: 'user' | 'assistant'; text: string }>,
  store: ChatbotStore
): Promise<GeminiStructuredReply> {
  const ai = createGeminiClient();
  if (!ai) {
    throw new Error('GEMINI_API_KEY_MISSING');
  }

  const kbText = formatKnowledgeBaseForPrompt(store.knowledgeBase);

  const systemInstruction = `Sən "FLASHLY FLEET KÖMƏKÇİSİ"sən — Azərbaycanda Wolt kuryer partnyoru olan FLASHLY FLEET şirkətinin rəsmi süni intellekt köməkçisi.

MÜTLƏQ QAYDALAR:
1. Bütün cavabların yalnız düzgün, səlis və peşəkar Azərbaycan dilində olsun.
2. YALNIZ aşağıdakı [TƏSDİQLƏNMİŞ MƏLUMAT BAZASI] hissəsində olan məlumatlara əsaslanaraq cavab ver.
3. Məlumat bazasında olmayan heç bir faktı, rəqəmi, qanunu, şərti, bonus məbləğini, Wolt-un daxili qaydasını və ya vədi özündən uydurma və ya təxmin etmə.
4. Əgər istifadəçinin sualına təsdiqlənmiş məlumat bazasından 100% dəqiq cavab çıxmırsa və ya azacıq belə əmin deyilsənsə:
   - status dəyərini "UNKNOWN" təyin et
   - reply dəyərini EYNİLƏ bu cümlə yaz: "${UNKNOWN_FALLBACK_REPLY}"
5. İstifadəçilərin şəxsi məlumatlarını, şəxsiyyət vəsiqəsi nömrələrini, selfilərini, telefon nömrələrini və ya fərdi qeydiyyat sənədlərini heç vaxt açıqlama, tələb etmə və ya soruşma. Fərdi müraciət statusu soruşulduqda bazadakı "Müraciətlərin vəziyyəti" qaydasına uyğun olaraq əməkdaşlarla (+994 99 800 75 65 WhatsApp və ya +994 60 446 64 04) əlaqə saxlamağı bildir.
6. Cavab verə bildiyin suallarda (status: "ANSWERED") cavabı aydın, nəzakətli və qısa-konkret şəkildə yaz. Salamlaşma və ya nəzakətli yekun istisna olmaqla, kənar məlumat əlavə etmə.

[TƏSDİQLƏNMİŞ MƏLUMAT BAZASI]
${kbText}`;

  const recentHistoryText =
    history.length > 0
      ? `Əvvəlki qısa dialoq konteksti:\n${history
          .slice(-6)
          .map((m) => `${m.role === 'user' ? 'İstifadəçi' : 'Köməkçi'}: ${m.text}`)
          .join('\n')}\n\n`
      : '';

  const promptContent = `${recentHistoryText}İstifadəçinin yeni sualı: ${userQuestion}`;

  const response = await ai.models.generateContent({
    model: 'gemini-4-hydrogen',
    contents: promptContent,
    config: {
      systemInstruction,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status: {
            type: Type.STRING,
            description:
              'ANSWERED yalnız cavab təsdiqlənmiş məlumat bazasında tam varsa; UNKNOWN əks halda və ya əmin olmadıqda.',
          },
          reply: {
            type: Type.STRING,
            description:
              'Azərbaycan dilində cavab mətni. status UNKNOWN olduqda dəqiq fallback cümləsi.',
          },
          matchedCategories: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'İstifadə olunan kateqoriyaların siyahısı.',
          },
        },
        required: ['status', 'reply', 'matchedCategories'],
      },
    },
  });

  const rawText = (response.text || '').trim();
  const parsed = JSON.parse(rawText) as Partial<GeminiStructuredReply>;

  const normalizedStatus: 'ANSWERED' | 'UNKNOWN' =
    parsed.status === 'ANSWERED' ? 'ANSWERED' : 'UNKNOWN';

  const cleanReply = (parsed.reply || '').trim();
  const containsFallbackPhrase = cleanReply
    .toLowerCase()
    .includes('təsdiqlənmiş məlumatım yoxdur');

  if (normalizedStatus === 'UNKNOWN' || containsFallbackPhrase || !cleanReply) {
    return {
      status: 'UNKNOWN',
      reply: UNKNOWN_FALLBACK_REPLY,
      matchedCategories: [],
    };
  }

  return {
    status: 'ANSWERED',
    reply: cleanReply,
    matchedCategories: Array.isArray(parsed.matchedCategories)
      ? parsed.matchedCategories.filter((c): c is string => typeof c === 'string')
      : [],
  };
}

async function startServer() {
  ensureStoreFile();
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Healthcheck
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  // Public Chatbot Endpoint
  app.post('/api/chat', async (req, res) => {
    const store = readStore();
    const body = req.body as {
      message?: unknown;
      sessionId?: unknown;
      history?: unknown;
    };

    const userQuestion =
      typeof body.message === 'string' ? body.message.trim().slice(0, 1000) : '';
    const sessionId =
      typeof body.sessionId === 'string' && body.sessionId.trim()
        ? body.sessionId.trim().slice(0, 80)
        : `sess_${crypto.randomUUID()}`;

    if (!userQuestion) {
      res.status(400).json({ error: 'Zəhmət olmasa sualınızı daxil edin.' });
      return;
    }

    const rawHistory = Array.isArray(body.history) ? body.history : [];
    const safeHistory: Array<{ role: 'user' | 'assistant'; text: string }> = rawHistory
      .filter(
        (item): item is { role: 'user' | 'assistant'; text: string } =>
          Boolean(item) &&
          typeof item === 'object' &&
          ((item as { role?: unknown }).role === 'user' ||
            (item as { role?: unknown }).role === 'assistant') &&
          typeof (item as { text?: unknown }).text === 'string'
      )
      .map((item) => ({
        role: item.role,
        text: item.text.slice(0, 600),
      }));

    try {
      const timeoutPromise = new Promise<never>((_resolve, reject) => {
        setTimeout(() => reject(new Error('GEMINI_TIMEOUT')), 12000);
      });
      const result = await Promise.race([
        generateGroundedReply(userQuestion, safeHistory, store),
        timeoutPromise,
      ]);

      const logEntry: ChatLogEntry = {
        id: `log_${crypto.randomUUID()}`,
        sessionId,
        userQuestion,
        botReply: result.reply,
        status: result.status,
        matchedCategories: result.matchedCategories,
        createdAt: new Date().toISOString(),
      };

      const latestStore = readStore();
      latestStore.chatLogs.unshift(logEntry);
      if (latestStore.chatLogs.length > 500) {
        latestStore.chatLogs = latestStore.chatLogs.slice(0, 500);
      }
      writeStore(latestStore);

      res.json({
        status: result.status,
        reply: result.reply,
        whatsappUrl: buildWhatsappSupportUrl(userQuestion),
        whatsappNumber: WHATSAPP_NUMBER_DISPLAY,
        logId: logEntry.id,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'UNKNOWN_ERROR';
      console.error('[FLASHLY Chatbot Error]:', message);

      // Strict deterministic verified-KB match on transient Gemini timeout/failure (zero invention)
      const fallbackMatch = matchVerifiedStarterReply(
        userQuestion,
        store.knowledgeBase
      );

      if (fallbackMatch) {
        const logEntry: ChatLogEntry = {
          id: `log_${crypto.randomUUID()}`,
          sessionId,
          userQuestion,
          botReply: fallbackMatch.reply,
          status: 'ANSWERED',
          matchedCategories: [fallbackMatch.category],
          createdAt: new Date().toISOString(),
        };
        const latestStore = readStore();
        latestStore.chatLogs.unshift(logEntry);
        writeStore(latestStore);

        res.json({
          status: 'ANSWERED',
          reply: fallbackMatch.reply,
          whatsappUrl: buildWhatsappSupportUrl(userQuestion),
          whatsappNumber: WHATSAPP_NUMBER_DISPLAY,
          logId: logEntry.id,
        });
        return;
      }

      // Unknown or unverified topic -> direct WhatsApp fallback
      res.json({
        status: 'UNKNOWN',
        reply: UNKNOWN_FALLBACK_REPLY,
        whatsappUrl: buildWhatsappSupportUrl(userQuestion),
        whatsappNumber: WHATSAPP_NUMBER_DISPLAY,
      });
    }
  });

  // Public User Inquiry Submission
  app.post('/api/inquiries', (req, res) => {
    const body = req.body as {
      name?: unknown;
      phone?: unknown;
      message?: unknown;
      sourceQuestion?: unknown;
    };

    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim().slice(0, 40) : '';
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, 1000) : '';
    const sourceQuestion =
      typeof body.sourceQuestion === 'string'
        ? body.sourceQuestion.trim().slice(0, 500)
        : undefined;

    if (!name || !phone || !message) {
      res.status(400).json({
        error: 'Ad, əlaqə nömrəsi və müraciət mətni mütləq doldurulmalıdır.',
      });
      return;
    }

    const store = readStore();
    const inquiry: UserInquiryEntry = {
      id: `inq_${crypto.randomUUID()}`,
      name,
      phone,
      message,
      sourceQuestion,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    store.inquiries.unshift(inquiry);
    writeStore(store);

    res.status(201).json({ success: true, inquiry });
  });

  // Vite Dev Middleware or Static Production Build
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FLASHLY FLEET server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
