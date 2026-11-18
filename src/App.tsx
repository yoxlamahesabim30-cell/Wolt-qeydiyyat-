/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { WorkInfoSection } from './components/WorkInfoSection';
import { EarningsSection } from './components/EarningsSection';
import { MonthlyCalculatorSection } from './components/MonthlyCalculatorSection';
import { FaqSection } from './components/FaqSection';
import { InstagramBonusSection } from './components/InstagramBonusSection';
import { RequirementsSection } from './components/RequirementsSection';
import { ReferralSection } from './components/ReferralSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ChatbotWidget } from './components/ChatbotWidget';
import { AdminPanelModal } from './components/AdminPanelModal';
import { InstagramPromoPopup } from './components/InstagramPromoPopup';
import { RegistrationModalProvider } from './context/RegistrationModalContext';
import { SiteConfigProvider } from './context/SiteConfigContext';

export default function App() {
  const [adminOpen, setAdminOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.location.hash === '#admin';
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setAdminOpen(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleCloseAdmin = () => {
    setAdminOpen(false);
    if (window.location.hash === '#admin') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  return (
    <SiteConfigProvider>
      <RegistrationModalProvider>
        <div className="min-h-screen flex flex-col bg-[#EEF2F6] text-[#0B1B2B] dark:bg-[#0F172A] dark:text-[#E2E8F0] transition-colors">
          <Header />
          <main className="flex-1">
            <HeroSection />
            <WorkInfoSection />
            <EarningsSection />
            <MonthlyCalculatorSection />
            <FaqSection />
            <InstagramBonusSection />
            <RequirementsSection />
            <ReferralSection />
            <ContactSection />
          </main>
          <Footer onOpenAdmin={() => setAdminOpen(true)} />
          <FloatingWhatsApp />
          <ChatbotWidget />
          <InstagramPromoPopup />
          <AdminPanelModal isOpen={adminOpen} onClose={handleCloseAdmin} />
        </div>
      </RegistrationModalProvider>
    </SiteConfigProvider>
  );
}
