import React, { useState } from 'react';
import { ArrowDown, Bike, Car, Gauge, Zap } from 'lucide-react';

interface VehicleOption {
  id: 'velosiped' | 'skuter' | 'motosiklet' | 'avtomobil';
  label: string;
  hourlyRate: number;
}

const VEHICLE_OPTIONS: VehicleOption[] = [
  { id: 'velosiped', label: 'Velosiped', hourlyRate: 4 },
  { id: 'skuter', label: 'Skuter', hourlyRate: 5.5 },
  { id: 'motosiklet', label: 'Motosiklet', hourlyRate: 7 },
  { id: 'avtomobil', label: 'Avtomobil', hourlyRate: 9 },
];

const HOUR_OPTIONS = [4, 6, 8, 10] as const;
const WORKING_DAYS_PER_MONTH = 26;

export const MonthlyCalculatorSection: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption['id']>('skuter');
  const [dailyHours, setDailyHours] = useState<number>(8);

  const currentVehicle =
    VEHICLE_OPTIONS.find((v) => v.id === selectedVehicle) ?? VEHICLE_OPTIONS[1];

  const estimatedMonthly = Math.round(
    currentVehicle.hourlyRate * dailyHours * WORKING_DAYS_PER_MONTH
  );

  const handleScrollToRegistration = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target =
      document.getElementById('qeydiyyat-formasi') ??
      document.getElementById('telebler');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderVehicleIcon = (id: VehicleOption['id']) => {
    switch (id) {
      case 'velosiped':
        return <Bike className="h-4 w-4 shrink-0" aria-hidden="true" />;
      case 'skuter':
        return <Zap className="h-4 w-4 shrink-0" aria-hidden="true" />;
      case 'motosiklet':
        return <Gauge className="h-4 w-4 shrink-0" aria-hidden="true" />;
      case 'avtomobil':
        return <Car className="h-4 w-4 shrink-0" aria-hidden="true" />;
    }
  };

  return (
    <section
      id="ayliq-kalkulyator"
      className="border-b border-[#0099C6]/20 bg-[#F1F5F9] dark:bg-[#0F172A] py-14 sm:py-20 transition-colors"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-xs sm:text-sm font-bold text-[#0099C6]">
            Aylıq Gəlir Hesablayıcısı
          </p>
          <h2
            className="mt-2 font-[var(--font-display)] font-extrabold tracking-tight text-[#0B1B2B] dark:text-[#E2E8F0] text-balance"
            style={{ fontSize: 'clamp(1.625rem, 3vw, 2.25rem)' }}
          >
            Nə Qədər Qazana Bilərsən?
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-[#334155] dark:text-[#CBD5E1]">
            Özünü hesabla, 5 saniyəyə gör
          </p>
        </div>

        <div className="mt-8 wolt-card rounded-2xl p-5 sm:p-8 space-y-7">
          {/* 1. Vehicle Selector */}
          <div>
            <p className="text-sm font-bold text-[#0B1B2B] dark:text-[#E2E8F0]">
              1. Nəqliyyat növünü seç:
            </p>
            <div
              role="group"
              aria-label="Nəqliyyat növü seçimi"
              className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4"
            >
              {VEHICLE_OPTIONS.map((option) => {
                const isSelected = option.id === selectedVehicle;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedVehicle(option.id)}
                    className={`flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl border px-3 py-2.5 text-center transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6] ${
                      isSelected
                        ? 'border-[#0099C6] bg-[#0099C6] text-[#F8FAFC] shadow-sm'
                        : 'border-[#0099C6]/30 bg-[#E4F4FA] dark:bg-[#0F172A] text-[#0B1B2B] dark:text-[#E2E8F0] hover:border-[#0099C6]'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold">
                      {renderVehicleIcon(option.id)}
                      <span>{option.label}</span>
                    </span>
                    <span
                      className={`text-[11px] font-semibold tabular-nums ${
                        isSelected ? 'text-[#F8FAFC]/95' : 'text-[#0099C6]'
                      }`}
                    >
                      saatı {option.hourlyRate} AZN
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Daily Hours Selector */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="daily-hours-slider"
                className="text-sm font-bold text-[#0B1B2B] dark:text-[#E2E8F0]"
              >
                2. Gündə neçə saat işləyəcəksən?
              </label>
              <span className="text-sm font-bold text-[#0099C6] tabular-nums">
                {dailyHours} saat / gün
              </span>
            </div>

            <div
              role="group"
              aria-label="Gündəlik iş saatı seçimi"
              className="mt-3 grid grid-cols-4 gap-2 sm:gap-3"
            >
              {HOUR_OPTIONS.map((hours) => {
                const isSelected = dailyHours === hours;
                return (
                  <button
                    key={hours}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setDailyHours(hours)}
                    className={`min-h-[44px] rounded-xl border px-2 py-2.5 text-xs sm:text-sm font-bold tabular-nums transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6] ${
                      isSelected
                        ? 'border-[#0099C6] bg-[#0099C6] text-[#F8FAFC] shadow-sm'
                        : 'border-[#0099C6]/30 bg-[#E4F4FA] dark:bg-[#0F172A] text-[#0B1B2B] dark:text-[#E2E8F0] hover:border-[#0099C6]'
                    }`}
                  >
                    {hours} saat
                  </button>
                );
              })}
            </div>

            <div className="mt-4 px-1">
              <input
                id="daily-hours-slider"
                type="range"
                min={4}
                max={10}
                step={2}
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#E4F4FA] dark:bg-[#0F172A] accent-[#0099C6]"
              />
            </div>
          </div>

          {/* Soft Light-Blue Result Box */}
          <div className="rounded-2xl border border-[#0099C6]/50 bg-[#E4F4FA] dark:bg-[#0F172A] p-5 sm:p-7 text-center">
            <p className="text-xs sm:text-sm font-bold text-[#0099C6]">
              {currentVehicle.label} · Gündə {dailyHours} saat · Ayda {WORKING_DAYS_PER_MONTH} gün
            </p>
            <div className="mt-2 font-[var(--font-display)] text-2xl sm:text-3xl font-extrabold text-[#0B1B2B] dark:text-[#E2E8F0] tabular-nums">
              Təxmini Aylıq Qazancın:{' '}
              <span className="text-[#0099C6]">~ {estimatedMonthly} AZN</span>
            </div>

            <div className="mt-5">
              <a
                href="#qeydiyyat-formasi"
                onClick={handleScrollToRegistration}
                className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#0099C6] px-6 py-3.5 text-sm sm:text-base font-bold text-[#F8FAFC] shadow-md shadow-[#0099C6]/25 hover:bg-[#007FA6] active:scale-[0.99] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
              >
                <span>Bu qazancı istəyirəm - Qeydiyyatdan Keç</span>
                <ArrowDown className="h-4 w-4 shrink-0" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
