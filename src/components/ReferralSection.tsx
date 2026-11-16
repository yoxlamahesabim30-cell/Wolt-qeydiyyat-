import React, { useState } from 'react';
import { Check, Copy, MessageCircle } from 'lucide-react';

const REFERRAL_STEPS = [
  {
    number: '01',
    text: 'Dostuna saytın linkini göndər',
  },
  {
    number: '02',
    text: 'Dostun qeydiyyatdan keçsin',
  },
  {
    number: '03',
    text: 'Dostun işə başlayanda SƏN bonus qazanırsan',
  },
] as const;

export const ReferralSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const siteUrl =
    typeof window !== 'undefined' ? window.location.origin : 'https://flashlyfleet.az';

  const shareText = `Qaqa bax buna, Wolt-da kuryer qeydiyyatı pulsuzdur, mən də qeydiyyatdan keçdim, sən də keç, birlikdə qazanaq! Link burdadır: ${siteUrl}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(siteUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = siteUrl;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      id="dostunu-getir"
      className="border-b border-[#0099C6]/20 bg-[#F1F5F9] dark:bg-[#0F172A] py-14 sm:py-20 transition-colors"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="wolt-card rounded-3xl p-6 sm:p-10">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm font-bold text-[#0099C6]">
              Tövsiyə Proqramı
            </p>
            <h2
              className="mt-2 font-[var(--font-display)] font-extrabold tracking-tight text-[#0B1B2B] dark:text-[#E2E8F0] text-balance"
              style={{ fontSize: 'clamp(1.625rem, 3vw, 2.25rem)' }}
            >
              🤝 Dostunu Gətir, Bonus Qazan!
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-[#334155] dark:text-[#CBD5E1]">
              Qazanmağı tək yemə, dostunla bölüş!
            </p>
          </div>

          {/* 3 Steps */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {REFERRAL_STEPS.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-[#0099C6]/25 bg-[#EEF2F6] dark:bg-[#0F172A] p-5"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F8FAFC] dark:bg-[#1E293B] font-[var(--font-display)] text-xs font-extrabold text-[#0099C6] tabular-nums shadow-xs">
                  {step.number}
                </span>
                <p className="mt-3 font-[var(--font-display)] text-base font-bold text-[#0B1B2B] dark:text-[#E2E8F0] leading-snug">
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          {/* 2 Action Buttons */}
          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#0099C6] px-5 py-3 text-sm sm:text-base font-bold text-[#F8FAFC] shadow-sm hover:bg-[#007FA6] active:scale-[0.99] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5 shrink-0 text-[#F8FAFC]" aria-hidden="true" />
                  <span>Link Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>Linki Kopyala</span>
                </>
              )}
            </button>

            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm sm:text-base font-bold text-[#0B1B2B] shadow-sm hover:bg-[#20bd5a] active:scale-[0.99] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>WhatsApp-da Paylaş</span>
            </a>
          </div>

          {/* Bottom Soft Light-Blue Bonus Box */}
          <div className="mt-6 rounded-2xl border-2 border-[#0099C6] bg-[#E4F4FA] dark:bg-[#0F172A] px-4 py-4 sm:px-6 sm:py-5 text-center">
            <p className="font-[var(--font-display)] text-sm sm:text-base font-extrabold text-[#0B1B2B] dark:text-[#E2E8F0] leading-snug">
              🎁 Hər gətirdiyin dost üçün sənə BONUS düşür! Nə qədər çox dost, o qədər çox bonus!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
