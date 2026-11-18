import React from 'react';
import { Phone, MessageCircle, Shield } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { InstagramIcon } from './InstagramIcon';
import { LINKS, NAV_ITEMS, OFFICE_INFO } from '../data/fleetData';
import { useRegistrationModal } from '../context/RegistrationModalContext';
import { useSiteConfig } from '../context/SiteConfigContext';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { openRegistrationModal } = useRegistrationModal();
  const { config } = useSiteConfig();
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
    <footer className="border-t border-[#1E293B] bg-[#0B1B2B] dark:bg-[#020617] pt-12 pb-24 sm:pb-12 text-[#E2E8F0] transition-colors">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <a
              href="#top"
              onClick={(e) => handleScroll(e, '#top')}
              className="inline-block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
            >
              <BrandLogo tone="light" />
            </a>
            <p className="mt-4 max-w-sm text-sm text-[#CBD5E1] leading-relaxed">
              Azərbaycanda Wolt kuryer partnyoru. Sərbəst iş qrafiki, şəffaf qazanc sistemi və ödənişsiz qeydiyyat imkanı.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-[var(--font-display)] text-sm font-bold text-[#F8FAFC]">
              Bölmələr
            </h4>
            <ul className="mt-3 space-y-2.5 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleScroll(e, item.href)}
                    className="text-[#CBD5E1] hover:text-[#0099C6] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="font-[var(--font-display)] text-sm font-bold text-[#F8FAFC]">
              Faydalı Keçidlər və Əlaqə
            </h4>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={openRegistrationModal}
                  className="text-left text-[#0099C6] font-bold hover:text-[#F8FAFC] transition-colors"
                >
                  Onlayn Qeydiyyat Formu
                </button>
              </li>
              <li>
                <a
                  href={LINKS.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#CBD5E1] hover:text-[#0099C6] transition-colors"
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
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#E4F4FA] text-[#0099C6] hover:bg-[#0099C6] hover:text-[#F8FAFC] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                  <a
                    href={LINKS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${OFFICE_INFO.whatsappDisplay} WhatsApp ilə yaz`}
                    title="WhatsApp"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366] text-[#0B1B2B] hover:bg-[#20bd5a] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </span>
                <span className="text-[#E2E8F0] tabular-nums">{OFFICE_INFO.whatsappDisplay}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 shrink-0">
                  <a
                    href={LINKS.phoneHref}
                    aria-label={`${OFFICE_INFO.phoneDisplay} nömrəsinə zəng et`}
                    title="Zəng Et"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#E4F4FA] text-[#0099C6] hover:bg-[#0099C6] hover:text-[#F8FAFC] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                  <a
                    href={LINKS.phone2Whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${OFFICE_INFO.phoneDisplay} WhatsApp ilə yaz`}
                    title="WhatsApp"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366] text-[#0B1B2B] hover:bg-[#20bd5a] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </span>
                <span className="text-[#E2E8F0] tabular-nums">{OFFICE_INFO.phoneDisplay}</span>
              </li>
              <li>
                <a
                  href={config.instagramPromo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-[#E2E8F0] hover:text-[#0099C6] transition-colors"
                >
                  <InstagramIcon className="h-6 w-6 shrink-0" />
                  <span>{config.instagramPromo.instagramHandle}</span>
                </a>
              </li>
              <li className="text-[#CBD5E1]">
                {OFFICE_INFO.street} · {OFFICE_INFO.floorRoom}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#E2E8F0]/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#CBD5E1]">
          <p>© 2026 FLASHLY FLEET. Bütün hüquqlar qorunur.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <p>30 Noyabr 2026 tarixinədək qeydiyyat tamamilə ödənişsizdir.</p>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#0099C6]/40 bg-[#1E293B] px-3 py-1.5 text-xs font-bold text-[#E2E8F0] hover:border-[#0099C6] hover:text-[#0099C6] transition-colors"
              >
                <Shield className="h-3.5 w-3.5 text-[#0099C6]" aria-hidden="true" />
                <span>Admin Panel</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
