import React from 'react';
import brandLogoImg from '../assets/images/wolt_qeydiyyat_baku_logo_1794724804911.jpg';

interface BrandLogoProps {
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 ${className}`}>
      <span className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-sky-400/50 bg-[#0c2350] shadow-md shadow-blue-950/60 shrink-0">
        <img
          src={brandLogoImg}
          alt="Wolt Qeydiyyatı - Bakı loqosu"
          className="h-full w-full object-cover scale-[1.13]"
        />
      </span>
      <span className="font-[var(--font-display)] text-base sm:text-lg font-extrabold tracking-tight text-white">
        FLASHLY FLEET
      </span>
    </span>
  );
};
