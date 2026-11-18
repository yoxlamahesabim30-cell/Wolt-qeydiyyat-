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
        <radialGradient id={gradientId} cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#FDF497" />
          <stop offset="5%" stopColor="#FDF497" />
          <stop offset="45%" stopColor="#FD5949" />
          <stop offset="60%" stopColor="#D6249F" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill={`url(#${gradientId})`} />
      <rect x="6.25" y="6.25" width="11.5" height="11.5" rx="3.4" stroke="#FFFFFF" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="2.8" stroke="#FFFFFF" strokeWidth="1.75" />
      <circle cx="15.7" cy="8.3" r="0.95" fill="#FFFFFF" />
    </svg>
  );
};
