"use client";

import { ReactNode } from 'react';

interface GlassDivProps {
  children: ReactNode;
  className?: string;
}

export default function GlassDiv({ children, className = '' }: GlassDivProps) {
  return (
    <div 
      className={`backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 rounded-2xl border border-white/20 shadow-lg p-6 ${className}`}
    >
      {children}
    </div>
  );
}

