'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BrandLogoProps {
  variant?: 'light' | 'dark' | 'white';
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function BrandLogo({
  className = '',
  size = 'md',
}: BrandLogoProps) {
  const sizeClasses = {
    sm: 'h-8 sm:h-9 max-w-[140px]',
    md: 'h-11 sm:h-12 max-w-[190px]',
    lg: 'h-13 sm:h-14 max-w-[220px]',
  }[size];

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <Image
        src="/assets/All-White Logo.png"
        alt="Lobo Travels"
        width={240}
        height={88}
        className={`w-auto object-contain object-left transition-transform duration-300 group-hover:scale-105 ${sizeClasses}`}
        priority
      />
    </div>
  );
}

export function LogoLink({
  variant = 'white',
  size = 'md',
  className = '',
}: {
  variant?: 'light' | 'dark' | 'white';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  return (
    <Link
      href="/"
      id="brand-logo-link"
      className={`inline-flex items-center transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] ${className}`}
      aria-label="Lobo Travels - Home"
    >
      <BrandLogo variant={variant} size={size} />
    </Link>
  );
}
