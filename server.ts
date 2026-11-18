import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.join(__dirname, 'data');
const STORE_PATH = path.join(DATA_DIR, 'chatbot-store.json');

const WHATSAPP_NUMBER_DISPLAY = '+994 99 800 75 65';
const WHATSAPP_BASE_URL = 'https://wa.me/994998007565';
const UNKNOWN_FALLBACK_REPLY =
  'Bu sual barədə hazırda təsdiqlənmiş məlumatım yoxdur. Dəqiq məlumat üçün əməkdaşlarımızla əlaqə saxlayın.';

interface KnowledgeEntry {
  id: string;
  category: string;
  question: string;
  answer: string;
  updatedAt: string;
}

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

interface InstagramPromoSettings {
  enabled: boolean;
  instagramUrl: string;
  instagramHandle: string;
  title: string;
  description: string;
  buttonText: string;
}

interface ReferralSettings {
  enabled: boolean;
  bonusAmount: string;
}

interface ChatbotSettings {
  enabled: boolean;
  greetingText: string;
}

interface SiteSettings {
  instagramPromo: InstagramPromoSettings;
  referralSettings: ReferralSettings;
  chatbotSettings: ChatbotSettings;
}

interface CourierReferrer {
  id: string;
  name: string;
  phone: string;
  normalizedPhone: string;
  code: string;
  approved: boolean;
  createdAt: string;
}

type ReferralRegistrationStatus =
  | 'pending_docs'
  | 'under_review'
  | 'approved'
  | 'rejected';

type ReferralBonusStatus = 'pending' | 'approved' | 'rejected';

interface ReferralRecord {
  id: string;
  referrerId: string;
  referrerCode: string;
  referrerName: string;
  referredName: string;
  referredPhone: string;
  normalizedReferredPhone: string;
  vehicleType: string;
  registrationStatus: ReferralRegistrationStatus;
  bonusStatus: ReferralBonusStatus;
  bonusAmountSnapshot: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatbotStore {
  knowledgeBase: KnowledgeEntry[];
  chatLogs: ChatLogEntry[];
  inquiries: UserInquiryEntry[];
  settings: SiteSettings;
  referrers: CourierReferrer[];
  referrals: ReferralRecord[];
}

const DEFAULT_SETTINGS: SiteSettings = {
  instagramPromo: {
    enabled: true,
    instagramUrl: 'https://www.instagram.com/woltqeydiyyati',
    instagramHandle: '@woltqeydiyyati',
    title: 'FLASHLY FLEET-i Instagram-da İzlə!',
    description:
      'Rəsmi Instagram səhifəmizdə kampaniyalar, kuryer yenilikləri və qeydiyyatda 1-ci növbə üstünlüyü əldə edin.',
    buttonText: 'Instagram-da bizi izlə',
  },
  referralSettings: {
    enabled: true,
    bonusAmount: '',
  },
  chatbotSettings: {
    enabled: true,
    greetingText:
      'Salam! Mən FLASHLY FLEET köməkçisiyəm. Wolt kuryer qeydiyyatı, sənədlər, iş prosesi və ödənişlər barədə sizə kömək edə bilərəm. Aşağıdakı mövzulardan birini seçin və ya sualınızı yazın.',
  },
};

const DEFAULT_KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    id: 'kb-registration-free',
    category: 'Qeydiyyat',
    question:
      'FLASHLY FLEET-də Wolt kuryer qeydiyyatı ödənişlidirmi və necə qeydiyyatdan keçmək olar?',
    answer:
      '30 Noyabr 2026 tarixinədək FLASHLY FLEET-də Wolt kuryer qeydiyyatı tamamilə ödənişsizdir (0 AZN). İlk dəfə qeydiyyatdan keçirsinizsə, saytdakı "Kuryer kimi qeydiyyatdan keç" düyməsinə basıb "BƏLİ, İLK DƏFƏ QEYDİYYATDAN KEÇİRƏM" seçimini edərək rəsmi onlayn formaya (https://forms.gle/jmeGxgsDB4GYj4t48) keçə bilərsiniz.',
    updatedAt: '2026-11-17T00:00:00.000Z',
  },
  {
    id: 'kb-previous-courier',
    category: 'Qeydiyyat',
    question:
      'Əvvəllər Wolt-da qeydiyyatdan keçmişəm və ya işləmişəm, yenidən qeydiyyatdan keçə bilərəmmi?',
    answer:
      'Əgər əvvəllər Wolt platformasında qeydiyyatdan keçmisinizsə və ya kuryer kimi fəaliyyət göstərmisinizsə, yeni qeydiyyat yaratmayın. Əvvəlcə +994 99 800 75 65 WhatsApp nömrəsi vasitəsilə FLASHLY FLEET komandası ilə əlaqə saxlayın — müraciətiniz yoxlanılacaq və növbəti addımlar barədə sizə məlumat veriləcək.',
    updatedAt: '2026-11-17T00:00:00.000Z',
  },
  {
    id: 'kb-required-documents',
    category: 'Sənədlər',
    question: 'Wolt kuryeri olmaq üçün hansı sənədlər və şərtlər tələb olunur?',
    answer:
      'Tələb olunan 6 əsas şərt bunlardır: 1) Şəxsiyyət vəsiqəsinin ön və arxa tərəfinin aydın fotosu; 2) Aydın görünən yeni selfi fotoşəkli; 3) Aktiv telefon nömrəsi; 4) Aktiv Gmail hesabı; 5) Əvvəllər Wolt platformasında qeydiyyatdan keçməmiş olmaq; 6) Maaş ödənişləri üçün aktiv M10 nömrəsi. 18 yaşdan yuxarı şəxslər qoşula bilər. Sənədi olmayan namizədlərə qeydiyyatdan keçdikdə sənəd almaqda dəstək göstərilir.',
    updatedAt: '2026-11-17T00:00:00.000Z',
  },
  {
    id: 'kb-schedule-vehicles',
    category: 'İş qrafiki',
    question: 'İş qrafiki necədir və hansı nəqliyyat növləri ilə işləmək olar?',
    answer:
      'İş qrafiki tam sərbəstdir: iş saatlarınızı özünüz müəyyən edirsiniz, istədiyiniz gün və saatda xəttə qoşulub əlavə və ya əsas iş kimi çalışa bilərsiniz. Qəbul edilən nəqliyyat növləri: Velosiped, Skuter, Motosiklet və Avtomobil. Velosipedi olmayanlar üçün icarə variantları da mövcuddur (bunu qeydiyyatda qeyd etmək lazımdır).',
    updatedAt: '2026-11-17T00:00:00.000Z',
  },
  {
    id: 'kb-courier-process',
    category: 'Kuryerlik prosesi',
    question: 'Kuryerlik prosesi necə başlayır və nə vaxt işə başlaya bilərəm?',
    answer:
      'Proses belədir: Tələb olunan sənədləri hazırlayıb rəsmi qeydiyyat formasını doldurursunuz (saytda addım-addım YouTube video təlimatı da var: https://youtu.be/Q3ZB9hiLd6g). Sənədlər hazırdırsa, müraciətiniz adətən 1-2 gün ərzində aktivləşdirilir və Wolt platformasında restoran sifarişlərini çatdırmağa başlayırsınız.',
    updatedAt: '2026-11-17T00:00:00.000Z',
  },
  {
    id: 'kb-earnings-payout',
    category: 'Qazanc və Ödənişlər',
    question: 'Qazanc sistemi və maaş ödənişləri necə hesablanır?',
    answer:
      'İki ödəniş sistemi mövcuddur: Gündəlik ödənişdə qazanc 40 AZN-ə qədər olduqda kuryer 75% (şirkət 25%), 40 AZN-dən yuxarı olduqda kuryer 80% (şirkət 20%) pay alır. 15 günlük ödəniş sistemində isə kuryer payı 80%, şirkət payı 20%-dir. Ödənişlər aktiv M10 nömrəsinə və ya həftədə 1 dəfə bank kartınıza köçürülür.',
    updatedAt: '2026-11-17T00:00:00.000Z',
  },
  {
    id: 'kb-deposit-bag',
    category: 'Depozit və Çanta',
    question: '40 AZN depozit və Wolt termal çantası qaydası necədir?',
    answer:
      'İlkin nağd ödəniş tələb olunmur. Qeydiyyat zamanı hesabınızda 40 AZN mənfi depozit açılır və işlədikcə qazancınızdan hissə-hissə çıxılır. Bu məbləğə 1 ədəd rəsmi Wolt termal çantası daxildir. Çantanı geri qaytardığınız zaman 80%-i (32 AZN) geri ödənilir, 20%-i (8 AZN) isə istifadə və amortizasiya haqqı olaraq saxlanılır.',
    updatedAt: '2026-11-17T00:00:00.000Z',
  },
  {
    id: 'kb-application-status',
    category: 'Müraciətlərin vəziyyəti',
    question: 'Qeydiyyat müraciətimin vəziyyətini necə öyrənə bilərəm?',
    answer:
      'Şəxsi məlumatların qorunması səbəbindən bu köməkçi fərdi müraciətlərə və sənədlərə çıxış əldə etmir. Müraciətinizin vəziyyətini dəqiqləşdirmək üçün birbaşa +994 99 800 75 65 WhatsApp nömrəsi və ya +994 60 446 64 04 telefon nömrəsi ilə FLASHLY FLEET komandası ilə əlaqə saxlayın.',
    updatedAt: '2026-11-17T00:00:00.000Z',
  },
  {
    id: 'kb-contact-office',
    category: 'Əlaqə və Ofis',
    question: 'FLASHLY FLEET ofisi harada yerləşir və əlaqə vasitələri hansılardır?',
    answer:
      'Bakı ofisimizin ünvanı: Məmməd Araz 25A (Avropa qapıları / English Yard ilə üzbəüz), 2-ci mərtəbə, ofis 7, soldan üçüncü otaq. Əlaqə nömrələri: +994 99 800 75 65 (WhatsApp və zəng) və +994 60 446 64 04 (telefon və WhatsApp). Rəsmi Instagram səhifəsi: @woltqeydiyyati (https://www.instagram.com/woltqeydiyyati).',
    updatedAt: '2026-11-17T00:00:00.000Z',
  },
  {
    id: 'kb-bonuses',
    category: 'Bonuslar',
    question: 'Instagram və Dostunu Gətir bonusları necə işləyir?',
    answer:
      'Instagram-da @woltqeydiyyati səhifəsini izləyib ekran görüntüsünü (screenshot) WhatsApp-a göndərənlər qeydiyyatda 1-ci növbəyə keçir və sənəd köməyi pulsuz olur. Həmçinin "Dostunu Gətir, Bonus Qazan" proqramı ilə unikal dəvət linkinizi dostunuza göndərib onun qeydiyyat və sənəd yoxlanışı təsdiqləndikdə bonus qazanırsınız.',
    updatedAt: '2026-11-17T00:00:00.000Z',
  },
];

function mergeSettings(rawSettings?: Partial<SiteSettings>): SiteSettings {
  const rawIg = rawSettings?.instagramPromo;
  const rawRef = rawSettings?.referralSettings;
  const rawChat = rawSettings?.chatbotSettings;

  return {
    instagramPromo: {
      enabled:
        typeof rawIg?.enabled === 'boolean'
          ? rawIg.enabled
          : DEFAULT_SETTINGS.instagramPromo.enabled,
      instagramUrl:
        typeof rawIg?.instagramUrl === 'string' && rawIg.instagramUrl.trim()
          ? rawIg.instagramUrl.trim()
          : DEFAULT_SETTINGS.instagramPromo.instagramUrl,
      instagramHandle:
        typeof rawIg?.instagramHandle === 'string' && rawIg.instagramHandle.trim()
          ? rawIg.instagramHandle.trim()
          : DEFAULT_SETTINGS.instagramPromo.instagramHandle,
      title:
        typeof rawIg?.title === 'string' && rawIg.title.trim()
          ? rawIg.title.trim()
          : DEFAULT_SETTINGS.instagramPromo.title,
      description:
        typeof rawIg?.description === 'string' && rawIg.description.trim()
          ? rawIg.description.trim()
          : DEFAULT_SETTINGS.instagramPromo.description,
      buttonText:
        typeof rawIg?.buttonText === 'string' && rawIg.buttonText.trim()
          ? rawIg.buttonText.trim()
          : DEFAULT_SETTINGS.instagramPromo.buttonText,
    },
    referralSettings: {
      enabled:
        typeof rawRef?.enabled === 'boolean'
          ? rawRef.enabled
          : DEFAULT_SETTINGS.referralSettings.enabled,
      bonusAmount:
        typeof rawRef?.bonusAmount === 'string' ? rawRef.bonusAmount.trim() : '',
    },
    chatbotSettings: {
      enabled:
        typeof rawChat?.enabled === 'boolean'
          ? rawChat.enabled
          : DEFAULT_SETTINGS.chatbotSettings.enabled,
      greetingText:
        typeof rawChat?.greetingText === 'string' && rawChat.greetingText.trim()
          ? rawChat.greetingText.trim()
          : DEFAULT_SETTINGS.chatbotSettings.greetingText,
    },
  };
}

function ensureStoreFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    const initial: ChatbotStore = {
      knowledgeBase: DEFAULT_KNOWLEDGE_BASE,
      chatLogs: [],
      inquiries: [],
      settings: mergeSettings(),
      referrers: [],
      referrals: [],
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
      settings: mergeSettings(parsed.settings),
      referrers: Array.isArray(parsed.referrers) ? parsed.referrers : [],
      referrals: Array.isArray(parsed.referrals) ? parsed.referrals : [],
    };
  } catch {
    return {
      knowledgeBase: DEFAULT_KNOWLEDGE_BASE,
      chatLogs: [],
      inquiries: [],
      settings: mergeSettings(),
      referrers: [],
      referrals: [],
    };
  }
}

function writeStore(store: ChatbotStore): void {
  ensureStoreFile();
  const tempPath = `${STORE_PATH}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(store, null, 2), 'utf8');
  fs.renameSync(tempPath, STORE_PATH);
}

function normalizePhone(input: string): string {
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('00994')) {
    digits = digits.slice(2);
  }
  if (digits.length === 10 && digits.startsWith('0')) {
    digits = `994${digits.slice(1)}`;
  } else if (digits.length === 9) {
    digits = `994${digits}`;
  }
  return digits;
}

function isValidPhone(normalized: string): boolean {
  return normalized.length >= 9 && normalized.length <= 15;
}

function generateUniqueReferralCode(existing: CourierReferrer[]): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const used = new Set(existing.map((r) => r.code.toUpperCase()));
  for (let attempt = 0; attempt < 50; attempt += 1) {
    let suffix = '';
    for (let i = 0; i < 6; i += 1) {
      const idx = crypto.randomInt(0, alphabet.length);
      suffix += alphabet[idx];
    }
    const candidate = `FF-${suffix}`;
    if (!used.has(candidate)) {
      return candidate;
    }
  }
  return `FF-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
}

function sanitizeSafeUrl(rawUrl: string, fallback: string): string {
  const trimmed = rawUrl.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.slice(0, 300);
  }
  return fallback;
}

function getAdminPassword(): string {
  return (process.env.ADMIN_PASSWORD || 'flashly2026').trim();
}

function getTokenSecret(): string {
  return crypto
    .createHash('sha256')
    .update(`flashly-fleet-admin:${getAdminPassword()}`)
    .digest('hex');
}

function issueAdminToken(): string {
  const payload = Buffer.from(
    JSON.stringify({
      role: 'admin',
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    })
  ).toString('base64url');
  const sig = crypto
    .createHmac('sha256', getTokenSecret())
    .update(payload)
    .digest('base64url');
  return `${payload}.${sig}`;
}

function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expectedSig = crypto
    .createHmac('sha256', getTokenSecret())
    .update(payload)
    .digest('base64url');

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false;

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      role?: string;
      exp?: number;
    };
    return decoded.role === 'admin' && typeof decoded.exp === 'number' && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!verifyAdminToken(token)) {
    res.status(401).json({ error: 'Admin girişi tələb olunur.' });
    return;
  }
  next();
}

function buildWhatsappSupportUrl(userQuestion?: string): string {
  const cleanQuestion = (userQuestion || '').trim();
  const text = cleanQuestion
    ? `Salam. FLASHLY FLEET saytındakı köməkçidən yazıram. Bu sual barədə dəqiq məlumat almaq istəyirəm: "${cleanQuestion}"`
    : 'Salam. FLASHLY FLEET saytındakı köməkçidən yazıram. Məlumat almaq istəyirəm.';
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(text)}`;
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

function formatKnowledgeBaseForPrompt(
  entries: KnowledgeEntry[],
  settings: SiteSettings
): string {
  const kbList =
    entries.length === 0
      ? 'Məlumat bazası hazırda boşdur.'
      : entries
          .map(
            (item, index) =>
              `[${index + 1}] Kateqoriya: ${item.category}\nSual: ${item.question}\nTəsdiqlənmiş Cavab: ${item.answer}`
          )
          .join('\n\n');

  const bonusInfo = settings.referralSettings.bonusAmount
    ? `Admin tərəfindən təyin edilən cari Dostunu Gətir bonus məbləği: ${settings.referralSettings.bonusAmount}.`
    : 'Dostunu Gətir bonus məbləği admin tərəfindən fərdi qaydada təyin edilir (hazırda sabit məbləğ elan edilməyib — heç bir rəqəm uydurma).';

  const igInfo = `Rəsmi Instagram səhifəsi: ${settings.instagramPromo.instagramHandle} (${settings.instagramPromo.instagramUrl}).`;

  return `${kbList}\n\n[ƏLAVƏ TƏSDİQLƏNMİŞ SİSTEM MƏLUMATI]\n- ${bonusInfo}\n- ${igInfo}\n- İstifadəçi "Başqa sualım var." yazdıqda ona nəzakətlə sualını buraya yazmağı və ya +994 99 800 75 65 WhatsApp nömrəsi ilə əlaqə saxlamağı təklif et (status: "ANSWERED").`;
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

  const kbText = formatKnowledgeBaseForPrompt(store.knowledgeBase, store.settings);

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

function maskPhone(phone: string): string {
  const clean = phone.trim();
  if (clean.length <= 6) return clean;
  return `${clean.slice(0, 4)} *** ${clean.slice(-4)}`;
}

async function startServer() {
  ensureStoreFile();
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Healthcheck
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  // Public Runtime Settings (Instagram Promo, Referral Settings, Chatbot Status)
  app.get('/api/public-config', (_req, res) => {
    const store = readStore();
    res.json({
      instagramPromo: store.settings.instagramPromo,
      referralSettings: store.settings.referralSettings,
      chatbotSettings: store.settings.chatbotSettings,
    });
  });

  // Public Chatbot Endpoint
  app.post('/api/chat', async (req, res) => {
    const store = readStore();
    if (!store.settings.chatbotSettings.enabled) {
      res.status(503).json({
        disabled: true,
        error: 'Chatbot hazırda admin tərəfindən müvəqqəti deaktiv edilib.',
        whatsappUrl: buildWhatsappSupportUrl(),
        whatsappNumber: WHATSAPP_NUMBER_DISPLAY,
      });
      return;
    }

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
      const result = await generateGroundedReply(userQuestion, safeHistory, store);

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

      if (message === 'GEMINI_API_KEY_MISSING') {
        res.status(503).json({
          error:
            'AI köməkçi xidməti hazırda konfiqurasiya olunmayıb. Zəhmət olmasa əməkdaşlarımızla əlaqə saxlayın.',
          whatsappUrl: buildWhatsappSupportUrl(userQuestion),
          whatsappNumber: WHATSAPP_NUMBER_DISPLAY,
        });
        return;
      }

      res.status(502).json({
        error:
          'Cavab hazırlanarkən texniki xəta baş verdi. Dəqiq məlumat üçün WhatsApp vasitəsilə əməkdaşlarımızla əlaqə saxlayın.',
        whatsappUrl: buildWhatsappSupportUrl(userQuestion),
        whatsappNumber: WHATSAPP_NUMBER_DISPLAY,
      });
    }
  });

  // Public User Inquiry Submission (stored for Admin Panel)
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

  // Public Referral: Request / Check Courier Referral Link & Code
  app.post('/api/referrals/referrer-request', (req, res) => {
    const store = readStore();
    if (!store.settings.referralSettings.enabled) {
      res.status(503).json({
        error: 'Referral proqramı hazırda deaktiv edilib.',
      });
      return;
    }

    const body = req.body as { name?: unknown; phone?: unknown };
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim().slice(0, 40) : '';
    const normalized = normalizePhone(phone);

    if (!name || !isValidPhone(normalized)) {
      res.status(400).json({
        error: 'Zəhmət olmasa ad-soyadınızı və düzgün telefon nömrənizi daxil edin.',
      });
      return;
    }

    const existing = store.referrers.find((r) => r.normalizedPhone === normalized);
    if (existing) {
      const invited = store.referrals
        .filter((item) => item.referrerId === existing.id)
        .map((item) => ({
          id: item.id,
          referredName: item.referredName,
          referredPhoneMasked: maskPhone(item.referredPhone),
          vehicleType: item.vehicleType,
          registrationStatus: item.registrationStatus,
          bonusStatus: item.bonusStatus,
          bonusAmountSnapshot: item.bonusAmountSnapshot,
          createdAt: item.createdAt,
        }));

      res.json({
        referrer: {
          name: existing.name,
          code: existing.approved ? existing.code : null,
          approved: existing.approved,
          createdAt: existing.createdAt,
        },
        invited,
        alreadyExists: true,
      });
      return;
    }

    const created: CourierReferrer = {
      id: `refp_${crypto.randomUUID()}`,
      name,
      phone,
      normalizedPhone: normalized,
      code: generateUniqueReferralCode(store.referrers),
      approved: false,
      createdAt: new Date().toISOString(),
    };

    store.referrers.unshift(created);
    writeStore(store);

    res.status(201).json({
      referrer: {
        name: created.name,
        code: null,
        approved: false,
        createdAt: created.createdAt,
      },
      invited: [],
      alreadyExists: false,
    });
  });

  // Public Referral: Lookup courier code & invited friends by phone or code
  app.post('/api/referrals/referrer-lookup', (req, res) => {
    const store = readStore();
    const body = req.body as { query?: unknown };
    const rawQuery = typeof body.query === 'string' ? body.query.trim() : '';

    if (!rawQuery) {
      res.status(400).json({ error: 'Telefon nömrəsi və ya dəvət kodu daxil edin.' });
      return;
    }

    const upperCode = rawQuery.toUpperCase();
    const normalized = normalizePhone(rawQuery);

    const found = store.referrers.find(
      (r) =>
        r.code.toUpperCase() === upperCode ||
        (isValidPhone(normalized) && r.normalizedPhone === normalized)
    );

    if (!found) {
      res.status(404).json({
        error: 'Bu nömrə və ya koda uyğun kuryer qeydi tapılmadı.',
      });
      return;
    }

    const invited = store.referrals
      .filter((item) => item.referrerId === found.id)
      .map((item) => ({
        id: item.id,
        referredName: item.referredName,
        referredPhoneMasked: maskPhone(item.referredPhone),
        vehicleType: item.vehicleType,
        registrationStatus: item.registrationStatus,
        bonusStatus: item.bonusStatus,
        bonusAmountSnapshot: item.bonusAmountSnapshot,
        createdAt: item.createdAt,
      }));

    res.json({
      referrer: {
        name: found.name,
        code: found.approved ? found.code : null,
        approved: found.approved,
        createdAt: found.createdAt,
      },
      invited,
    });
  });

  // Public Referral: Validate a ?ref=CODE parameter safely
  app.get('/api/referrals/validate/:code', (req, res) => {
    const store = readStore();
    const code = (req.params.code || '').trim().toUpperCase();
    const referrer = store.referrers.find(
      (r) => r.code.toUpperCase() === code && r.approved
    );

    if (!referrer) {
      res.status(404).json({ valid: false });
      return;
    }

    res.json({
      valid: true,
      code: referrer.code,
      referrerName: referrer.name,
      bonusAmount: store.settings.referralSettings.bonusAmount,
    });
  });

  // Public Referral: Register an invited courier (with anti-duplicate & self-referral protection)
  app.post('/api/referrals/register', (req, res) => {
    const store = readStore();
    if (!store.settings.referralSettings.enabled) {
      res.status(503).json({
        error: 'Referral proqramı hazırda deaktiv edilib.',
      });
      return;
    }

    const body = req.body as {
      referralCode?: unknown;
      name?: unknown;
      phone?: unknown;
      vehicleType?: unknown;
    };

    const referralCode =
      typeof body.referralCode === 'string'
        ? body.referralCode.trim().toUpperCase().slice(0, 32)
        : '';
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim().slice(0, 40) : '';
    const vehicleType =
      typeof body.vehicleType === 'string' && body.vehicleType.trim()
        ? body.vehicleType.trim().slice(0, 40)
        : 'Velosiped';

    const normalizedReferred = normalizePhone(phone);

    if (!referralCode || !name || !isValidPhone(normalizedReferred)) {
      res.status(400).json({
        error: 'Dəvət kodu, ad-soyad və düzgün telefon nömrəsi mütləq daxil edilməlidir.',
      });
      return;
    }

    const referrer = store.referrers.find(
      (r) => r.code.toUpperCase() === referralCode
    );

    if (!referrer || !referrer.approved) {
      res.status(404).json({
        error: 'Daxil edilən dəvət kodu aktiv və ya təsdiqlənmiş kuryerə aid deyil.',
      });
      return;
    }

    // Fraud prevention 1: Self-referral block
    if (referrer.normalizedPhone === normalizedReferred) {
      res.status(400).json({
        error: 'Öz dəvət kodunuzla özünüzü qeydiyyatdan keçirə bilməzsiniz.',
      });
      return;
    }

    // Fraud prevention 2: Duplicate phone block
    const duplicate = store.referrals.find(
      (r) => r.normalizedReferredPhone === normalizedReferred
    );
    if (duplicate) {
      res.status(409).json({
        error:
          'Bu telefon nömrəsi ilə dəvət qeydiyyatı artıq mövcuddur. Təkrar qeydiyyat və bonus mümkün deyil.',
      });
      return;
    }

    const now = new Date().toISOString();
    const record: ReferralRecord = {
      id: `refrec_${crypto.randomUUID()}`,
      referrerId: referrer.id,
      referrerCode: referrer.code,
      referrerName: referrer.name,
      referredName: name,
      referredPhone: phone,
      normalizedReferredPhone: normalizedReferred,
      vehicleType,
      registrationStatus: 'pending_docs',
      bonusStatus: 'pending',
      bonusAmountSnapshot: store.settings.referralSettings.bonusAmount,
      createdAt: now,
      updatedAt: now,
    };

    store.referrals.unshift(record);
    writeStore(store);

    res.status(201).json({
      success: true,
      referral: {
        id: record.id,
        referrerName: record.referrerName,
        referrerCode: record.referrerCode,
        registrationStatus: record.registrationStatus,
        bonusStatus: record.bonusStatus,
      },
    });
  });

  // Admin Authentication
  app.post('/api/admin/login', (req, res) => {
    const body = req.body as { password?: unknown };
    const provided = typeof body.password === 'string' ? body.password.trim() : '';

    if (!provided || provided !== getAdminPassword()) {
      res.status(401).json({ error: 'Şifrə yanlışdır.' });
      return;
    }

    res.json({ token: issueAdminToken() });
  });

  app.get('/api/admin/session', requireAdmin, (_req, res) => {
    res.json({ authenticated: true });
  });

  // Admin Dashboard Data (KB + Logs + Inquiries + Settings + Referrals)
  app.get('/api/admin/dashboard', requireAdmin, (_req, res) => {
    const store = readStore();
    const answeredCount = store.chatLogs.filter((l) => l.status === 'ANSWERED').length;
    const unansweredCount = store.chatLogs.filter((l) => l.status === 'UNKNOWN').length;
    const newInquiriesCount = store.inquiries.filter((i) => i.status === 'new').length;
    const pendingBonusesCount = store.referrals.filter(
      (r) => r.bonusStatus === 'pending'
    ).length;
    const approvedBonusesCount = store.referrals.filter(
      (r) => r.bonusStatus === 'approved'
    ).length;

    res.json({
      knowledgeBase: store.knowledgeBase,
      chatLogs: store.chatLogs,
      inquiries: store.inquiries,
      settings: store.settings,
      referrers: store.referrers,
      referrals: store.referrals,
      stats: {
        kbCount: store.knowledgeBase.length,
        answeredCount,
        unansweredCount,
        inquiriesCount: store.inquiries.length,
        newInquiriesCount,
        referrersCount: store.referrers.length,
        referralsCount: store.referrals.length,
        pendingBonusesCount,
        approvedBonusesCount,
      },
    });
  });

  // Admin Settings Update (Instagram Promo, Referral Settings, Chatbot Settings)
  app.put('/api/admin/settings', requireAdmin, (req, res) => {
    const body = req.body as Partial<SiteSettings>;
    const store = readStore();
    const current = store.settings;

    const nextIg = body.instagramPromo;
    const nextRef = body.referralSettings;
    const nextChat = body.chatbotSettings;

    const updatedSettings: SiteSettings = {
      instagramPromo: {
        enabled:
          typeof nextIg?.enabled === 'boolean'
            ? nextIg.enabled
            : current.instagramPromo.enabled,
        instagramUrl:
          typeof nextIg?.instagramUrl === 'string' && nextIg.instagramUrl.trim()
            ? sanitizeSafeUrl(
                nextIg.instagramUrl,
                current.instagramPromo.instagramUrl
              )
            : current.instagramPromo.instagramUrl,
        instagramHandle:
          typeof nextIg?.instagramHandle === 'string' && nextIg.instagramHandle.trim()
            ? nextIg.instagramHandle.trim().slice(0, 80)
            : current.instagramPromo.instagramHandle,
        title:
          typeof nextIg?.title === 'string' && nextIg.title.trim()
            ? nextIg.title.trim().slice(0, 140)
            : current.instagramPromo.title,
        description:
          typeof nextIg?.description === 'string' && nextIg.description.trim()
            ? nextIg.description.trim().slice(0, 500)
            : current.instagramPromo.description,
        buttonText:
          typeof nextIg?.buttonText === 'string' && nextIg.buttonText.trim()
            ? nextIg.buttonText.trim().slice(0, 80)
            : current.instagramPromo.buttonText,
      },
      referralSettings: {
        enabled:
          typeof nextRef?.enabled === 'boolean'
            ? nextRef.enabled
            : current.referralSettings.enabled,
        bonusAmount:
          typeof nextRef?.bonusAmount === 'string'
            ? nextRef.bonusAmount.trim().slice(0, 60)
            : current.referralSettings.bonusAmount,
      },
      chatbotSettings: {
        enabled:
          typeof nextChat?.enabled === 'boolean'
            ? nextChat.enabled
            : current.chatbotSettings.enabled,
        greetingText:
          typeof nextChat?.greetingText === 'string' && nextChat.greetingText.trim()
            ? nextChat.greetingText.trim().slice(0, 500)
            : current.chatbotSettings.greetingText,
      },
    };

    store.settings = updatedSettings;
    writeStore(store);

    res.json({ settings: updatedSettings });
  });

  // Admin: Create Verified Courier Referrer directly
  app.post('/api/admin/referrers', requireAdmin, (req, res) => {
    const body = req.body as {
      name?: unknown;
      phone?: unknown;
      approved?: unknown;
    };
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim().slice(0, 40) : '';
    const normalized = normalizePhone(phone);
    const approved = typeof body.approved === 'boolean' ? body.approved : true;

    if (!name || !isValidPhone(normalized)) {
      res.status(400).json({
        error: 'Kuryer adı və düzgün telefon nömrəsi daxil edilməlidir.',
      });
      return;
    }

    const store = readStore();
    const duplicate = store.referrers.find((r) => r.normalizedPhone === normalized);
    if (duplicate) {
      res.status(409).json({
        error: 'Bu telefon nömrəsi ilə kuryer artıq mövcuddur.',
      });
      return;
    }

    const entry: CourierReferrer = {
      id: `refp_${crypto.randomUUID()}`,
      name,
      phone,
      normalizedPhone: normalized,
      code: generateUniqueReferralCode(store.referrers),
      approved,
      createdAt: new Date().toISOString(),
    };

    store.referrers.unshift(entry);
    writeStore(store);

    res.status(201).json({ referrer: entry });
  });

  // Admin: Approve or Revoke Courier Referrer
  app.patch('/api/admin/referrers/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const body = req.body as { approved?: unknown };
    if (typeof body.approved !== 'boolean') {
      res.status(400).json({ error: 'Təsdiq statusu göstərilməlidir.' });
      return;
    }

    const store = readStore();
    const index = store.referrers.findIndex((r) => r.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Kuryer tapılmadı.' });
      return;
    }

    store.referrers[index] = {
      ...store.referrers[index],
      approved: body.approved,
    };
    writeStore(store);

    res.json({ referrer: store.referrers[index] });
  });

  app.delete('/api/admin/referrers/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const store = readStore();
    const next = store.referrers.filter((r) => r.id !== id);
    if (next.length === store.referrers.length) {
      res.status(404).json({ error: 'Kuryer tapılmadı.' });
      return;
    }
    store.referrers = next;
    writeStore(store);
    res.json({ deleted: true });
  });

  // Admin: Update Invited Courier Registration/Document Status or Bonus Approval
  app.patch('/api/admin/referrals/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const body = req.body as {
      registrationStatus?: unknown;
      bonusStatus?: unknown;
      bonusAmountSnapshot?: unknown;
    };

    const store = readStore();
    const index = store.referrals.findIndex((r) => r.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Dəvət qeydiyyatı tapılmadı.' });
      return;
    }

    const current = store.referrals[index];

    const validRegStatuses: ReferralRegistrationStatus[] = [
      'pending_docs',
      'under_review',
      'approved',
      'rejected',
    ];
    const nextRegStatus: ReferralRegistrationStatus =
      typeof body.registrationStatus === 'string' &&
      validRegStatuses.includes(body.registrationStatus as ReferralRegistrationStatus)
        ? (body.registrationStatus as ReferralRegistrationStatus)
        : current.registrationStatus;

    const validBonusStatuses: ReferralBonusStatus[] = [
      'pending',
      'approved',
      'rejected',
    ];
    let nextBonusStatus: ReferralBonusStatus =
      typeof body.bonusStatus === 'string' &&
      validBonusStatuses.includes(body.bonusStatus as ReferralBonusStatus)
        ? (body.bonusStatus as ReferralBonusStatus)
        : current.bonusStatus;

    // Bonus activation rule: Bonus can only be approved once registration & docs are approved
    if (nextBonusStatus === 'approved' && nextRegStatus !== 'approved') {
      res.status(400).json({
        error:
          'Bonus yalnız qeydiyyat və sənəd yoxlanışı "Təsdiqlənib" olduqdan sonra təsdiqlənə bilər.',
      });
      return;
    }

    // Duplicate bonus guard for same normalized phone
    if (nextBonusStatus === 'approved') {
      const otherApproved = store.referrals.find(
        (r) =>
          r.id !== current.id &&
          r.normalizedReferredPhone === current.normalizedReferredPhone &&
          r.bonusStatus === 'approved'
      );
      if (otherApproved) {
        res.status(409).json({
          error: 'Bu şəxs üçün artıq təsdiqlənmiş bonus mövcuddur. Təkrar bonus qadağandır.',
        });
        return;
      }
    }

    // If registration is rejected and bonus wasn't explicitly set, mark bonus rejected
    if (nextRegStatus === 'rejected' && body.bonusStatus === undefined) {
      nextBonusStatus = 'rejected';
    }

    const nextAmountSnapshot =
      typeof body.bonusAmountSnapshot === 'string'
        ? body.bonusAmountSnapshot.trim().slice(0, 60)
        : current.bonusAmountSnapshot || store.settings.referralSettings.bonusAmount;

    store.referrals[index] = {
      ...current,
      registrationStatus: nextRegStatus,
      bonusStatus: nextBonusStatus,
      bonusAmountSnapshot: nextAmountSnapshot,
      updatedAt: new Date().toISOString(),
    };
    writeStore(store);

    res.json({ referral: store.referrals[index] });
  });

  app.delete('/api/admin/referrals/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const store = readStore();
    const next = store.referrals.filter((r) => r.id !== id);
    if (next.length === store.referrals.length) {
      res.status(404).json({ error: 'Qeyd tapılmadı.' });
      return;
    }
    store.referrals = next;
    writeStore(store);
    res.json({ deleted: true });
  });

  // Admin Knowledge Base CRUD
  app.post('/api/admin/kb', requireAdmin, (req, res) => {
    const body = req.body as {
      category?: unknown;
      question?: unknown;
      answer?: unknown;
    };

    const category =
      typeof body.category === 'string' && body.category.trim()
        ? body.category.trim().slice(0, 80)
        : 'Ümumi';
    const question =
      typeof body.question === 'string' ? body.question.trim().slice(0, 500) : '';
    const answer =
      typeof body.answer === 'string' ? body.answer.trim().slice(0, 2000) : '';

    if (!question || !answer) {
      res.status(400).json({ error: 'Sual və təsdiqlənmiş cavab boş ola bilməz.' });
      return;
    }

    const store = readStore();
    const entry: KnowledgeEntry = {
      id: `kb_${crypto.randomUUID()}`,
      category,
      question,
      answer,
      updatedAt: new Date().toISOString(),
    };
    store.knowledgeBase.unshift(entry);
    writeStore(store);

    res.status(201).json({ entry });
  });

  app.put('/api/admin/kb/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const body = req.body as {
      category?: unknown;
      question?: unknown;
      answer?: unknown;
    };

    const category =
      typeof body.category === 'string' && body.category.trim()
        ? body.category.trim().slice(0, 80)
        : 'Ümumi';
    const question =
      typeof body.question === 'string' ? body.question.trim().slice(0, 500) : '';
    const answer =
      typeof body.answer === 'string' ? body.answer.trim().slice(0, 2000) : '';

    if (!question || !answer) {
      res.status(400).json({ error: 'Sual və təsdiqlənmiş cavab boş ola bilməz.' });
      return;
    }

    const store = readStore();
    const index = store.knowledgeBase.findIndex((item) => item.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Məlumat tapılmadı.' });
      return;
    }

    store.knowledgeBase[index] = {
      ...store.knowledgeBase[index],
      category,
      question,
      answer,
      updatedAt: new Date().toISOString(),
    };
    writeStore(store);

    res.json({ entry: store.knowledgeBase[index] });
  });

  app.delete('/api/admin/kb/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const store = readStore();
    const nextKb = store.knowledgeBase.filter((item) => item.id !== id);
    if (nextKb.length === store.knowledgeBase.length) {
      res.status(404).json({ error: 'Məlumat tapılmadı.' });
      return;
    }
    store.knowledgeBase = nextKb;
    writeStore(store);

    res.json({ deleted: true });
  });

  // Admin Inquiries Management
  app.patch('/api/admin/inquiries/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const body = req.body as { status?: unknown };
    const nextStatus = body.status === 'reviewed' ? 'reviewed' : 'new';

    const store = readStore();
    const index = store.inquiries.findIndex((item) => item.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Müraciət tapılmadı.' });
      return;
    }

    store.inquiries[index] = {
      ...store.inquiries[index],
      status: nextStatus,
    };
    writeStore(store);

    res.json({ inquiry: store.inquiries[index] });
  });

  app.delete('/api/admin/inquiries/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const store = readStore();
    store.inquiries = store.inquiries.filter((item) => item.id !== id);
    writeStore(store);
    res.json({ deleted: true });
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
