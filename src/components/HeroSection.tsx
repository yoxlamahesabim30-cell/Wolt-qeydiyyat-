import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { HERO_STATS } from '../data/fleetData';
import { useRegistrationModal } from '../context/RegistrationModalContext';
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
  const { openRegistrationModal } = useRegistrationModal();
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
      className="wolt-hero-bg relative overflow-hidden border-b border-[#0099C6]/20 transition-colors"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16 lg:py-20">
        {/* 2-Column Hero Split */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10">
          {/* Left Column: Copy & Primary Actions */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-[#0099C6]">
              <span>FLASHLY FLEET</span>
              <span aria-hidden="true">·</span>
              <span>Azərbaycanda Wolt Kuryer Partnyoru</span>
            </div>

            <h1
              className="font-[var(--font-display)] font-extrabold tracking-tight text-[#0B1B2B] dark:text-[#E2E8F0] text-balance leading-[1.08]"
              style={{ fontSize: 'clamp(2.5rem, 4.8vw, 3.85rem)' }}
            >
              WOLT KURYERİ OL!
            </h1>

            {/* Light-Blue Promo Box Directly Under Headline */}
            <div className="mt-4 inline-flex w-fit max-w-full items-center rounded-xl border border-[#0099C6]/45 bg-[#E4F4FA] dark:bg-[#1E293B] px-4 py-2.5 text-sm sm:text-base font-bold text-[#0B1B2B] dark:text-[#E2E8F0] shadow-xs">
              <span>🎁 30 Noyabr-dək qeydiyyat TAM ÖDƏNİŞSİZDİR</span>
            </div>

            <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-[#334155] dark:text-[#CBD5E1]">
              Sərbəst iş qrafiki ilə işləyin, öz vaxtınızı özünüz idarə edin və qazanc əldə edin.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-3.5">
              <button
                type="button"
                onClick={openRegistrationModal}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#0099C6] px-6 py-3.5 text-sm sm:text-base font-bold text-[#F8FAFC] shadow-md shadow-[#0099C6]/25 hover:bg-[#007FA6] active:scale-[0.99] transition-all duration-150 sm:whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
              >
                <span>Kuryer kimi qeydiyyatdan keç</span>
                <ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden="true" />
              </button>

              <a
                href="#qazanc"
                onClick={handleScrollToEarnings}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#0099C6] px-6 py-3.5 text-sm sm:text-base font-bold text-[#F8FAFC] shadow-md shadow-[#0099C6]/20 hover:bg-[#007FA6] active:scale-[0.99] transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
              >
                <span>Qazanc Sistemi</span>
                <ArrowDown className="h-4 w-4 shrink-0" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1]">
              <span>Bakı ofisi: Məmməd Araz 25A</span>
              <span aria-hidden="true" className="text-[#0099C6]">·</span>
              <span>Velosiped · Skuter · Motosiklet · Avtomobil</span>
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
              className="relative h-80 sm:h-96 lg:h-[420px] overflow-hidden rounded-2xl border border-[#0099C6]/35 bg-[#E4F4FA] dark:bg-[#1E293B] shadow-xl shadow-[#0B1B2B]/15 select-none touch-pan-y"
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
                      <div className="flex h-full w-full flex-col items-center justify-center bg-[#E4F4FA] dark:bg-[#1E293B] p-6 text-center">
                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#0099C6]/15 text-[#0099C6]">
                          <Zap className="h-8 w-8" aria-hidden="true" />
                        </span>
                        <p className="mt-3 font-[var(--font-display)] text-lg font-bold text-[#0B1B2B] dark:text-[#E2E8F0]">
                          {slide.vehicle}
                        </p>
                      </div>
                    )}

                    {/* Contrast Scrim */}
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1B2B]/90 via-[#0B1B2B]/25 to-transparent"
                      aria-hidden="true"
                    />

                    {/* Overlay Vehicle Copy (Soft Light text) */}
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 pr-14">
                      <p className="font-[var(--font-display)] text-base sm:text-xl font-bold text-[#F8FAFC] leading-snug">
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
                className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0099C6] text-[#F8FAFC] shadow-md hover:bg-[#007FA6] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8FAFC]"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>

              {/* Prominent Right Swipe/Next Arrow ( > ) */}
              <button
                type="button"
                onClick={goNext}
                aria-label="Növbəti nəqliyyat şəkli — sürüşdür"
                title="Sürüşdür"
                className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-11 items-center justify-center gap-1 rounded-full bg-[#0099C6] px-3 text-[#F8FAFC] shadow-lg hover:bg-[#007FA6] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8FAFC]"
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
                      className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6] ${
                        isActive
                          ? 'w-8 bg-[#0099C6]'
                          : 'w-2.5 bg-[#0099C6]/30 hover:bg-[#0099C6]/60'
                      }`}
                    />
                  );
                })}
              </div>

              <span className="text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] tabular-nums">
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
              className="wolt-card rounded-2xl p-4 sm:p-5"
            >
              <div className="font-[var(--font-display)] text-xl sm:text-2xl font-extrabold tracking-tight text-[#0099C6] tabular-nums">
                {stat.value}
              </div>
              <div className="mt-1 text-sm font-bold text-[#0B1B2B] dark:text-[#E2E8F0]">
                {stat.label}
              </div>
              <div className="mt-1 text-xs text-[#334155] dark:text-[#CBD5E1] leading-snug">
                {stat.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
