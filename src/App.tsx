/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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

export default function App() {
  return (
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
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
