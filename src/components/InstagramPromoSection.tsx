import React from 'react';
import { ArrowUpRight, Bell, CheckCircle2 } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { LINKS } from '../data/fleetData';

export const InstagramPromoSection: React.FC = () => {
  return (
    <section
      id="instagram-reklam"
      className="border-b border-[#0099C6]/20 bg-[#F1F5F9] dark:bg-[#0F172A] py-14 sm:py-20 transition-colors"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-[#0099C6]/35 bg-gradient-to-br from-[#F8FAFC] via-[#E4F4FA] to-[#F8FAFC] dark:from-[#1E293B] dark:via-[#0F172A] dark:to-[#1E293B] p-6 sm:p-10 shadow-lg shadow-[#0B1B2B]/10">
          <div className="flex flex-col items-center gap-7 md:flex-row md:items-center md:justify-between">
            {/* Left: Logo + Text */}
            <div className="flex flex-col items-center text-center md:items-start md:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2.5 rounded-2xl border border-[#0099C6]/30 bg-[#F8FAFC] dark:bg-[#1E293B] px-3.5 py-2 shadow-xs">
                <InstagramIcon className="h-6 w-6 shrink-0" />
                <span className="font-[var(--font-display)] text-xs sm:text-sm font-extrabold text-[#0099C6]">
                  {LINKS.instagramHandle}
                </span>
              </div>

              <h2
                className="mt-4 font-[var(--font-display)] font-extrabold tracking-tight text-[#0B1B2B] dark:text-[#E2E8F0] text-balance"
                style={{ fontSize: 'clamp(1.625rem, 3vw, 2.25rem)' }}
              >
                FLASHLY FLEET Instagram səhifəmizi izləyin!
              </h2>

              <p className="mt-3 text-sm sm:text-base text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                Kuryerlik yenilikləri, qeydiyyat məlumatları, kampaniyalar və faydalı xəbərlərdən ilk siz xəbərdar olun.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 text-xs sm:text-sm font-semibold text-[#0B1B2B] dark:text-[#E2E8F0]">
                <span className="inline-flex items-center gap-1.5">
                  <Bell className="h-4 w-4 shrink-0 text-[#0099C6]" aria-hidden="true" />
                  <span>Güncəl kampaniyalar</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0099C6]" aria-hidden="true" />
                  <span>Operativ kuryer yenilikləri</span>
                </span>
              </div>
            </div>

            {/* Right: CTA Button */}
            <div className="w-full md:w-auto shrink-0">
              <a
                href={LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[54px] w-full md:w-auto items-center justify-center gap-2.5 rounded-2xl bg-[#0099C6] px-6 py-3.5 text-sm sm:text-base font-extrabold text-[#F8FAFC] shadow-md shadow-[#0099C6]/25 hover:bg-[#007FA6] active:scale-[0.99] transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
              >
                <InstagramIcon className="h-5 w-5 shrink-0" />
                <span>Instagram səhifəmizə keçid</span>
                <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
