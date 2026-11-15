import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { InstagramIcon } from './InstagramIcon';
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
              <li className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 shrink-0">
                  <a
                    href={LINKS.whatsappPhoneHref}
                    aria-label={`${OFFICE_INFO.whatsappDisplay} nömrəsinə zəng et`}
                    title="Zəng Et"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-blue-400/35 bg-blue-600/25 text-sky-300 hover:bg-blue-600 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                  <a
                    href={LINKS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${OFFICE_INFO.whatsappDisplay} WhatsApp ilə yaz`}
                    title="WhatsApp"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-emerald-400/35 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </span>
                <span className="text-slate-200 tabular-nums">{OFFICE_INFO.whatsappDisplay}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 shrink-0">
                  <a
                    href={LINKS.phoneHref}
                    aria-label={`${OFFICE_INFO.phoneDisplay} nömrəsinə zəng et`}
                    title="Zəng Et"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-blue-400/35 bg-blue-600/25 text-sky-300 hover:bg-blue-600 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                  <a
                    href={LINKS.phone2Whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${OFFICE_INFO.phoneDisplay} WhatsApp ilə yaz`}
                    title="WhatsApp"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-emerald-400/35 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </span>
                <span className="text-slate-200 tabular-nums">{OFFICE_INFO.phoneDisplay}</span>
              </li>
              <li>
                <a
                  href={LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-slate-200 hover:text-white transition-colors"
                >
                  <InstagramIcon className="h-6 w-6 shrink-0" />
                  <span>{LINKS.instagramHandle}</span>
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
