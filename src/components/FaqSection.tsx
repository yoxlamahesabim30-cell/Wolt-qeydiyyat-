import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../data/fleetData';

export const FaqSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<string[]>([FAQ_ITEMS[0].id]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section
      id="suallar"
      className="corporate-gradient border-b border-blue-400/15 py-14 sm:py-20"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-xs sm:text-sm font-semibold text-sky-400">
            Məlumat Mərkəzi
          </p>
          <h2
            className="mt-2 font-[var(--font-display)] font-bold tracking-tight text-white text-balance"
            style={{ fontSize: 'clamp(1.625rem, 3vw, 2.25rem)' }}
          >
            Tez-Tez Verilən Suallar
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Qeydiyyat, qazanc bölgüsü, depozit və iş şərtləri barədə əsas sualların cavabları.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openIds.includes(item.id);
            const panelId = `${item.id}-panel`;
            const buttonId = `${item.id}-button`;

            return (
              <div
                key={item.id}
                className="card-surface rounded-2xl overflow-hidden transition-colors duration-150"
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleItem(item.id)}
                    className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-4 sm:px-6 text-left font-[var(--font-display)] text-sm sm:text-base font-bold text-white hover:bg-blue-900/30 transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-sky-400"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-sky-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="border-t border-blue-400/15 px-5 pb-5 pt-4 sm:px-6 text-sm sm:text-base text-slate-200 leading-relaxed"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
