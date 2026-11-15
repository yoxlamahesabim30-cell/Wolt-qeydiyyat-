import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { HERO_STATS, LINKS } from '../data/fleetData';
import bicycleCourierImg from '../assets/images/courier_bicycle_baku_1794724802709.jpg';
import scooterCourierImg from '../assets/images/courier_scooter_baku_1794724803116.jpg';
import motorcycleCourierImg from '../assets/images/courier_motorcycle_baku_1794724804350.jpg';
import carCourierImg from '../assets/images/courier_car_baku_1794724805009.jpg';

interface TransportSlide {
  id: string;
  vehicle: string;
  headline: string;
  image: string;
  alt: string;
}

const TRANSPORT_SLIDES: TransportSlide[] = [
  {
    id: 'velosiped',
    vehicle: 'Velosiped',
    headline: 'Velosipedlə Başla - Şəhəri Kəşf Et, Qazan!',
    image: bicycleCourierImg,
    alt: 'Bakıda velosipedli Wolt kuryeri',
  },
  {
    id: 'skuter',
    vehicle: 'Skuter',
    headline: 'Skuterlə Sürətli Çatdır, Daha Çox Qazan!',
    image: scooterCourierImg,
    alt: 'Bakıda skuterli Wolt kuryeri',
  },
  {
    id: 'motosiklet',
    vehicle: 'Motosiklet',
    headline: 'Motosikletlə Azad Ol - Yollar Sənindir!',
    image: motorcycleCourierImg,
    alt: 'Bakıda motosikletli Wolt kuryeri',
  },
  {
    id: 'avtomobil',
    vehicle: 'Avtomobil',
    headline: 'Avtomobilinlə Rahat İşlə - Böyük Qazanc!',
    image: carCourierImg,
    alt: 'Bakıda avtomobilli Wolt kuryeri',
  },
];

export const HeroSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedSlides, setFailedSlides] = useState<Record<string, boolean>>({});
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  const totalSlides = TRANSPORT_SLIDES.length;

  const goToSlide = (index: number) => {
    const normalized = ((index % totalSlides) + totalSlides) % totalSlides;
    setActiveIndex(normalized);
  };

  const goNext = () => goToSlide(activeIndex + 1);
  const goPrev = () => goToSlide(activeIndex - 1);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [isPaused, activeIndex, totalSlides]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null) {
      if (touchDeltaX.current < -40) {
        goNext();
      } else if (touchDeltaX.current > 40) {
        goPrev();
      }
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
    setIsPaused(false);
  };

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
          <div className="flex flex-col justify-center lg:col-span-6">
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

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm text-slate-200">
              <span className="inline-flex items-center gap-2 font-medium text-white">
                <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-80" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                </span>
                <span>30 Noyabr 2026-dək ödənişsiz qeydiyyat</span>
              </span>
              <span className="inline-flex items-center rounded-md bg-yellow-400 px-2 py-0.5 text-[11px] font-extrabold tracking-wide text-slate-950 animate-gentle-blink shadow-sm">
                TƏLƏSİN!
              </span>
              <span aria-hidden="true" className="text-blue-400/50">·</span>
              <span className="text-slate-300">Bakı ofisi: Məmməd Araz 25A</span>
            </div>
          </div>

          {/* Right Column: 4-Vehicle Interactive Carousel */}
          <div className="lg:col-span-6 flex flex-col">
            <div
              role="region"
              aria-roledescription="karusel"
              aria-label="Nəqliyyat növləri slayderi"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative h-80 sm:h-96 lg:h-[420px] overflow-hidden rounded-2xl border border-blue-400/25 bg-blue-950/80 shadow-2xl shadow-blue-950/70 select-none touch-pan-y"
            >
              {/* Sliding Track */}
              <div
                className="flex h-full w-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {TRANSPORT_SLIDES.map((slide) => (
                  <div
                    key={slide.id}
                    className="relative h-full w-full shrink-0"
                  >
                    {!failedSlides[slide.id] ? (
                      <img
                        src={slide.image}
                        alt={slide.alt}
                        referrerPolicy="no-referrer"
                        draggable={false}
                        onError={() =>
                          setFailedSlides((prev) => ({ ...prev, [slide.id]: true }))
                        }
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-blue-900/70 to-[#050d1f] p-6 text-center">
                        <Zap className="h-12 w-12 text-sky-400" aria-hidden="true" />
                        <p className="mt-3 font-[var(--font-display)] text-lg font-bold text-white">
                          {slide.vehicle}
                        </p>
                      </div>
                    )}

                    {/* Contrast Scrim */}
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040a1a]/95 via-[#040a1a]/30 to-transparent"
                      aria-hidden="true"
                    />

                    {/* Overlay Vehicle Copy (White text only) */}
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 pr-14">
                      <p className="font-[var(--font-display)] text-base sm:text-xl font-bold text-white leading-snug">
                        {slide.headline}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Left Previous Arrow */}
              <button
                type="button"
                onClick={goPrev}
                aria-label="Əvvəlki nəqliyyat şəkli"
                className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-[#050d1f]/75 text-white backdrop-blur-sm hover:bg-[#050d1f] hover:border-sky-400 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>

              {/* Prominent Right Swipe/Next Arrow ( > ) */}
              <button
                type="button"
                onClick={goNext}
                aria-label="Növbəti nəqliyyat şəkli — sürüşdür"
                title="Sürüşdür"
                className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-11 items-center justify-center gap-1 rounded-full border border-white/40 bg-[#050d1f]/85 px-3 text-white shadow-lg backdrop-blur-sm hover:bg-white hover:text-slate-950 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className="hidden sm:inline text-xs font-bold">Sürüşdür</span>
                <ChevronRight className="h-5 w-5 shrink-0" aria-hidden="true" />
              </button>
            </div>

            {/* 4 Pagination Dots Below Carousel */}
            <div className="mt-3.5 flex items-center justify-between gap-4 px-1">
              <div className="flex items-center gap-2" role="tablist" aria-label="Şəkil göstəriciləri">
                {TRANSPORT_SLIDES.map((slide, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`${slide.vehicle} şəklinə keç`}
                      onClick={() => goToSlide(idx)}
                      className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                        isActive
                          ? 'w-8 bg-yellow-400'
                          : 'w-2.5 bg-blue-300/35 hover:bg-blue-300/70'
                      }`}
                    />
                  );
                })}
              </div>

              <span className="text-xs font-medium text-slate-300 tabular-nums">
                {activeIndex + 1} / {totalSlides} · {TRANSPORT_SLIDES[activeIndex].vehicle}
              </span>
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
