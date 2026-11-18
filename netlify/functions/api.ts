import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import {
  VERIFIED_KNOWLEDGE_BASE,
  UNKNOWN_FALLBACK_REPLY,
  WHATSAPP_NUMBER_DISPLAY,
  buildWhatsappSupportUrl,
  formatKnowledgeBaseForPrompt,
  matchVerifiedStarterReply,
} from '../../src/data/knowledgeBase';

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

async function generateGroundedReply(
  userQuestion: string,
  history: Array<{ role: 'user' | 'assistant'; text: string }>
): Promise<{ status: 'ANSWERED' | 'UNKNOWN'; reply: string }> {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY_MISSING');
  }

  const ai = new GoogleGenAI({ apiKey });
  const kbText = formatKnowledgeBaseForPrompt(VERIFIED_KNOWLEDGE_BASE);

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

  const response = await ai.models.generateContent({
    model: 'gemini-4-hydrogen',
    contents: `${recentHistoryText}İstifadəçinin yeni sualı: ${userQuestion}`,
    config: {
      systemInstruction,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING },
          reply: { type: Type.STRING },
        },
        required: ['status', 'reply'],
      },
    },
  });

  const rawText = (response.text || '').trim();
  const parsed = JSON.parse(rawText) as { status?: string; reply?: string };
  const cleanReply = (parsed.reply || '').trim();
  const isUnknown =
    parsed.status !== 'ANSWERED' ||
    !cleanReply ||
    cleanReply.toLowerCase().includes('təsdiqlənmiş məlumatım yoxdur');

  if (isUnknown) {
    return { status: 'UNKNOWN', reply: UNKNOWN_FALLBACK_REPLY };
  }

  return { status: 'ANSWERED', reply: cleanReply };
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname.replace(/\/+$/, '');

  if (req.method === 'GET' && pathname.endsWith('/health')) {
    return jsonResponse({ ok: true, platform: 'netlify' });
  }

  if (req.method === 'POST' && pathname.endsWith('/chat')) {
    let body: { message?: unknown; history?: unknown } = {};
    try {
      body = (await req.json()) as { message?: unknown; history?: unknown };
    } catch {
      return jsonResponse({ error: 'Yanlış sorğu formatı.' }, 400);
    }

    const userQuestion =
      typeof body.message === 'string' ? body.message.trim().slice(0, 1000) : '';

    if (!userQuestion) {
      return jsonResponse({ error: 'Zəhmət olmasa sualınızı daxil edin.' }, 400);
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
        generateGroundedReply(userQuestion, safeHistory),
        timeoutPromise,
      ]);

      return jsonResponse({
        status: result.status,
        reply: result.reply,
        whatsappUrl: buildWhatsappSupportUrl(userQuestion),
        whatsappNumber: WHATSAPP_NUMBER_DISPLAY,
      });
    } catch {
      const fallbackMatch = matchVerifiedStarterReply(
        userQuestion,
        VERIFIED_KNOWLEDGE_BASE
      );
      if (fallbackMatch) {
        return jsonResponse({
          status: 'ANSWERED',
          reply: fallbackMatch.reply,
          whatsappUrl: buildWhatsappSupportUrl(userQuestion),
          whatsappNumber: WHATSAPP_NUMBER_DISPLAY,
        });
      }

      return jsonResponse({
        status: 'UNKNOWN',
        reply: UNKNOWN_FALLBACK_REPLY,
        whatsappUrl: buildWhatsappSupportUrl(userQuestion),
        whatsappNumber: WHATSAPP_NUMBER_DISPLAY,
      });
    }
  }

  if (req.method === 'POST' && pathname.endsWith('/inquiries')) {
    let body: { name?: unknown; phone?: unknown; message?: unknown } = {};
    try {
      body = (await req.json()) as {
        name?: unknown;
        phone?: unknown;
        message?: unknown;
      };
    } catch {
      return jsonResponse({ error: 'Yanlış sorğu formatı.' }, 400);
    }

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!name || !phone || !message) {
      return jsonResponse(
        { error: 'Ad, əlaqə nömrəsi və müraciət mətni mütləq doldurulmalıdır.' },
        400
      );
    }

    return jsonResponse(
      {
        success: true,
        inquiry: {
          id: `inq_${Date.now()}`,
          name,
          phone,
          message,
          status: 'new',
          createdAt: new Date().toISOString(),
        },
      },
      201
    );
  }

  return jsonResponse({ error: 'Tapılmadı.' }, 404);
}
