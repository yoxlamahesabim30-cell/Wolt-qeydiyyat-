import React from 'react';
import { WORK_FEATURES } from '../data/fleetData';

export const WorkInfoSection: React.FC = () => {
  return (
    <section
      id="is-haqqinda"
      className="border-b border-[#0099C6]/20 bg-[#F1F5F9] dark:bg-[#0F172A] py-14 sm:py-20 transition-colors"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs sm:text-sm font-bold text-[#0099C6]">
            İş Şərtləri
          </p>
          <h2
            className="mt-2 font-[var(--font-display)] font-extrabold tracking-tight text-[#0B1B2B] dark:text-[#E2E8F0] text-balance"
            style={{ fontSize: 'clamp(1.625rem, 3vw, 2.25rem)' }}
          >
            FLASHLY FLEET ilə İş Haqqında
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
            Wolt platformasında kuryer kimi fəaliyyətə başlamaq üçün şəffaf qaydalar və çevik iş imkanları.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-6">
          {WORK_FEATURES.map((feature, idx) => {
            const spanClass =
              idx === 0
                ? 'md:col-span-3'
                : idx === 1
                ? 'md:col-span-3'
                : 'md:col-span-2';

            return (
              <div
                key={feature.id}
                className={`wolt-card rounded-2xl p-6 flex flex-col justify-between transition-colors duration-150 hover:border-[#0099C6] ${spanClass}`}
              >
                <div>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#E4F4FA] dark:bg-[#0F172A] font-[var(--font-display)] text-xs font-extrabold text-[#0099C6] tabular-nums">
                    {feature.id}
                  </span>
                  <h3 className="mt-3 font-[var(--font-display)] text-lg font-bold text-[#0B1B2B] dark:text-[#E2E8F0] leading-snug">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
