import React, { useState } from 'react';
import { ArrowUpRight, ArrowDown, Zap } from 'lucide-react';
import { HERO_STATS, LINKS } from '../data/fleetData';
import heroCourierImg from '../assets/images/hero_courier_fleet_1794716675849.jpg';

export const HeroSection: React.FC = () => {
  const [imgError, setImgError] = useState(false);

  const handleScrollToEarnings = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById('qazanc');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="top"
      className="corporate-gradient relative overflow-hidden border-b border-blue-400/15"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16 lg:py-20">
        {/* 2-Column Hero Split */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10">
          {/* Left Column: Copy & Primary Actions */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-sky-300">
              <span>FLASHLY FLEET</span>
              <span aria-hidden="true" className="text-blue-400/60">·</span>
              <span>Azərbaycanda Wolt Kuryer Partnyoru</span>
            </div>

            <h1
              className="font-[var(--font-display)] font-extrabold tracking-tight text-white text-balance leading-[1.08]"
              style={{ fontSize: 'clamp(2.25rem, 4.4vw, 3.75rem)' }}
            >
              WOLT KURYERİ OL!
            </h1>

            <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-slate-200">
              Sərbəst iş qrafiki ilə işləyin, öz vaxtınızı özünüz idarə edin və qazanc əldə edin.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3.5">
              <a
                href={LINKS.registration}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3.5 text-sm sm:text-base font-bold text-slate-950 shadow-lg shadow-yellow-500/15 hover:bg-yellow-300 active:scale-[0.99] transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
              >
                <span>Qeydiyyatdan Keç</span>
                <ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden="true" />
              </a>

              <a
                href="#qazanc"
                onClick={handleScrollToEarnings}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-blue-400/30 bg-blue-950/60 px-6 py-3.5 text-sm sm:text-base font-semibold text-white hover:bg-blue-900/70 hover:border-sky-400/50 active:scale-[0.99] transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                <span>Qazanc Sistemi</span>
                <ArrowDown className="h-4 w-4 shrink-0 text-sky-400" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-300">
              <span>30 Noyabr 2026-dək ödənişsiz qeydiyyat</span>
              <span aria-hidden="true" className="text-blue-400/50">·</span>
              <span>Bakı ofisi: Məmməd Araz 25A</span>
            </div>
          </div>

          {/* Right Column: Hero Visual */}
          <div className="lg:col-span-5">
            <div className="relative h-64 sm:h-80 lg:h-full min-h-[300px] overflow-hidden rounded-2xl border border-blue-400/20 bg-blue-950/80 shadow-2xl shadow-blue-950/70">
              {!imgError ? (
                <>
                  <img
                    src={heroCourierImg}
                    alt="FLASHLY FLEET Wolt kuryeri elektrik skuterin yanında"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="h-full w-full object-cover object-center"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050d1f]/85 via-[#050d1f]/20 to-transparent"
                    aria-hidden="true"
                  />
                </>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-blue-900/70 to-[#050d1f] p-6 text-center">
                  <Zap className="h-12 w-12 text-sky-400" aria-hidden="true" />
                  <p className="mt-3 font-[var(--font-display)] text-lg font-bold text-white">
                    FLASHLY FLEET
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    Wolt Kuryer Xidməti
                  </p>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-xs font-medium text-sky-300">
                  Piyada · Velosiped · Motosiklet
                </p>
                <p className="mt-1 text-sm sm:text-base font-semibold text-white">
                  Öz vaxtınızı planlaşdırın, gündəlik və ya 15 günlük ödəniş alın.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Summary Strip Below Hero Split */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-14 lg:grid-cols-4">
          {HERO_STATS.map((stat) => (
            <div
              key={stat.label}
              className="card-surface rounded-2xl p-4 sm:p-5"
            >
              <div className="font-[var(--font-display)] text-xl sm:text-2xl font-extrabold tracking-tight text-white tabular-nums">
                {stat.value}
              </div>
              <div className="mt-1 text-sm font-semibold text-sky-300">
                {stat.label}
              </div>
              <div className="mt-1 text-xs text-slate-300 leading-snug">
                {stat.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
