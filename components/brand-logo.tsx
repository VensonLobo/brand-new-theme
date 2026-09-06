'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { LOBO_LOGO_BASE64 } from '@/lib/logo-data';

const LOBO_LOGO_SRC = '/lobotravels-all-whitelogo.png';

interface BrandLogoProps {
  variant?: 'light' | 'dark' | 'white';
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function BrandLogo({ className = '', size = 'md' }: BrandLogoProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(LOBO_LOGO_SRC);
  const sizeClasses = {
    sm: 'h-8 sm:h-9 max-w-[140px]',
    md: 'h-11 sm:h-12 max-w-[190px]',
    lg: 'h-13 sm:h-14 max-w-[220px]',
  }[size];

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={currentSrc}
        alt="Lobo Travels"
        width={240}
        height={88}
        className={`w-auto object-contain object-left transition-transform duration-300 group-hover:scale-105 ${sizeClasses}`}
        loading="eager"
        decoding="sync"
        onError={() => {
          if (currentSrc !== LOBO_LOGO_BASE64) {
            setCurrentSrc(LOBO_LOGO_BASE64);
          }
        }}
      />
    </div>
  );
}
