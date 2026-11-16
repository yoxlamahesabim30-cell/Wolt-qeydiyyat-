import React, { useId } from 'react';

interface InstagramIconProps {
  className?: string;
}

export const InstagramIcon: React.FC<InstagramIconProps> = ({ className = 'h-4 w-4' }) => {
  const gradientId = useId();

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0099C6" />
          <stop offset="100%" stopColor="#007FA6" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill={`url(#${gradientId})`} />
      <rect x="6.5" y="6.5" width="11" height="11" rx="3.2" stroke="#F8FAFC" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2.7" stroke="#F8FAFC" strokeWidth="1.8" />
      <circle cx="15.8" cy="8.2" r="0.95" fill="#F8FAFC" />
    </svg>
  );
};
