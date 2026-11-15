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
      className="corporate-gradient border-b border-blue-400/15 py-14 sm:py-20"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="card-surface rounded-3xl p-6 sm:p-10">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm font-semibold text-sky-400">
              Tövsiyə Proqramı
            </p>
            <h2
              className="mt-2 font-[var(--font-display)] font-extrabold tracking-tight text-white text-balance"
              style={{ fontSize: 'clamp(1.625rem, 3vw, 2.25rem)' }}
            >
              🤝 Dostunu Gətir, Bonus Qazan!
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-slate-300">
              Qazanmağı tək yemə, dostunla bölüş!
            </p>
          </div>

          {/* 3 Steps */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {REFERRAL_STEPS.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-blue-400/20 bg-[#040b1a]/80 p-5"
              >
                <span className="font-[var(--font-display)] text-sm font-extrabold text-sky-400 tabular-nums">
                  {step.number}.
                </span>
                <p className="mt-2 font-[var(--font-display)] text-base font-bold text-white leading-snug">
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
              className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl border border-sky-400/40 bg-blue-600 px-5 py-3 text-sm sm:text-base font-bold text-white shadow-md hover:bg-blue-500 active:scale-[0.99] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5 shrink-0 text-yellow-300" aria-hidden="true" />
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
              className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm sm:text-base font-bold text-slate-950 shadow-md hover:bg-[#20bd5a] active:scale-[0.99] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
            >
              <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>WhatsApp-da Paylaş</span>
            </a>
          </div>

          {/* Bottom Yellow Bonus Box */}
          <div className="mt-6 rounded-2xl border border-yellow-400/70 bg-yellow-400 px-4 py-4 sm:px-6 sm:py-5 text-center">
            <p className="font-[var(--font-display)] text-sm sm:text-base font-extrabold text-slate-950 leading-snug">
              🎁 Hər gətirdiyin dost üçün sənə BONUS düşür! Nə qədər çox dost, o qədər çox bonus!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
