import React from 'react';
import { Camera, ArrowUpRight } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { WhatsAppIcon } from './WhatsAppIcon';
import { LINKS } from '../data/fleetData';

const INSTAGRAM_BONUS_WHATSAPP_URL = `${LINKS.whatsapp}?text=${encodeURIComponent(
  'Salam! Instagram-da sizi izlədim, bonusumu almaq istəyirəm 📸'
)}`;

export const InstagramBonusSection: React.FC = () => {
  return (
    <section
      id="instagram-bonus"
      className="border-b border-[#0099C6]/20 bg-[#F1F5F9] dark:bg-[#0F172A] py-14 sm:py-20 transition-colors"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Soft Wolt Blue Gradient Outer Frame */}
        <div className="rounded-3xl bg-gradient-to-tr from-[#0099C6] to-[#007FA6] p-[3px] shadow-xl shadow-[#0B1B2B]/10">
          {/* Soft Card Surface */}
          <div className="rounded-[21px] bg-[#F8FAFC] dark:bg-[#1E293B] px-5 py-8 sm:px-10 sm:py-10 text-[#0B1B2B] dark:text-[#E2E8F0] transition-colors">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-[#0099C6]">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#E4F4FA] dark:bg-[#0F172A]">
                  <InstagramIcon className="h-5 w-5 shrink-0" />
                </span>
                <span>{LINKS.instagramHandle}</span>
              </div>

              <h2
                className="mt-2 font-[var(--font-display)] font-extrabold tracking-tight text-[#0B1B2B] dark:text-[#E2E8F0] text-balance"
                style={{ fontSize: 'clamp(1.625rem, 3vw, 2.25rem)' }}
              >
                📸 Instagram-da İzlə, Bonusu Qazan!
              </h2>

              <p className="mt-2.5 text-sm sm:text-base font-medium text-[#334155] dark:text-[#CBD5E1]">
                Wolt Qeydiyyatı Instagram səhifəsini izləyənlərə özəl üstünlük!
              </p>
            </div>

            {/* 3-Step Grid */}
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Step 1 */}
              <div className="flex flex-col justify-between rounded-2xl border border-[#0099C6]/25 bg-[#EEF2F6] dark:bg-[#0F172A] p-5">
                <div>
                  <span className="font-[var(--font-display)] text-xs font-extrabold tracking-wider text-[#0099C6]">
                    1-ci ADDIM
                  </span>
                  <h3 className="mt-2 font-[var(--font-display)] text-base sm:text-lg font-bold text-[#0B1B2B] dark:text-[#E2E8F0] leading-snug">
                    Düyməyə basıb Instagram səhifəmizi izlə
                  </h3>
                </div>

                <a
                  href={LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#0099C6] px-4 py-3 text-sm font-bold text-[#F8FAFC] shadow-sm hover:bg-[#007FA6] active:scale-[0.99] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
                >
                  <InstagramIcon className="h-5 w-5 shrink-0" />
                  <span className="truncate">
                    {LINKS.instagramHandle} - Instagram-da İzlə
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </a>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col justify-between rounded-2xl border border-[#0099C6]/25 bg-[#EEF2F6] dark:bg-[#0F172A] p-5">
                <div>
                  <span className="font-[var(--font-display)] text-xs font-extrabold tracking-wider text-[#0099C6]">
                    2-ci ADDIM
                  </span>
                  <h3 className="mt-2 font-[var(--font-display)] text-base sm:text-lg font-bold text-[#0B1B2B] dark:text-[#E2E8F0] leading-snug">
                    İzlədiyinə dair screenshot çək
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                    Səhifəni izlədiyiniz görünən ekran görüntüsünü (screenshot) yadda saxlayın.
                  </p>
                </div>

                <div className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-[#0099C6]/35 bg-[#F8FAFC] dark:bg-[#1E293B] px-4 py-3 text-sm font-bold text-[#0B1B2B] dark:text-[#E2E8F0]">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#E4F4FA] dark:bg-[#0F172A] text-[#0099C6]">
                    <Camera className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </span>
                  <span>Ekran görüntüsü çək</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col justify-between rounded-2xl border border-[#0099C6]/25 bg-[#EEF2F6] dark:bg-[#0F172A] p-5">
                <div>
                  <span className="font-[var(--font-display)] text-xs font-extrabold tracking-wider text-[#0099C6]">
                    3-cü ADDIM
                  </span>
                  <h3 className="mt-2 font-[var(--font-display)] text-base sm:text-lg font-bold text-[#0B1B2B] dark:text-[#E2E8F0] leading-snug">
                    Screenshot-u WhatsApp-a göndər
                  </h3>
                </div>

                <a
                  href={INSTAGRAM_BONUS_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-[#0B1B2B] shadow-sm hover:bg-[#20bd5a] active:scale-[0.99] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  <WhatsAppIcon variant="glyph" className="h-5 w-5 shrink-0" />
                  <span>Screenshot-u Göndər - WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Bottom Soft Light-Blue Bonus Box */}
            <div className="mt-6 rounded-2xl border-2 border-[#0099C6] bg-[#E4F4FA] dark:bg-[#0F172A] px-4 py-4 sm:px-6 sm:py-5 text-center">
              <p className="font-[var(--font-display)] text-sm sm:text-base font-extrabold text-[#0B1B2B] dark:text-[#E2E8F0] leading-snug">
                🎁 BONUS: İzləyib screenshot göndərənlər qeydiyyatda 1-ci növbəyə keçir + sənəd köməyi PULSUZDUR!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
