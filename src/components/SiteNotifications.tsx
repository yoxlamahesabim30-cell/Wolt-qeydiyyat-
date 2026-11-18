import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, MessageSquareText, X } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { LINKS } from '../data/fleetData';
import { useRegistrationModal } from '../context/RegistrationModalContext';

type ActiveNotification = 'instagram' | 'chatbot' | null;

interface SiteNotificationsProps {
  isChatOpen: boolean;
  onOpenChatbot: () => void;
}

const SESSION_IG_KEY = 'flashly_notif_ig_done';
const SESSION_CHAT_KEY = 'flashly_notif_chat_done';

const IG_INITIAL_DELAY_MS = 5000;
const NOTIFICATION_DURATION_MS = 8000;
const BETWEEN_DELAY_MS = 10000;

function readSessionFlag(key: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function writeSessionFlag(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(key, '1');
  } catch {
    // ignore storage quota errors
  }
}

export const SiteNotifications: React.FC<SiteNotificationsProps> = ({
  isChatOpen,
  onOpenChatbot,
}) => {
  const { isOpen: isRegistrationOpen } = useRegistrationModal();
  const [activeNotification, setActiveNotification] = useState<ActiveNotification>(null);

  const primaryTimerRef = useRef<number | null>(null);
  const secondaryTimerRef = useRef<number | null>(null);
  const isChatOpenRef = useRef(isChatOpen);
  const isRegOpenRef = useRef(isRegistrationOpen);

  useEffect(() => {
    isChatOpenRef.current = isChatOpen;
    if (isChatOpen) {
      writeSessionFlag(SESSION_CHAT_KEY);
      setActiveNotification((prev) => (prev === 'chatbot' ? null : prev));
    }
  }, [isChatOpen]);

  useEffect(() => {
    isRegOpenRef.current = isRegistrationOpen;
    if (isRegistrationOpen && activeNotification) {
      // Clear active toast politely if user opened a registration dialog
      if (activeNotification === 'instagram') {
        writeSessionFlag(SESSION_IG_KEY);
      } else if (activeNotification === 'chatbot') {
        writeSessionFlag(SESSION_CHAT_KEY);
      }
      setActiveNotification(null);
    }
  }, [isRegistrationOpen, activeNotification]);

  const clearTimers = useCallback(() => {
    if (primaryTimerRef.current !== null) {
      window.clearTimeout(primaryTimerRef.current);
      primaryTimerRef.current = null;
    }
    if (secondaryTimerRef.current !== null) {
      window.clearTimeout(secondaryTimerRef.current);
      secondaryTimerRef.current = null;
    }
  }, []);

  const scheduleChatbotNotification = useCallback(() => {
    if (readSessionFlag(SESSION_CHAT_KEY) || isChatOpenRef.current) {
      return;
    }

    if (secondaryTimerRef.current !== null) {
      window.clearTimeout(secondaryTimerRef.current);
    }

    secondaryTimerRef.current = window.setTimeout(() => {
      if (readSessionFlag(SESSION_CHAT_KEY) || isChatOpenRef.current || isRegOpenRef.current) {
        return;
      }

      writeSessionFlag(SESSION_CHAT_KEY);
      setActiveNotification('chatbot');

      if (primaryTimerRef.current !== null) {
        window.clearTimeout(primaryTimerRef.current);
      }
      primaryTimerRef.current = window.setTimeout(() => {
        setActiveNotification((prev) => (prev === 'chatbot' ? null : prev));
      }, NOTIFICATION_DURATION_MS);
    }, BETWEEN_DELAY_MS);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const igDone = readSessionFlag(SESSION_IG_KEY);
    const chatDone = readSessionFlag(SESSION_CHAT_KEY);

    if (!igDone) {
      primaryTimerRef.current = window.setTimeout(() => {
        if (isRegOpenRef.current) {
          writeSessionFlag(SESSION_IG_KEY);
          scheduleChatbotNotification();
          return;
        }

        writeSessionFlag(SESSION_IG_KEY);
        setActiveNotification('instagram');

        primaryTimerRef.current = window.setTimeout(() => {
          setActiveNotification((prev) => (prev === 'instagram' ? null : prev));
          scheduleChatbotNotification();
        }, NOTIFICATION_DURATION_MS);
      }, IG_INITIAL_DELAY_MS);
    } else if (!chatDone) {
      scheduleChatbotNotification();
    }

    return () => {
      clearTimers();
    };
  }, [clearTimers, scheduleChatbotNotification]);

  const handleCloseInstagram = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    writeSessionFlag(SESSION_IG_KEY);
    if (primaryTimerRef.current !== null) {
      window.clearTimeout(primaryTimerRef.current);
      primaryTimerRef.current = null;
    }
    setActiveNotification(null);
    scheduleChatbotNotification();
  };

  const handleInstagramAction = () => {
    writeSessionFlag(SESSION_IG_KEY);
    if (primaryTimerRef.current !== null) {
      window.clearTimeout(primaryTimerRef.current);
      primaryTimerRef.current = null;
    }
    setActiveNotification(null);
    scheduleChatbotNotification();
  };

  const handleCloseChatbot = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    writeSessionFlag(SESSION_CHAT_KEY);
    if (primaryTimerRef.current !== null) {
      window.clearTimeout(primaryTimerRef.current);
      primaryTimerRef.current = null;
    }
    setActiveNotification(null);
  };

  const handleOpenChatbot = () => {
    writeSessionFlag(SESSION_CHAT_KEY);
    if (primaryTimerRef.current !== null) {
      window.clearTimeout(primaryTimerRef.current);
      primaryTimerRef.current = null;
    }
    setActiveNotification(null);
    onOpenChatbot();
  };

  if (!activeNotification || isRegistrationOpen) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-[4.5rem] left-3 right-3 sm:top-auto sm:left-6 sm:right-auto sm:bottom-6 sm:w-[368px] z-40 pointer-events-none"
    >
      {activeNotification === 'instagram' && (
        <a
          href={LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleInstagramAction}
          className="pointer-events-auto group relative block overflow-hidden rounded-2xl border border-[#0099C6]/35 bg-[#F8FAFC]/98 dark:bg-[#1E293B]/98 p-4 text-[#0B1B2B] dark:text-[#E2E8F0] shadow-2xl shadow-[#0B1B2B]/25 backdrop-blur-md transition-all hover:border-[#0099C6]"
        >
          <button
            type="button"
            onClick={handleCloseInstagram}
            aria-label="Instagram bildirişini bağla"
            title="Bağla"
            className="absolute right-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#475569] dark:text-[#CBD5E1] hover:bg-[#E4F4FA] dark:hover:bg-[#0F172A] hover:text-[#0B1B2B] dark:hover:text-[#F8FAFC] transition-colors"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="flex items-start gap-3.5 pr-7">
            <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF2F6] dark:bg-[#0F172A] p-1.5 shadow-xs">
              <InstagramIcon className="h-8 w-8" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-[var(--font-display)] text-sm font-extrabold text-[#0B1B2B] dark:text-[#E2E8F0] leading-snug">
                FLASHLY FLEET – Bizi Instagram-da izləyin!
              </p>
              <p className="mt-1 text-xs text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                Yeniliklər, kuryer məlumatları və kampaniyalardan xəbərdar olun.
              </p>

              <div className="mt-3 inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-xl bg-[#0099C6] px-3.5 py-1.5 text-xs font-extrabold text-[#F8FAFC] shadow-sm group-hover:bg-[#007FA6] transition-colors">
                <InstagramIcon className="h-4 w-4 shrink-0" />
                <span>Instagram-da bizi izlə</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </div>
            </div>
          </div>
        </a>
      )}

      {activeNotification === 'chatbot' && (
        <div
          role="button"
          tabIndex={0}
          onClick={handleOpenChatbot}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOpenChatbot();
            }
          }}
          className="pointer-events-auto group relative cursor-pointer overflow-hidden rounded-2xl border border-[#0099C6]/40 bg-[#F8FAFC]/98 dark:bg-[#1E293B]/98 p-4 text-[#0B1B2B] dark:text-[#E2E8F0] shadow-2xl shadow-[#0B1B2B]/25 backdrop-blur-md transition-all hover:border-[#0099C6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
        >
          <button
            type="button"
            onClick={handleCloseChatbot}
            aria-label="Köməkçi bildirişini bağla"
            title="Bağla"
            className="absolute right-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#475569] dark:text-[#CBD5E1] hover:bg-[#E4F4FA] dark:hover:bg-[#0F172A] hover:text-[#0B1B2B] dark:hover:text-[#F8FAFC] transition-colors"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="flex items-start gap-3.5 pr-7">
            <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0099C6] text-[#F8FAFC] shadow-sm">
              <MessageSquareText className="h-5 w-5" aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-[var(--font-display)] text-sm font-extrabold text-[#0B1B2B] dark:text-[#E2E8F0] leading-snug">
                FLASHLY FLEET köməkçisi
              </p>
              <p className="mt-1 text-xs text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                Sualınız var? Sizə kömək etməyə hazırıq. Bizimlə yazışın!
              </p>

              <span className="mt-3 inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-xl bg-[#0099C6] px-3.5 py-1.5 text-xs font-extrabold text-[#F8FAFC] shadow-sm group-hover:bg-[#007FA6] transition-colors">
                <MessageSquareText className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Söhbətə başla</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
