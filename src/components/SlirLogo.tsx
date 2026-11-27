import React from 'react';

export function SlirPulseMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="#f97316" strokeWidth="2" strokeOpacity="0.4" />
      <circle cx="12" cy="12" r="5" fill="#f97316" />
      <circle cx="12" cy="12" r="2" fill="#fff" />
    </svg>
  );
}
