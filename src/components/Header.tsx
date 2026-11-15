import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Phone, MessageCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { InstagramIcon } from './InstagramIcon';
import { CAMPAIGN_TEXT, LINKS, NAV_ITEMS, OFFICE_INFO } from '../data/fleetData';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      setMobileMenuOpen(false);
      const target = document.getElementById(href.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      {/* Bright Yellow Campaign Banner */}
      <div className="bg-yellow-400 text-slate-950 border-b border-yellow-500/40">
        <div className="mx-auto max-w-6xl px-4 py-2.5 text-center">
          <a
            href={LINKS.registration}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-extrabold tracking-wide text-slate-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 rounded"
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
            </span>
            <span>{CAMPAIGN_TEXT}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Single-row 3-zone Sticky Navigation */}
      <header className="sticky top-0 z-40 border-b border-blue-400/15 bg-[#050e23]/92 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#top"
            onClick={(e) => handleNavClick(e, '#top')}
            className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 shrink-0"
            aria-label="FLASHLY FLEET Ana Səhifə"
          >
            <BrandLogo />
          </a>

          {/* Zone 2: Desktop Navigation Links */}
          <nav
            aria-label="Əsas naviqasiya"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-200"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="whitespace-nowrap shrink-0 py-1.5 text-slate-200 hover:text-white transition-colors duration-150 border-b-2 border-transparent hover:border-sky-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 rounded-sm"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary Action + Instagram + Mobile Menu Trigger */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <a
              href={LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram səhifəmiz: ${LINKS.instagramHandle}`}
              title={`Instagram: ${LINKS.instagramHandle}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-pink-400/30 bg-[#0b1938] hover:border-pink-400/70 hover:scale-105 active:scale-95 transition-all duration-150 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>

            <a
              href={LINKS.registration}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl bg-yellow-400 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 shadow-sm hover:bg-yellow-300 active:scale-[0.99] transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
            >
              <span>Qeydiyyat</span>
              <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileMenuOpen ? 'Menyunu bağla' : 'Menyunu aç'}
              className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/25 bg-blue-950/60 text-white hover:bg-blue-900/70 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-drawer"
            className="md:hidden border-t border-blue-400/15 bg-[#061129] px-4 pb-5 pt-3 shadow-2xl"
          >
            <nav aria-label="Mobil naviqasiya" className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="flex min-h-[44px] items-center justify-between rounded-xl px-3.5 py-2.5 text-base font-medium text-slate-100 hover:bg-blue-900/50 hover:text-white transition-colors"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="h-4 w-4 text-sky-400" aria-hidden="true" />
                </a>
              ))}
            </nav>

            <div className="mt-4 grid grid-cols-1 gap-2.5 border-t border-blue-400/15 pt-4">
              <a
                href={LINKS.registration}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-yellow-300 transition-colors"
              >
                <span>Qeydiyyatdan Keç</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-blue-400/25 bg-blue-950/60 px-3 py-2.5 text-xs font-semibold text-white hover:bg-blue-900/60 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-sky-400" aria-hidden="true" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={LINKS.phoneHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-blue-400/25 bg-blue-950/60 px-3 py-2.5 text-xs font-semibold text-white hover:bg-blue-900/60 transition-colors"
                >
                  <Phone className="h-4 w-4 text-sky-400" aria-hidden="true" />
                  <span>{OFFICE_INFO.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
