import React from 'react';
import brandLogoImg from '../assets/images/wolt_qeydiyyat_baku_logo_1794724804911.jpg';

interface BrandLogoProps {
  className?: string;
  tone?: 'dark' | 'light';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  tone = 'dark',
}) => {
  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 ${className}`}>
      <span className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-[#0099C6] bg-[#E4F4FA] dark:bg-[#1E293B] shadow-sm shrink-0">
        <img
          src={brandLogoImg}
          alt="Wolt Qeydiyyatı - Bakı loqosu"
          className="h-full w-full object-cover scale-[1.13]"
        />
      </span>
      <span
        className={`font-[var(--font-display)] text-base sm:text-lg font-extrabold tracking-tight ${
          tone === 'light'
            ? 'text-[#E2E8F0]'
            : 'text-[#0B1B2B] dark:text-[#E2E8F0]'
        }`}
      >
        FLASHLY FLEET
      </span>
    </span>
  );
};
