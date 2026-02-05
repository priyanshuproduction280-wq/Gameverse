'use client';

import type { ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <FirebaseClientProvider>
      {children}
      <Toaster />
    </FirebaseClientProvider>
  );
}
