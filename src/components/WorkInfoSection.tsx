import React from 'react';
import { WORK_FEATURES } from '../data/fleetData';

export const WorkInfoSection: React.FC = () => {
  return (
    <section
      id="is-haqqinda"
      className="border-b border-blue-400/15 bg-[#061026] py-14 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs sm:text-sm font-semibold text-sky-400">
            İş Şərtləri
          </p>
          <h2
            className="mt-2 font-[var(--font-display)] font-bold tracking-tight text-white text-balance"
            style={{ fontSize: 'clamp(1.625rem, 3vw, 2.25rem)' }}
          >
            FLASHLY FLEET ilə İş Haqqında
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
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
                className={`card-surface rounded-2xl p-6 flex flex-col justify-between transition-colors duration-150 hover:border-sky-400/35 ${spanClass}`}
              >
                <div>
                  <span className="font-[var(--font-display)] text-sm font-bold text-sky-400 tabular-nums">
                    {feature.id}.
                  </span>
                  <h3 className="mt-2 font-[var(--font-display)] text-lg font-bold text-white leading-snug">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
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
