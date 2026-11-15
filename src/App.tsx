/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { WorkInfoSection } from './components/WorkInfoSection';
import { EarningsSection } from './components/EarningsSection';
import { RequirementsSection } from './components/RequirementsSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050d1f] text-white">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <WorkInfoSection />
        <EarningsSection />
        <RequirementsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
