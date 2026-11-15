/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { WorkInfoSection } from './components/WorkInfoSection';
import { EarningsSection } from './components/EarningsSection';
import { MonthlyCalculatorSection } from './components/MonthlyCalculatorSection';
import { SuccessStoriesSection } from './components/SuccessStoriesSection';
import { FaqSection } from './components/FaqSection';
import { InstagramBonusSection } from './components/InstagramBonusSection';
import { RequirementsSection } from './components/RequirementsSection';
import { ReferralSection } from './components/ReferralSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { LiveRegistrationToast } from './components/LiveRegistrationToast';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050d1f] text-white">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <WorkInfoSection />
        <EarningsSection />
        <MonthlyCalculatorSection />
        <SuccessStoriesSection />
        <FaqSection />
        <InstagramBonusSection />
        <RequirementsSection />
        <ReferralSection />
        <ContactSection />
      </main>
      <Footer />
      <LiveRegistrationToast />
      <FloatingWhatsApp />
    </div>
  );
}
