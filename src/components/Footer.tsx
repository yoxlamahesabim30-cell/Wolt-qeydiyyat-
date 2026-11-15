import React from 'react';
import { BrandLogo } from './BrandLogo';
import { LINKS, NAV_ITEMS, OFFICE_INFO } from '../data/fleetData';

export const Footer: React.FC = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.getElementById(href.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <footer className="bg-[#040a18] py-12 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <a
              href="#top"
              onClick={(e) => handleScroll(e, '#top')}
              className="inline-block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
            >
              <BrandLogo />
            </a>
            <p className="mt-4 max-w-sm text-sm text-slate-400 leading-relaxed">
              Azərbaycanda Wolt kuryer partnyoru. Sərbəst iş qrafiki, şəffaf qazanc sistemi və ödənişsiz qeydiyyat imkanı.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-[var(--font-display)] text-sm font-bold text-white">
              Bölmələr
            </h4>
            <ul className="mt-3 space-y-2.5 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleScroll(e, item.href)}
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="font-[var(--font-display)] text-sm font-bold text-white">
              Faydalı Keçidlər və Əlaqə
            </h4>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li>
                <a
                  href={LINKS.registration}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400 font-semibold hover:text-yellow-300 transition-colors"
                >
                  Onlayn Qeydiyyat Formu
                </a>
              </li>
              <li>
                <a
                  href={LINKS.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Qeydiyyat Video Təlimatı (YouTube)
                </a>
              </li>
              <li>
                <a
                  href={LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white transition-colors tabular-nums"
                >
                  WhatsApp: {OFFICE_INFO.whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={LINKS.phoneHref}
                  className="text-slate-300 hover:text-white transition-colors tabular-nums"
                >
                  Telefon: {OFFICE_INFO.phoneDisplay}
                </a>
              </li>
              <li className="text-slate-400">
                {OFFICE_INFO.street} · {OFFICE_INFO.floorRoom}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-blue-400/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© 2026 FLASHLY FLEET. Bütün hüquqlar qorunur.</p>
          <p>30 Noyabr 2026 tarixinədək qeydiyyat tamamilə ödənişsizdir.</p>
        </div>
      </div>
    </footer>
  );
};
