import React from 'react';

interface BrandLogoProps {
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 ${className}`}>
      <span
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-md shadow-blue-950/50"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-white fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13.5 2.5L4.5 13.5H11.5L10.5 21.5L19.5 10.5H12.5L13.5 2.5Z" />
        </svg>
      </span>
      <span className="font-[var(--font-display)] text-lg font-extrabold tracking-tight text-white">
        FLASHLY FLEET
      </span>
    </span>
  );
};
