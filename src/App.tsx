/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { WorkInfoSection } from './components/WorkInfoSection';
import { EarningsSection } from './components/EarningsSection';
import { MonthlyCalculatorSection } from './components/MonthlyCalculatorSection';
import { FaqSection } from './components/FaqSection';
import { InstagramBonusSection } from './components/InstagramBonusSection';
import { RequirementsSection } from './components/RequirementsSection';
import { InstagramPromoSection } from './components/InstagramPromoSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ChatbotWidget } from './components/ChatbotWidget';
import { SiteNotifications } from './components/SiteNotifications';
import { RegistrationModalProvider } from './context/RegistrationModalContext';

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleOpenChatbot = useCallback(() => setIsChatOpen(true), []);
  const handleCloseChatbot = useCallback(() => setIsChatOpen(false), []);

  return (
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
          <InstagramPromoSection />
          <ContactSection />
        </main>
        <Footer />
        <FloatingWhatsApp />
        <ChatbotWidget
          isOpen={isChatOpen}
          onOpen={handleOpenChatbot}
          onClose={handleCloseChatbot}
        />
        <SiteNotifications
          isChatOpen={isChatOpen}
          onOpenChatbot={handleOpenChatbot}
        />
      </div>
    </RegistrationModalProvider>
  );
}
