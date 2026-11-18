import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Phone, MessageCircle, Clock, Moon, Sun } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { InstagramIcon } from './InstagramIcon';
import { LINKS, NAV_ITEMS, OFFICE_INFO } from '../data/fleetData';
import { useRegistrationModal } from '../context/RegistrationModalContext';
import { useSiteConfig } from '../context/SiteConfigContext';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TARGET_DEADLINE_MS = new Date('2026-11-30T23:59:59+04:00').getTime();
const THEME_STORAGE_KEY = 'flashly_theme_mode';

function getRemainingTime(): CountdownTime {
  const diff = Math.max(0, TARGET_DEADLINE_MS - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

export const Header: React.FC = () => {
  const { openRegistrationModal } = useRegistrationModal();
  const { config } = useSiteConfig();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [countdown, setCountdown] = useState<CountdownTime>(() => getRemainingTime());
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    } else {
      root.classList.remove('dark');
      window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCountdown(getRemainingTime());
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

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

  const formattedHours = String(countdown.hours).padStart(2, '0');
  const formattedMinutes = String(countdown.minutes).padStart(2, '0');
  const formattedSeconds = String(countdown.seconds).padStart(2, '0');

  return (
    <>
      {/* Soft Wolt Blue Gradient Announcement Strip */}
      <div className="bg-gradient-to-r from-[#0099C6] to-[#007FA6] text-[#F8FAFC]">
        <div className="mx-auto max-w-6xl px-4 py-2 text-center">
          <button
            type="button"
            onClick={openRegistrationModal}
            className="inline-flex flex-col items-center justify-center gap-0.5 hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8FAFC] rounded"
          >
            <span className="font-[var(--font-display)] text-base sm:text-lg font-extrabold tracking-wide text-[#F8FAFC]">
              30 Noyabr-dək Ödənişsiz Qeydiyyat
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#F8FAFC]/95 tabular-nums">
              <Clock className="h-3.5 w-3.5 text-[#F8FAFC] shrink-0" aria-hidden="true" />
              <span>
                Qalan vaxt: {countdown.days} gün {formattedHours} saat {formattedMinutes} dəq {formattedSeconds} san
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Soft Sticky Navigation */}
      <header className="sticky top-0 z-40 border-b border-[#0099C6]/20 bg-[#F8FAFC]/95 dark:bg-[#1E293B]/95 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#top"
            onClick={(e) => handleNavClick(e, '#top')}
            className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6] shrink-0"
            aria-label="FLASHLY FLEET Ana Səhifə"
          >
            <BrandLogo tone="dark" />
          </a>

          {/* Zone 2: Desktop Navigation Links */}
          <nav
            aria-label="Əsas naviqasiya"
            className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#0B1B2B] dark:text-[#E2E8F0]"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="whitespace-nowrap shrink-0 py-1.5 text-[#0B1B2B] dark:text-[#E2E8F0] hover:text-[#0099C6] dark:hover:text-[#0099C6] transition-colors duration-150 border-b-2 border-transparent hover:border-[#0099C6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0099C6] rounded-sm"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Theme Toggle + Instagram + Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              aria-label={isDark ? 'İşıqlı rejimə keç' : 'Qaranlıq rejimə keç'}
              title={isDark ? 'İşıqlı rejim' : 'Qaranlıq rejim'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#0099C6]/35 bg-[#E4F4FA] dark:bg-[#0F172A] text-[#0B1B2B] dark:text-[#E2E8F0] hover:border-[#0099C6] hover:scale-105 active:scale-95 transition-all duration-150 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-[#0099C6]" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4 text-[#0099C6]" aria-hidden="true" />
              )}
            </button>

            <a
              href={config.instagramPromo.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram səhifəmiz: ${config.instagramPromo.instagramHandle}`}
              title={`Instagram: ${config.instagramPromo.instagramHandle}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#0099C6]/35 bg-[#E4F4FA] dark:bg-[#0F172A] hover:border-[#0099C6] hover:scale-105 active:scale-95 transition-all duration-150 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>

            <button
              type="button"
              onClick={openRegistrationModal}
              className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl bg-[#0099C6] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-[#F8FAFC] shadow-sm hover:bg-[#007FA6] active:scale-[0.99] transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
            >
              <span>Qeydiyyat</span>
              <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileMenuOpen ? 'Menyunu bağla' : 'Menyunu aç'}
              className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#0099C6]/35 bg-[#E4F4FA] dark:bg-[#0F172A] text-[#0B1B2B] dark:text-[#E2E8F0] hover:bg-[#0099C6]/15 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
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
            className="md:hidden border-t border-[#0099C6]/20 bg-[#F8FAFC] dark:bg-[#1E293B] px-4 pb-5 pt-3 shadow-xl"
          >
            <nav aria-label="Mobil naviqasiya" className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="flex min-h-[44px] items-center justify-between rounded-xl px-3.5 py-2.5 text-base font-semibold text-[#0B1B2B] dark:text-[#E2E8F0] hover:bg-[#E4F4FA] dark:hover:bg-[#0F172A] hover:text-[#0099C6] transition-colors"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="h-4 w-4 text-[#0099C6]" aria-hidden="true" />
                </a>
              ))}
            </nav>

            <div className="mt-4 grid grid-cols-1 gap-2.5 border-t border-[#0099C6]/20 pt-4">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openRegistrationModal();
                }}
                className="flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#0099C6] px-4 py-3 text-sm font-bold text-[#F8FAFC] hover:bg-[#007FA6] transition-colors"
              >
                <span>Kuryer kimi qeydiyyatdan keç</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-2.5 text-xs font-bold text-[#0B1B2B] hover:bg-[#20bd5a] transition-colors"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={LINKS.phoneHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#0099C6] px-3 py-2.5 text-xs font-bold text-[#F8FAFC] hover:bg-[#007FA6] transition-colors"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
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
