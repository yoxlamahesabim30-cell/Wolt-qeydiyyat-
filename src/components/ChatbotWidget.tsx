import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Loader2,
  MessageCircle,
  RotateCcw,
  Send,
  UserPlus,
  X,
} from 'lucide-react';
import { LINKS, OFFICE_INFO } from '../data/fleetData';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useRegistrationModal } from '../context/RegistrationModalContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  status?: 'ANSWERED' | 'UNKNOWN' | 'ERROR';
  whatsappUrl?: string;
  sourceQuestion?: string;
}

const QUICK_PROMPTS = [
  'Kuryer olmaq istəyirəm.',
  'Qeydiyyat sənədləri haqqında.',
  'İş prosesi haqqında.',
  'Ödəniş və qazanc haqqında.',
  'Qeydiyyatımın statusunu öyrənmək istəyirəm.',
  'Başqa sualım var.',
] as const;

const CHAT_AUTOOPEN_SEEN_KEY = 'flashly_chat_autopen_seen';

function createSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `sess_${crypto.randomUUID()}`;
  }
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const ChatbotWidget: React.FC = () => {
  const { config, configLoaded, igPopupOpen } = useSiteConfig();
  const { openRegistrationModal } = useRegistrationModal();
  const { chatbotSettings } = config;

  const initialGreeting: ChatMessage = useMemo(
    () => ({
      id: 'welcome-msg',
      role: 'assistant',
      text: chatbotSettings.greetingText,
      status: 'ANSWERED',
    }),
    [chatbotSettings.greetingText]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => createSessionId());

  // Direct inquiry state inside chat
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquirySourceQuestion, setInquirySourceQuestion] = useState<string>('');
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquiryResult, setInquiryResult] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const userInteractedRef = useRef(false);

  // Sync welcome text when admin updates greeting while still on initial screen
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome-msg') {
        return [initialGreeting];
      }
      return prev;
    });
  }, [initialGreeting]);

  // Close chatbot if admin disables it
  useEffect(() => {
    if (configLoaded && !chatbotSettings.enabled) {
      setIsOpen(false);
    }
  }, [configLoaded, chatbotSettings.enabled]);

  // One-time auto-greeting 3-5 seconds after landing (deferred if Instagram promo popup is open)
  useEffect(() => {
    if (!configLoaded || !chatbotSettings.enabled) return;
    if (typeof window === 'undefined') return;
    if (igPopupOpen) return;

    try {
      if (window.localStorage.getItem(CHAT_AUTOOPEN_SEEN_KEY) === '1') {
        return;
      }
    } catch {
      return;
    }

    const igSeenAlready = (() => {
      try {
        return window.localStorage.getItem('flashly_ig_popup_seen') === '1';
      } catch {
        return true;
      }
    })();

    // Wait 4.2s on clean visit, or 1.4s after Instagram popup just closed
    const delayMs = igSeenAlready ? 1400 : 4200;

    const timer = window.setTimeout(() => {
      if (userInteractedRef.current) return;
      try {
        window.localStorage.setItem(CHAT_AUTOOPEN_SEEN_KEY, '1');
      } catch {
        // ignore storage error
      }
      setIsOpen(true);
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [configLoaded, chatbotSettings.enabled, igPopupOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading, inquiryOpen]);

  useEffect(() => {
    if (isOpen && !inquiryOpen) {
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen, inquiryOpen]);

  if (configLoaded && !chatbotSettings.enabled) {
    return null;
  }

  const markAutoOpenSeen = () => {
    userInteractedRef.current = true;
    try {
      window.localStorage.setItem(CHAT_AUTOOPEN_SEEN_KEY, '1');
    } catch {
      // ignore
    }
  };

  const handleOpenChat = () => {
    markAutoOpenSeen();
    setIsOpen(true);
  };

  const handleCloseChat = () => {
    markAutoOpenSeen();
    setIsOpen(false);
  };

  const handleResetChat = () => {
    setMessages([initialGreeting]);
    setSessionId(createSessionId());
    setInquiryOpen(false);
    setInquiryResult(null);
  };

  const sendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const historyForServer = messages
      .filter((m) => m.id !== 'welcome-msg' && m.status !== 'ERROR')
      .slice(-6)
      .map((m) => ({
        role: m.role,
        text: m.text,
      }));

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setInquiryOpen(false);
    setInquiryResult(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          sessionId,
          history: historyForServer,
        }),
      });

      const data = (await res.json()) as {
        status?: 'ANSWERED' | 'UNKNOWN';
        reply?: string;
        error?: string;
        whatsappUrl?: string;
      };

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err_${Date.now()}`,
            role: 'assistant',
            text:
              data.error ||
              'Hazırda cavab vermək mümkün olmadı. Dəqiq məlumat üçün WhatsApp vasitəsilə əməkdaşlarımızla əlaqə saxlayın.',
            status: 'ERROR',
            whatsappUrl:
              data.whatsappUrl ||
              `${LINKS.whatsapp}?text=${encodeURIComponent(
                `Salam. FLASHLY FLEET saytındakı köməkçidən yazıram. Sualım: "${trimmed}"`
              )}`,
            sourceQuestion: trimmed,
          },
        ]);
        return;
      }

      const replyStatus = data.status === 'ANSWERED' ? 'ANSWERED' : 'UNKNOWN';
      setMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: 'assistant',
          text:
            data.reply ||
            'Bu sual barədə hazırda təsdiqlənmiş məlumatım yoxdur. Dəqiq məlumat üçün əməkdaşlarımızla əlaqə saxlayın.',
          status: replyStatus,
          whatsappUrl: data.whatsappUrl,
          sourceQuestion: trimmed,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          text: 'Şəbəkə bağlantısı zamanı xəta baş verdi. Zəhmət olmasa WhatsApp vasitəsilə əməkdaşlarımızla əlaqə saxlayın.',
          status: 'ERROR',
          whatsappUrl: `${LINKS.whatsapp}?text=${encodeURIComponent(
            `Salam. FLASHLY FLEET saytındakı köməkçidən yazıram. Sualım: "${trimmed}"`
          )}`,
          sourceQuestion: trimmed,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(inputValue);
  };

  const openInquiryForm = (sourceQuestion?: string) => {
    setInquirySourceQuestion(sourceQuestion || '');
    setInquiryMessage(sourceQuestion || '');
    setInquiryResult(null);
    setInquiryOpen(true);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim() || !inquiryMessage.trim()) {
      setInquiryResult({
        type: 'error',
        text: 'Zəhmət olmasa ad, telefon nömrəsi və mesaj sahələrini doldurun.',
      });
      return;
    }

    setInquirySubmitting(true);
    setInquiryResult(null);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inquiryName.trim(),
          phone: inquiryPhone.trim(),
          message: inquiryMessage.trim(),
          sourceQuestion: inquirySourceQuestion || undefined,
        }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok) {
        setInquiryResult({
          type: 'error',
          text: data.error || 'Müraciət göndərilərkən xəta baş verdi.',
        });
        return;
      }

      setInquiryResult({
        type: 'success',
        text: 'Müraciətiniz qeydə alındı! Əməkdaşlarımız sizinlə əlaqə saxlayacaq.',
      });
      setInquiryName('');
      setInquiryPhone('');
      setInquiryMessage('');
    } catch {
      setInquiryResult({
        type: 'error',
        text: 'Bağlantı xətası baş verdi. Zəhmət olmasa WhatsApp ilə əlaqə saxlayın.',
      });
    } finally {
      setInquirySubmitting(false);
    }
  };

  const showQuickPrompts = messages.length === 1 && !isLoading;

  return (
    <>
      {/* Persistent Bottom-Right Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpenChat}
          aria-label="FLASHLY FLEET KÖMƏKÇİSİ chatbotunu aç"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 inline-flex h-12 sm:h-14 items-center gap-2.5 rounded-full bg-[#0099C6] px-4 sm:px-5 text-[#F8FAFC] shadow-xl shadow-[#0B1B2B]/35 ring-2 ring-[#F8FAFC]/25 hover:bg-[#007FA6] hover:scale-[1.03] active:scale-95 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
        >
          <Bot className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" aria-hidden="true" />
          <span className="font-[var(--font-display)] text-xs sm:text-sm font-extrabold tracking-wide whitespace-nowrap">
            Köməkçi
          </span>
        </button>
      )}

      {/* Open Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="FLASHLY FLEET KÖMƏKÇİSİ"
          className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 flex h-[min(82vh,620px)] w-[calc(100vw-1.5rem)] sm:w-[400px] flex-col overflow-hidden rounded-3xl border border-[#0099C6]/40 bg-[#F8FAFC] dark:bg-[#1E293B] text-[#0B1B2B] dark:text-[#E2E8F0] shadow-2xl shadow-[#0B1B2B]/40"
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-[#0B1B2B] to-[#0E2A44] px-4 py-3.5 text-[#F8FAFC]">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0099C6] text-[#F8FAFC]">
                <Bot className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="font-[var(--font-display)] text-xs sm:text-sm font-extrabold tracking-wide text-[#F8FAFC] truncate">
                  FLASHLY FLEET KÖMƏKÇİSİ
                </h3>
                <p className="text-[11px] text-[#7DD3FC] truncate">
                  Təsdiqlənmiş rəsmi məlumat bazası
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleResetChat}
                aria-label="Söhbəti sıfırla"
                title="Yeni söhbət"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#F8FAFC]/10 text-[#F8FAFC] hover:bg-[#0099C6] transition-colors"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleCloseChat}
                aria-label="Köməkçini bağla"
                title="Bağla"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#F8FAFC]/10 text-[#F8FAFC] hover:bg-[#0099C6] transition-colors"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto bg-[#EEF2F6] dark:bg-[#0F172A] px-3.5 py-4 space-y-3">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const needsSupport =
                !isUser && (msg.status === 'UNKNOWN' || msg.status === 'ERROR');
              const isCourierRegPrompt =
                !isUser &&
                msg.status === 'ANSWERED' &&
                msg.sourceQuestion === 'Kuryer olmaq istəyirəm.';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? 'rounded-br-sm bg-[#0099C6] text-[#F8FAFC] font-medium'
                        : 'rounded-bl-sm border border-[#0099C6]/20 bg-[#F8FAFC] dark:bg-[#1E293B] text-[#0B1B2B] dark:text-[#E2E8F0]'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {isCourierRegPrompt && (
                      <div className="mt-3 border-t border-[#0099C6]/20 pt-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            openRegistrationModal();
                          }}
                          className="inline-flex min-h-[38px] w-full items-center justify-center gap-1.5 rounded-xl bg-[#0099C6] px-3 py-2 text-xs font-extrabold text-[#F8FAFC] hover:bg-[#007FA6] transition-colors"
                        >
                          <span>Kuryer kimi qeydiyyatdan keç</span>
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        </button>
                      </div>
                    )}

                    {needsSupport && (
                      <div className="mt-3 space-y-2 border-t border-[#0099C6]/20 pt-2.5">
                        <a
                          href={
                            msg.whatsappUrl ||
                            `${LINKS.whatsapp}?text=${encodeURIComponent(
                              'Salam. FLASHLY FLEET saytındakı köməkçidən yazıram. Dəqiq məlumat almaq istəyirəm.'
                            )}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-2 text-xs font-extrabold text-[#0B1B2B] shadow-xs hover:bg-[#20bd5a] transition-colors"
                        >
                          <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <span>WhatsApp ({OFFICE_INFO.whatsappDisplay})</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => openInquiryForm(msg.sourceQuestion)}
                          className="inline-flex min-h-[36px] w-full items-center justify-center gap-1.5 rounded-xl border border-[#0099C6]/35 bg-[#E4F4FA] dark:bg-[#0F172A] px-3 py-1.5 text-xs font-bold text-[#0B1B2B] dark:text-[#E2E8F0] hover:border-[#0099C6] transition-colors"
                        >
                          <UserPlus className="h-3.5 w-3.5 shrink-0 text-[#0099C6]" aria-hidden="true" />
                          <span>Əməkdaşa müraciət göndər</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start">
                <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-sm border border-[#0099C6]/20 bg-[#F8FAFC] dark:bg-[#1E293B] px-3.5 py-2.5 text-xs font-semibold text-[#334155] dark:text-[#CBD5E1]">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0099C6]" aria-hidden="true" />
                  <span>Cavab hazırlanır...</span>
                </div>
              </div>
            )}

            {showQuickPrompts && (
              <div className="pt-1 space-y-1.5">
                <p className="text-[11px] font-bold text-[#334155] dark:text-[#CBD5E1] px-0.5">
                  İlkin seçimlər:
                </p>
                <div className="flex flex-col gap-1.5">
                  {QUICK_PROMPTS.map((q, idx) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => void sendMessage(q)}
                      className="rounded-xl border border-[#0099C6]/30 bg-[#F8FAFC] dark:bg-[#1E293B] px-3 py-2 text-left text-xs font-semibold text-[#0B1B2B] dark:text-[#E2E8F0] hover:border-[#0099C6] hover:bg-[#E4F4FA] dark:hover:bg-[#0F172A] transition-colors"
                    >
                      <span className="font-extrabold text-[#0099C6] mr-1.5">
                        {idx + 1}.
                      </span>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Inline User Inquiry Form */}
            {inquiryOpen && (
              <div className="rounded-2xl border border-[#0099C6]/35 bg-[#F8FAFC] dark:bg-[#1E293B] p-3.5 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-[var(--font-display)] text-xs font-extrabold text-[#0B1B2B] dark:text-[#E2E8F0]">
                    Əməkdaşa Birbaşa Müraciət
                  </p>
                  <button
                    type="button"
                    onClick={() => setInquiryOpen(false)}
                    aria-label="Müraciət formasını bağla"
                    className="text-[#334155] dark:text-[#CBD5E1] hover:text-[#0099C6]"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                {inquiryResult?.type === 'success' ? (
                  <div className="mt-2.5 flex items-start gap-2 rounded-xl bg-[#E4F4FA] dark:bg-[#0F172A] p-3 text-xs font-semibold text-[#0B1B2B] dark:text-[#E2E8F0]">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0099C6] mt-0.5" aria-hidden="true" />
                    <span>{inquiryResult.text}</span>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="mt-2.5 space-y-2">
                    <input
                      type="text"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder="Adınız və soyadınız"
                      className="w-full rounded-xl border border-[#0099C6]/30 bg-[#EEF2F6] dark:bg-[#0F172A] px-3 py-2 text-xs text-[#0B1B2B] dark:text-[#E2E8F0] focus:border-[#0099C6] focus:outline-none"
                    />
                    <input
                      type="tel"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      placeholder="Əlaqə nömrəsi (+994...)"
                      className="w-full rounded-xl border border-[#0099C6]/30 bg-[#EEF2F6] dark:bg-[#0F172A] px-3 py-2 text-xs text-[#0B1B2B] dark:text-[#E2E8F0] focus:border-[#0099C6] focus:outline-none"
                    />
                    <textarea
                      rows={2}
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      placeholder="Sualınız və ya müraciətiniz"
                      className="w-full rounded-xl border border-[#0099C6]/30 bg-[#EEF2F6] dark:bg-[#0F172A] px-3 py-2 text-xs text-[#0B1B2B] dark:text-[#E2E8F0] focus:border-[#0099C6] focus:outline-none resize-none"
                    />
                    {inquiryResult?.type === 'error' && (
                      <p className="text-[11px] font-semibold text-[#B91C1C] dark:text-[#FCA5A5]">
                        {inquiryResult.text}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={inquirySubmitting}
                      className="inline-flex min-h-[38px] w-full items-center justify-center gap-1.5 rounded-xl bg-[#0099C6] px-3 py-2 text-xs font-bold text-[#F8FAFC] hover:bg-[#007FA6] disabled:opacity-60 transition-colors"
                    >
                      {inquirySubmitting ? 'Göndərilir...' : 'Müraciəti Göndər'}
                    </button>
                  </form>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleFormSubmit}
            className="border-t border-[#0099C6]/20 bg-[#F8FAFC] dark:bg-[#1E293B] p-3"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Sualınızı yazın..."
                disabled={isLoading}
                className="min-h-[42px] flex-1 rounded-xl border border-[#0099C6]/30 bg-[#EEF2F6] dark:bg-[#0F172A] px-3.5 py-2 text-xs sm:text-sm text-[#0B1B2B] dark:text-[#E2E8F0] placeholder:text-[#64748B] focus:border-[#0099C6] focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                aria-label="Mesajı göndər"
                className="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-[#0099C6] text-[#F8FAFC] hover:bg-[#007FA6] disabled:opacity-50 transition-colors"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-[#334155] dark:text-[#CBD5E1]">
              <button
                type="button"
                onClick={() => openInquiryForm()}
                className="font-semibold text-[#0099C6] hover:underline"
              >
                Əməkdaşa müraciət göndər
              </button>
              <a
                href={LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#16A34A] dark:text-[#4ADE80] hover:underline"
              >
                WhatsApp: {OFFICE_INFO.whatsappDisplay}
              </a>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
