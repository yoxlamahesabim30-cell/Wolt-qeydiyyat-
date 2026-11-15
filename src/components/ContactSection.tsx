import React from 'react';
import { MapPin, MessageCircle, Phone, ArrowUpRight, Building2 } from 'lucide-react';
import { LINKS, OFFICE_INFO } from '../data/fleetData';
import { InstagramIcon } from './InstagramIcon';

export const ContactSection: React.FC = () => {
  return (
    <section
      id="elaqe"
      className="border-b border-blue-400/15 bg-[#061026] py-14 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs sm:text-sm font-semibold text-sky-400">
            Bakı Ofisi və Dəstək
          </p>
          <h2
            className="mt-2 font-[var(--font-display)] font-bold tracking-tight text-white text-balance"
            style={{ fontSize: 'clamp(1.625rem, 3vw, 2.25rem)' }}
          >
            Ofisimiz və Əlaqə
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Suallarınız varsa WhatsApp və ya telefon vasitəsilə əlaqə saxlayın, yaxud birbaşa ofisimizə yaxınlaşın.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Office Address Card */}
          <div className="card-surface rounded-2xl p-6 sm:p-8 lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/25 border border-sky-400/25 text-sky-300">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-sky-400">Ofis Ünvanı</p>
                  <h3 className="font-[var(--font-display)] text-lg sm:text-xl font-bold text-white">
                    {OFFICE_INFO.street}
                  </h3>
                </div>
              </div>

              <div className="mt-6 space-y-4 border-t border-blue-400/15 pt-5">
                <div>
                  <p className="text-xs font-semibold text-slate-400">İstiqamət</p>
                  <p className="mt-1 text-sm sm:text-base font-medium text-white">
                    {OFFICE_INFO.landmark}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400">Dəqiq Yerləşmə</p>
                  <p className="mt-1 flex items-center gap-2 text-sm sm:text-base font-medium text-white">
                    <Building2 className="h-4 w-4 text-sky-400 shrink-0" aria-hidden="true" />
                    <span>{OFFICE_INFO.floorRoom}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-blue-400/15 pt-5">
              <a
                href={LINKS.registration}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[46px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-yellow-300 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
              >
                <span>Onlayn Qeydiyyatdan Keç</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Direct Contact Channels Card */}
          <div className="card-surface rounded-2xl p-6 sm:p-8 lg:col-span-6 flex flex-col justify-between">
            <div>
              <h3 className="font-[var(--font-display)] text-lg sm:text-xl font-bold text-white">
                Birbaşa Əlaqə Vasitələri
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                WhatsApp mesajı göndərmək və ya zəng etmək üçün aşağıdakı düymələrdən istifadə edin.
              </p>

              <div className="mt-6 space-y-4">
                {/* First Number: +994 99 800 75 65 */}
                <div className="rounded-xl border border-blue-400/20 bg-[#040b1a]/80 p-4 sm:p-5">
                  <div>
                    <p className="text-xs font-semibold text-sky-400">WhatsApp, Zəng və Instagram</p>
                    <p className="mt-1 font-[var(--font-display)] text-base sm:text-lg font-bold text-white tabular-nums">
                      {OFFICE_INFO.whatsappDisplay}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <a
                      href={LINKS.whatsappPhoneHref}
                      className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-2 sm:px-3 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-blue-500 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                    >
                      <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>Zəng Et</span>
                    </a>
                    <a
                      href={LINKS.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-2 sm:px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                    >
                      <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={LINKS.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-pink-400/40 bg-gradient-to-r from-[#833AB4]/30 via-[#FD1D1D]/25 to-[#F56040]/25 px-2 sm:px-3 py-2.5 text-xs sm:text-sm font-bold text-white hover:border-pink-400/80 hover:from-[#833AB4]/50 hover:to-[#F56040]/45 transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
                    >
                      <InstagramIcon className="h-4 w-4 shrink-0" />
                      <span>Instagram</span>
                    </a>
                  </div>
                </div>

                {/* Second Number: +994 60 446 64 04 */}
                <div className="rounded-xl border border-blue-400/20 bg-[#040b1a]/80 p-4 sm:p-5">
                  <div>
                    <p className="text-xs font-semibold text-sky-400">Telefon, WhatsApp və Instagram</p>
                    <p className="mt-1 font-[var(--font-display)] text-base sm:text-lg font-bold text-white tabular-nums">
                      {OFFICE_INFO.phoneDisplay}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <a
                      href={LINKS.phoneHref}
                      className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-2 sm:px-3 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-blue-500 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                    >
                      <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>Zəng Et</span>
                    </a>
                    <a
                      href={LINKS.phone2Whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-2 sm:px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                    >
                      <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={LINKS.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-pink-400/40 bg-gradient-to-r from-[#833AB4]/30 via-[#FD1D1D]/25 to-[#F56040]/25 px-2 sm:px-3 py-2.5 text-xs sm:text-sm font-bold text-white hover:border-pink-400/80 hover:from-[#833AB4]/50 hover:to-[#F56040]/45 transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
                    >
                      <InstagramIcon className="h-4 w-4 shrink-0" />
                      <span>Instagram</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
