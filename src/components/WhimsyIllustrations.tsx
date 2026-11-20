import React from 'react';

export const HandDrawnStar: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
    <path
      d="M18 3C18.9 11.5 24.5 17.1 33 18C24.5 18.9 18.9 24.5 18 33C17.1 24.5 11.5 18.9 3 18C11.5 17.1 17.1 11.5 18 3Z"
      fill="currentColor"
      fillOpacity="0.22"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const HandDrawnButterfly: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 48 40" fill="none" className={className} aria-hidden="true">
    <path
      d="M24 14C20 6 8 4 6 12C4.5 18 11 23 19 21C12 24 9 31 14 34C18 36.5 23 31 24 25"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.12"
    />
    <path
      d="M24 14C28 6 40 4 42 12C43.5 18 37 23 29 21C36 24 39 31 34 34C30 36.5 25 31 24 25"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.12"
    />
    <path d="M24 12V28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M24 12C22 8 20 6 18 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M24 12C26 8 28 6 30 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const HandDrawnCloud: React.FC<{ className?: string }> = ({ className = 'w-12 h-8' }) => (
  <svg viewBox="0 0 64 36" fill="none" className={className} aria-hidden="true">
    <path
      d="M14 29H50C55.5 29 59 25.2 59 20.5C59 16.2 55.8 12.6 51.3 12C49.8 6.8 44.8 3 39 3C33.5 3 28.8 6.3 27 11C25.6 10.4 24 10 22.3 10C16.2 10 11.4 14.5 11.1 20.4C7.6 21.1 5 23.8 5 26.8C5 28.1 9 29 14 29Z"
      fill="currentColor"
      fillOpacity="0.15"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const HandDrawnRibbon: React.FC<{ className?: string }> = ({ className = 'w-9 h-7' }) => (
  <svg viewBox="0 0 48 36" fill="none" className={className} aria-hidden="true">
    <path
      d="M24 17C18 9 7 7 6 14C5 20 15 22 24 17Z"
      fill="currentColor"
      fillOpacity="0.18"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24 17C30 9 41 7 42 14C43 20 33 22 24 17Z"
      fill="currentColor"
      fillOpacity="0.18"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M24 18L16 31M24 18L32 31" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="24" cy="17" r="2.5" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

export const HandDrawnWildflower: React.FC<{ className?: string }> = ({ className = 'w-8 h-10' }) => (
  <svg viewBox="0 0 40 52" fill="none" className={className} aria-hidden="true">
    <path d="M20 48C20 36 19 28 20 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path
      d="M20 36C14 34 11 30 12 27C15 27 18 31 20 36Z"
      fill="currentColor"
      fillOpacity="0.14"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 32C26 30 29 26 28 23C25 23 22 27 20 32Z"
      fill="currentColor"
      fillOpacity="0.14"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="20" cy="13" r="3" fill="currentColor" fillOpacity="0.35" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M20 4C21.8 6.5 21.8 9 20 10C18.2 9 18.2 6.5 20 4Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M28.5 9.5C27.5 12.2 25.5 13 23.5 12.5C24 10.5 26 9 28.5 9.5Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M11.5 9.5C12.5 12.2 14.5 13 16.5 12.5C16 10.5 14 9 11.5 9.5Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M27.5 18.5C25 18.5 23 17 22.8 15C24.8 14.5 26.8 16 27.5 18.5Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M12.5 18.5C15 18.5 17 17 17.2 15C15.2 14.5 13.2 16 12.5 18.5Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);
