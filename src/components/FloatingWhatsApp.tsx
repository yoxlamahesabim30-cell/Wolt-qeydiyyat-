import React from 'react';
import { LINKS } from '../data/fleetData';
import { WhatsAppIcon } from './WhatsAppIcon';

const PREFILLED_WHATSAPP_URL = `${LINKS.whatsapp}?text=${encodeURIComponent(
  'Salam! FLASHLY FLEET haqqında məlumat almaq istəyirəm.'
)}`;

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href={PREFILLED_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ilə əlaqə saxla"
      title="WhatsApp ilə yaz"
      className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-30 inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#25D366] text-[#F8FAFC] shadow-xl shadow-[#0B1B2B]/30 ring-2 ring-[#F8FAFC]/25 hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
    >
      <WhatsAppIcon variant="glyph" className="h-6 w-6 sm:h-7 sm:w-7" />
    </a>
  );
};
