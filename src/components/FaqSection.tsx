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
      className="border-b border-[#0099C6]/20 bg-[#EEF2F6] dark:bg-[#0F172A] py-14 sm:py-20 transition-colors"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-xs sm:text-sm font-bold text-[#0099C6]">
            Məlumat Mərkəzi
          </p>
          <h2
            className="mt-2 font-[var(--font-display)] font-extrabold tracking-tight text-[#0B1B2B] dark:text-[#E2E8F0] text-balance"
            style={{ fontSize: 'clamp(1.625rem, 3vw, 2.25rem)' }}
          >
            Tez-tez Verilən Suallar
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#334155] dark:text-[#CBD5E1]">
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
                className="wolt-card rounded-2xl overflow-hidden transition-colors duration-150"
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleItem(item.id)}
                    className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-4 sm:px-6 text-left font-[var(--font-display)] text-sm sm:text-base font-bold text-[#0B1B2B] dark:text-[#E2E8F0] hover:bg-[#E4F4FA]/70 dark:hover:bg-[#0F172A]/60 transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#0099C6]"
                  >
                    <span>{item.question}</span>
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E4F4FA] dark:bg-[#0F172A] text-[#0099C6]">
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                </h3>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="border-t border-[#0099C6]/20 bg-[#E4F4FA]/50 dark:bg-[#0F172A]/55 px-5 pb-5 pt-4 sm:px-6 text-sm sm:text-base text-[#334155] dark:text-[#CBD5E1] leading-relaxed"
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
