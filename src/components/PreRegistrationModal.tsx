import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react';
import { LINKS, OFFICE_INFO } from '../data/fleetData';
import { useSiteConfig } from '../context/SiteConfigContext';

interface PreRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalStep = 'question' | 'previous-courier';

const PREVIOUS_COURIER_WHATSAPP_MESSAGE =
  'Salam. Mən əvvəllər Wolt platformasında qeydiyyatdan keçmişəm və ya kuryer kimi fəaliyyət göstərmişəm. FLASHLY FLEET komandası ilə əvvəlki qeydiyyatımla bağlı məlumat almaq və yenidən fəaliyyətə başlamaq istəyirəm. Zəhmət olmasa, mənə kömək edin.';

const PREVIOUS_COURIER_WHATSAPP_URL = `${LINKS.whatsapp}?text=${encodeURIComponent(
  PREVIOUS_COURIER_WHATSAPP_MESSAGE
)}`;

export const PreRegistrationModal: React.FC<PreRegistrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { activeRefCode } = useSiteConfig();
  const [step, setStep] = useState<ModalStep>('question');

  useEffect(() => {
    if (!isOpen) return;
    setStep('question');

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6 bg-[#0B1B2B]/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pre-reg-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border border-[#0099C6]/35 bg-[#F8FAFC] dark:bg-[#1E293B] text-[#0B1B2B] dark:text-[#E2E8F0] shadow-2xl shadow-[#0B1B2B]/40 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Branded Header Bar */}
        <div className="flex items-center justify-between gap-3 border-b border-[#0099C6]/20 bg-gradient-to-r from-[#0B1B2B] to-[#0E2A44] px-5 py-4 sm:px-7 sm:py-5 text-[#F8FAFC] rounded-t-3xl">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0099C6] text-[#F8FAFC] shadow-sm">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#7DD3FC]">
                FLASHLY FLEET
              </p>
              <h2
                id="pre-reg-modal-title"
                className="font-[var(--font-display)] text-base sm:text-xl font-extrabold text-[#F8FAFC] truncate"
              >
                Wolt kuryer qeydiyyatı
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Pəncərəni bağla"
            title="Bağla"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#F8FAFC]/20 bg-[#F8FAFC]/10 text-[#F8FAFC] hover:bg-[#0099C6] hover:border-[#0099C6] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-7">
          {step === 'question' ? (
            <div>
              <div className="rounded-2xl border border-[#0099C6]/25 bg-[#E4F4FA] dark:bg-[#0F172A] p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0099C6] text-[#F8FAFC]">
                    <HelpCircle className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="font-[var(--font-display)] text-base sm:text-lg font-extrabold text-[#0B1B2B] dark:text-[#E2E8F0] leading-snug">
                    Wolt platformasında ilk dəfə kuryer kimi qeydiyyatdan keçmək istəyirsiniz?
                  </p>
                </div>
              </div>

              {activeRefCode && (
                <div className="mt-3 rounded-xl border border-[#0099C6]/35 bg-[#EEF2F6] dark:bg-[#0F172A] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-[#334155] dark:text-[#CBD5E1]">
                    Aktiv dəvət kodu:{' '}
                    <strong className="text-[#0099C6]">{activeRefCode}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      const el = document.getElementById('dostunu-getir');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="font-bold text-[#0099C6] hover:underline"
                  >
                    Dəvəti qeyd et →
                  </button>
                </div>
              )}

              <div className="mt-5 space-y-3.5">
                {/* Option 1: Yes, first time -> Opens Registration Form */}
                <a
                  href={LINKS.registration}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="group flex min-h-[68px] w-full items-center justify-between gap-3 rounded-2xl bg-[#0099C6] px-5 py-4 text-left text-[#F8FAFC] shadow-md shadow-[#0099C6]/25 hover:bg-[#007FA6] active:scale-[0.99] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8FAFC]/15 text-[#F8FAFC]">
                      <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-[var(--font-display)] text-sm sm:text-base font-extrabold leading-snug">
                      BƏLİ, İLK DƏFƏ QEYDİYYATDAN KEÇİRƏM
                    </span>
                  </div>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>

                {/* Option 2: No, previously registered/worked -> Shows Support Screen */}
                <button
                  type="button"
                  onClick={() => setStep('previous-courier')}
                  className="group flex min-h-[68px] w-full items-center justify-between gap-3 rounded-2xl border-2 border-[#0B1B2B]/20 dark:border-[#0099C6]/40 bg-[#EEF2F6] dark:bg-[#0F172A] px-5 py-4 text-left text-[#0B1B2B] dark:text-[#E2E8F0] hover:border-[#0099C6] hover:bg-[#E4F4FA] dark:hover:bg-[#0F172A]/80 active:scale-[0.99] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B1B2B] dark:bg-[#1E293B] text-[#F8FAFC]">
                      <UserCheck className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-[var(--font-display)] text-sm sm:text-base font-extrabold leading-snug">
                      XEYR, ƏVVƏLLƏR QEYDİYYATDAN KEÇMİŞƏM VƏ YA WOLT-DA İŞLƏMİŞƏM
                    </span>
                  </div>
                </button>
              </div>

              <div className="mt-6 flex items-center justify-end border-t border-[#0099C6]/15 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex min-h-[42px] items-center justify-center rounded-xl border border-[#0B1B2B]/15 dark:border-[#E2E8F0]/20 px-4 py-2 text-xs sm:text-sm font-bold text-[#334155] dark:text-[#CBD5E1] hover:bg-[#EEF2F6] dark:hover:bg-[#0F172A] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
                >
                  Bağla
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="rounded-2xl border border-[#0099C6]/30 bg-[#EEF2F6] dark:bg-[#0F172A] p-5 sm:p-6">
                <span className="inline-flex items-center gap-2 rounded-lg bg-[#0099C6]/15 px-3 py-1 text-xs font-bold text-[#0099C6]">
                  <UserCheck className="h-4 w-4" aria-hidden="true" />
                  <span>FLASHLY FLEET Dəstək</span>
                </span>

                <h3 className="mt-3 font-[var(--font-display)] text-lg sm:text-xl font-extrabold text-[#0B1B2B] dark:text-[#E2E8F0]">
                  Əvvəlki qeydiyyatla bağlı dəstək
                </h3>

                <p className="mt-3 text-sm sm:text-base text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                  Əgər əvvəllər Wolt platformasında qeydiyyatdan keçmisinizsə və ya kuryer kimi fəaliyyət göstərmisinizsə, yeni qeydiyyat yaratmadan əvvəl komandamızla əlaqə saxlayın.
                </p>

                <p className="mt-3 text-sm sm:text-base font-semibold text-[#0B1B2B] dark:text-[#E2E8F0] leading-relaxed">
                  Müraciətiniz yoxlanılacaq və sizə növbəti addımlar barədə məlumat veriləcək.
                </p>

                <div className="mt-4 rounded-xl border border-[#0099C6]/25 bg-[#F8FAFC] dark:bg-[#1E293B] px-4 py-3 text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] flex items-center justify-between gap-2">
                  <span>Dəstək WhatsApp nömrəsi:</span>
                  <span className="font-[var(--font-display)] font-extrabold text-[#0B1B2B] dark:text-[#E2E8F0] tabular-nums">
                    {OFFICE_INFO.whatsappDisplay}
                  </span>
                </div>
              </div>

              {/* WhatsApp Direct CTA */}
              <div className="mt-5">
                <a
                  href={PREVIOUS_COURIER_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] px-6 py-3.5 text-sm sm:text-base font-extrabold text-[#0B1B2B] shadow-md shadow-[#25D366]/25 hover:bg-[#20bd5a] active:scale-[0.99] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>WhatsApp ilə əlaqə saxla</span>
                </a>
              </div>

              {/* Navigation Footer: Back & Close */}
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#0099C6]/15 pt-4">
                <button
                  type="button"
                  onClick={() => setStep('question')}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[#0099C6]/35 bg-[#E4F4FA] dark:bg-[#0F172A] px-4 py-2.5 text-xs sm:text-sm font-bold text-[#0B1B2B] dark:text-[#E2E8F0] hover:border-[#0099C6] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
                >
                  <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Geri qayıt</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#0B1B2B]/15 dark:border-[#E2E8F0]/20 px-4 py-2.5 text-xs sm:text-sm font-bold text-[#334155] dark:text-[#CBD5E1] hover:bg-[#EEF2F6] dark:hover:bg-[#0F172A] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
                >
                  Bağla
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
