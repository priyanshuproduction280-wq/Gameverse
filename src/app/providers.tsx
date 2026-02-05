'use client';

import type { ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: ReactNode }) {
  // In a real app, these would be your actual AuthProvider, CartProvider, etc.
  // For this scaffold, we just pass children through.
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
