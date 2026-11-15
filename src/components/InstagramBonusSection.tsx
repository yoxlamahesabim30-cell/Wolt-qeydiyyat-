import React from 'react';
import { Camera, MessageCircle, ArrowUpRight } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { LINKS } from '../data/fleetData';

const INSTAGRAM_BONUS_WHATSAPP_URL = `${LINKS.whatsapp}?text=${encodeURIComponent(
  'Salam! Instagram-da sizi izlədim, bonusumu almaq istəyirəm 📸'
)}`;

export const InstagramBonusSection: React.FC = () => {
  return (
    <section
      id="instagram-bonus"
      className="border-b border-blue-400/15 bg-[#050d1f] py-14 sm:py-20"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Purple-Pink Instagram Gradient Outer Frame */}
        <div className="rounded-3xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] p-[3px] shadow-2xl shadow-pink-950/30">
          {/* Crisp White Instagram-style Inner Surface */}
          <div className="rounded-[21px] bg-white px-5 py-8 sm:px-10 sm:py-10 text-slate-900">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-[#DD2A7B]">
                <InstagramIcon className="h-5 w-5 shrink-0" />
                <span>@woltqeydiyyati</span>
              </div>

              <h2
                className="mt-2 font-[var(--font-display)] font-extrabold tracking-tight text-slate-900 text-balance"
                style={{ fontSize: 'clamp(1.625rem, 3vw, 2.25rem)' }}
              >
                📸 Instagram-da İzlə, Bonusu Qazan!
              </h2>

              <p className="mt-2.5 text-sm sm:text-base font-medium text-slate-600">
                Wolt Qeydiyyatı Instagram səhifəsini izləyənlərə özəl üstünlük!
              </p>
            </div>

            {/* 3-Step Grid */}
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Step 1 */}
              <div className="flex flex-col justify-between rounded-2xl border border-pink-200 bg-gradient-to-b from-pink-50/70 to-white p-5">
                <div>
                  <span className="font-[var(--font-display)] text-xs font-extrabold tracking-wider text-[#DD2A7B]">
                    1-ci ADDIM
                  </span>
                  <h3 className="mt-2 font-[var(--font-display)] text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    Düyməyə basıb Instagram səhifəmizi izlə
                  </h3>
                </div>

                <a
                  href="https://instagram.com/woltqeydiyyati"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#DD2A7B] to-[#F58529] px-4 py-3 text-sm font-bold text-white shadow-md hover:opacity-95 active:scale-[0.99] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DD2A7B]"
                >
                  <InstagramIcon className="h-5 w-5 shrink-0" />
                  <span className="truncate">@woltqeydiyyati - Instagram-da İzlə</span>
                  <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </a>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col justify-between rounded-2xl border border-purple-200 bg-gradient-to-b from-purple-50/70 to-white p-5">
                <div>
                  <span className="font-[var(--font-display)] text-xs font-extrabold tracking-wider text-[#8134AF]">
                    2-ci ADDIM
                  </span>
                  <h3 className="mt-2 font-[var(--font-display)] text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    İzlədiyinə dair screenshot çək
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Səhifəni izlədiyiniz görünən ekran görüntüsünü (screenshot) yadda saxlayın.
                  </p>
                </div>

                <div className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm font-bold text-[#8134AF]">
                  <Camera className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>Ekran görüntüsü çək</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col justify-between rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50/70 to-white p-5">
                <div>
                  <span className="font-[var(--font-display)] text-xs font-extrabold tracking-wider text-emerald-700">
                    3-cü ADDIM
                  </span>
                  <h3 className="mt-2 font-[var(--font-display)] text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    Screenshot-u WhatsApp-a göndər
                  </h3>
                </div>

                <a
                  href={INSTAGRAM_BONUS_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-slate-950 shadow-md hover:bg-[#20bd5a] active:scale-[0.99] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>Screenshot-u Göndər - WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Bottom Yellow Bonus Box */}
            <div className="mt-6 rounded-2xl border-2 border-yellow-400 bg-yellow-300/90 px-4 py-4 sm:px-6 sm:py-5 text-center shadow-sm">
              <p className="font-[var(--font-display)] text-sm sm:text-base font-extrabold text-slate-950 leading-snug">
                🎁 BONUS: İzləyib screenshot göndərənlər qeydiyyatda 1-ci növbəyə keçir + sənəd köməyi PULSUZDUR!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
