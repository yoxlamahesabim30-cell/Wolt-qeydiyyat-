import React from 'react';
import { MapPin, Phone, ArrowUpRight, Building2 } from 'lucide-react';
import { LINKS, OFFICE_INFO } from '../data/fleetData';
import { InstagramIcon } from './InstagramIcon';
import { WhatsAppIcon } from './WhatsAppIcon';
import { useRegistrationModal } from '../context/RegistrationModalContext';

export const ContactSection: React.FC = () => {
  const { openRegistrationModal } = useRegistrationModal();
  return (
    <section
      id="elaqe"
      className="border-b border-[#0099C6]/20 bg-[#EEF2F6] dark:bg-[#0F172A] py-14 sm:py-20 transition-colors"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs sm:text-sm font-bold text-[#0099C6]">
            Bakı Ofisi və Dəstək
          </p>
          <h2
            className="mt-2 font-[var(--font-display)] font-extrabold tracking-tight text-[#0B1B2B] dark:text-[#E2E8F0] text-balance"
            style={{ fontSize: 'clamp(1.625rem, 3vw, 2.25rem)' }}
          >
            Ofisimiz və Əlaqə
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
            Suallarınız varsa WhatsApp və ya telefon vasitəsilə əlaqə saxlayın, yaxud birbaşa ofisimizə yaxınlaşın.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Office Address Card */}
          <div className="wolt-card-soft rounded-2xl p-6 sm:p-8 lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#0099C6]/35 text-[#0099C6] shadow-xs">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-bold text-[#0099C6]">Ofis Ünvanı</p>
                  <h3 className="font-[var(--font-display)] text-lg sm:text-xl font-bold text-[#0B1B2B] dark:text-[#E2E8F0]">
                    {OFFICE_INFO.street}
                  </h3>
                </div>
              </div>

              <div className="mt-6 space-y-4 border-t border-[#0099C6]/20 pt-5">
                <div>
                  <p className="text-xs font-bold text-[#334155] dark:text-[#CBD5E1]">İstiqamət</p>
                  <p className="mt-1 text-sm sm:text-base font-semibold text-[#0B1B2B] dark:text-[#E2E8F0]">
                    {OFFICE_INFO.landmark}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-[#334155] dark:text-[#CBD5E1]">Dəqiq Yerləşmə</p>
                  <p className="mt-1 flex items-center gap-2.5 text-sm sm:text-base font-semibold text-[#0B1B2B] dark:text-[#E2E8F0]">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0099C6] shrink-0">
                      <Building2 className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span>{OFFICE_INFO.floorRoom}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-[#0099C6]/20 pt-5">
              <button
                type="button"
                onClick={openRegistrationModal}
                className="inline-flex min-h-[46px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#0099C6] px-6 py-3 text-sm font-bold text-[#F8FAFC] shadow-sm hover:bg-[#007FA6] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
              >
                <span>Onlayn Qeydiyyatdan Keç</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Direct Contact Channels Card */}
          <div className="wolt-card rounded-2xl p-6 sm:p-8 lg:col-span-6 flex flex-col justify-between">
            <div>
              <h3 className="font-[var(--font-display)] text-lg sm:text-xl font-bold text-[#0B1B2B] dark:text-[#E2E8F0]">
                Birbaşa Əlaqə Vasitələri
              </h3>
              <p className="mt-2 text-sm text-[#334155] dark:text-[#CBD5E1]">
                Zəng etmək, WhatsApp mesajı göndərmək və ya Instagram səhifəmizə keçmək üçün aşağıdakı düymələrdən istifadə edin.
              </p>

              <div className="mt-6 space-y-4">
                {/* First Number: +994 99 800 75 65 */}
                <div className="rounded-xl border border-[#0099C6]/25 bg-[#EEF2F6] dark:bg-[#0F172A] p-4 sm:p-5">
                  <div>
                    <p className="text-xs font-bold text-[#0099C6]">WhatsApp, Zəng və Instagram</p>
                    <p className="mt-1 font-[var(--font-display)] text-base sm:text-lg font-extrabold text-[#0B1B2B] dark:text-[#E2E8F0] tabular-nums">
                      {OFFICE_INFO.whatsappDisplay}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <a
                      href={LINKS.whatsappPhoneHref}
                      className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-[#0099C6] px-2 sm:px-3 py-2.5 text-xs sm:text-sm font-bold text-[#F8FAFC] hover:bg-[#007FA6] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
                    >
                      <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>Zəng Et</span>
                    </a>
                    <a
                      href={LINKS.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-2 sm:px-3 py-2.5 text-xs sm:text-sm font-bold text-[#0B1B2B] hover:bg-[#20bd5a] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                    >
                      <WhatsAppIcon variant="glyph" className="h-4 w-4 shrink-0" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={LINKS.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-[#0099C6] px-2 sm:px-3 py-2.5 text-xs sm:text-sm font-bold text-[#F8FAFC] hover:bg-[#007FA6] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
                    >
                      <InstagramIcon className="h-4 w-4 shrink-0" />
                      <span>Instagram</span>
                    </a>
                  </div>
                </div>

                {/* Second Number: +994 60 446 64 04 */}
                <div className="rounded-xl border border-[#0099C6]/25 bg-[#EEF2F6] dark:bg-[#0F172A] p-4 sm:p-5">
                  <div>
                    <p className="text-xs font-bold text-[#0099C6]">Telefon, WhatsApp və Instagram</p>
                    <p className="mt-1 font-[var(--font-display)] text-base sm:text-lg font-extrabold text-[#0B1B2B] dark:text-[#E2E8F0] tabular-nums">
                      {OFFICE_INFO.phoneDisplay}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <a
                      href={LINKS.phoneHref}
                      className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-[#0099C6] px-2 sm:px-3 py-2.5 text-xs sm:text-sm font-bold text-[#F8FAFC] hover:bg-[#007FA6] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
                    >
                      <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>Zəng Et</span>
                    </a>
                    <a
                      href={LINKS.phone2Whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-2 sm:px-3 py-2.5 text-xs sm:text-sm font-bold text-[#0B1B2B] hover:bg-[#20bd5a] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                    >
                      <WhatsAppIcon variant="glyph" className="h-4 w-4 shrink-0" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={LINKS.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-[#0099C6] px-2 sm:px-3 py-2.5 text-xs sm:text-sm font-bold text-[#F8FAFC] hover:bg-[#007FA6] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
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
