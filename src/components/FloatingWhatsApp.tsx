import React from 'react';
import { LINKS } from '../data/fleetData';

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
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 sm:h-7 sm:w-7 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M12.03 2C6.51 2 2.03 6.48 2.03 12c0 1.88.52 3.63 1.43 5.14L2 22l5.02-1.41A9.93 9.93 0 0 0 12.03 22c5.52 0 10-4.48 10-10S17.55 2 12.03 2Zm5.82 14.12c-.25.7-1.45 1.34-2 1.41-.51.07-1.15.1-1.85-.12-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.82-4.2-4.96-4.4-.15-.2-1.19-1.58-1.19-3.02 0-1.44.75-2.14 1.02-2.43.27-.29.59-.36.79-.36h.56c.18 0 .42-.07.66.5.25.59.84 2.04.91 2.19.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.31.4-.44.54-.15.15-.3.31-.13.61.18.3.78 1.29 1.68 2.09 1.16 1.03 2.13 1.35 2.44 1.5.3.15.48.12.66-.07.18-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.34.07.12.07.7-.18 1.4Z" />
      </svg>
    </a>
  );
};
