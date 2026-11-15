import React, { useState } from 'react';
import { Calculator, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { DEPOSIT_DETAILS, LINKS } from '../data/fleetData';

type PayoutMode = 'daily' | 'fifteenDays';

const PRESET_AMOUNTS = [30, 50, 80, 120] as const;

export const EarningsSection: React.FC = () => {
  const [payoutMode, setPayoutMode] = useState<PayoutMode>('daily');
  const [amountInput, setAmountInput] = useState<string>('50');

  const parsedAmount = Math.max(0, Number.parseFloat(amountInput) || 0);

  const courierRate =
    payoutMode === 'fifteenDays'
      ? 80
      : parsedAmount > 40
      ? 80
      : 75;
  const companyRate = 100 - courierRate;

  const courierShare = (parsedAmount * courierRate) / 100;
  const companyShare = (parsedAmount * companyRate) / 100;

  return (
    <section
      id="qazanc"
      className="corporate-gradient border-b border-blue-400/15 py-14 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs sm:text-sm font-semibold text-sky-400">
            Şəffaf Hesablaşma
          </p>
          <h2
            className="mt-2 font-[var(--font-display)] font-bold tracking-tight text-white text-balance"
            style={{ fontSize: 'clamp(1.625rem, 3vw, 2.25rem)' }}
          >
            Qazanc Sistemi və Depozit Şərtləri
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Gündəlik və 15 günlük ödəniş seçimlərindən birini seçin. Bütün faiz bölgüləri aşağıda aydın şəkildə göstərilib.
          </p>
        </div>

        {/* Earnings Tiers + Interactive Calculator */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Official Payout Tiers */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {/* Daily Payment Card */}
            <div className="card-surface rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-sky-300">
                  Seçim 01 · Hər gün ödəniş
                </p>
                <h3 className="mt-2 font-[var(--font-display)] text-xl font-bold text-white">
                  Gündəlik Qazanc
                </h3>

                <div className="mt-6 space-y-4">
                  <div className="border-t border-blue-400/15 pt-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-medium text-slate-200">
                        40 AZN-ə qədər
                      </span>
                      <span className="font-[var(--font-display)] text-lg font-extrabold text-yellow-400 tabular-nums">
                        75% / 25%
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-300">
                      Kuryer 75% · Şirkət 25%
                    </p>
                  </div>

                  <div className="border-t border-blue-400/15 pt-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-medium text-slate-200">
                        40 AZN-dən yuxarı
                      </span>
                      <span className="font-[var(--font-display)] text-lg font-extrabold text-sky-300 tabular-nums">
                        80% / 20%
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-300">
                      Kuryer 80% · Şirkət 20%
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPayoutMode('daily')}
                className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-blue-400/25 bg-blue-950/60 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-blue-900/70 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                Kalkulyatorda Gündəlik Hesabla
              </button>
            </div>

            {/* 15-Day Payment Card */}
            <div className="card-surface rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-yellow-400">
                  Seçim 02 · Maksimum kuryer payı
                </p>
                <h3 className="mt-2 font-[var(--font-display)] text-xl font-bold text-white">
                  15 Günlük Ödəniş
                </h3>

                <div className="mt-6 border-t border-blue-400/15 pt-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium text-slate-200">
                      Bütün məbləğlər üzrə
                    </span>
                    <span className="font-[var(--font-display)] text-2xl font-extrabold text-yellow-400 tabular-nums">
                      80% / 20%
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-200">
                    Kuryer 80% · Şirkət 20%
                  </p>
                  <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Məbləğ həddindən asılı olmayaraq qazancınızın 80%-i birbaşa sizə çatır.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPayoutMode('fifteenDays')}
                className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-blue-400/25 bg-blue-950/60 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-blue-900/70 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                Kalkulyatorda 15 Günlük Hesabla
              </button>
            </div>
          </div>

          {/* Right: Interactive Earnings Calculator */}
          <div className="card-surface rounded-2xl p-6 lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-[var(--font-display)] text-lg font-bold text-white">
                  Qazanc Kalkulyatoru
                </h3>
                <Calculator className="h-5 w-5 text-sky-400 shrink-0" aria-hidden="true" />
              </div>

              {/* Segmented Mode Control */}
              <div
                role="group"
                aria-label="Ödəniş dövrü seçimi"
                className="mt-4 grid grid-cols-2 gap-1.5 rounded-xl bg-[#040b1a] p-1 border border-blue-400/15"
              >
                <button
                  type="button"
                  onClick={() => setPayoutMode('daily')}
                  aria-pressed={payoutMode === 'daily'}
                  className={`min-h-[40px] rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                    payoutMode === 'daily'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Gündəlik
                </button>
                <button
                  type="button"
                  onClick={() => setPayoutMode('fifteenDays')}
                  aria-pressed={payoutMode === 'fifteenDays'}
                  className={`min-h-[40px] rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                    payoutMode === 'fifteenDays'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  15 Günlük
                </button>
              </div>

              {/* Amount Input */}
              <div className="mt-5">
                <label
                  htmlFor="earnings-amount-input"
                  className="block text-xs font-medium text-slate-300"
                >
                  {payoutMode === 'daily'
                    ? 'Gündəlik ümumi qazanc (AZN)'
                    : '15 günlük ümumi qazanc (AZN)'}
                </label>
                <div className="mt-2 relative">
                  <input
                    id="earnings-amount-input"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="decimal"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="min-h-[46px] w-full rounded-xl border border-blue-400/25 bg-[#040b1a] px-4 py-2.5 pr-14 text-base font-bold text-white tabular-nums focus:border-sky-400 focus:outline-none"
                    placeholder="50"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    AZN
                  </span>
                </div>

                {/* Preset Quick Amounts */}
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmountInput(String(preset))}
                      className={`min-h-[36px] rounded-lg border px-3 py-1 text-xs font-semibold tabular-nums transition-colors ${
                        parsedAmount === preset
                          ? 'border-sky-400 bg-sky-500/20 text-white'
                          : 'border-blue-400/20 bg-blue-950/50 text-slate-300 hover:text-white'
                      }`}
                    >
                      {preset} AZN
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Result Breakdown */}
              <div className="mt-6 space-y-3 border-t border-blue-400/15 pt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">
                    Kuryer payı ({courierRate}%)
                  </span>
                  <span className="font-[var(--font-display)] text-lg font-extrabold text-yellow-400 tabular-nums">
                    {courierShare.toFixed(2)} AZN
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">
                    Şirkət payı ({companyRate}%)
                  </span>
                  <span className="font-semibold text-slate-200 tabular-nums">
                    {companyShare.toFixed(2)} AZN
                  </span>
                </div>
              </div>
            </div>

            <a
              href={LINKS.registration}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-yellow-300 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
            >
              <span>İndi Qeydiyyatdan Keç</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Deposit & Thermal Bag Terms */}
        <div className="mt-10 card-surface rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-blue-400/15 pb-5">
            <div>
              <p className="text-xs font-semibold text-sky-400">
                Çanta və Hesab Qaydası
              </p>
              <h3 className="mt-1 font-[var(--font-display)] text-xl font-bold text-white">
                40 AZN Depozit və Wolt Termal Çantası
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-200">
              <ShieldCheck className="h-5 w-5 text-sky-400 shrink-0" aria-hidden="true" />
              <span>İlkin nağd ödəniş tələb olunmur</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DEPOSIT_DETAILS.map((item, index) => (
              <div key={item.title}>
                <span className="font-[var(--font-display)] text-xs font-bold text-sky-400 tabular-nums">
                  0{index + 1}.
                </span>
                <h4 className="mt-1.5 font-[var(--font-display)] text-base font-bold text-white">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
