'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Faq } from '@/components/faq';

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  if (isAdminPage || isAuthPage) {
    // Admin and Auth pages have their own layouts and should not be wrapped
    // by the main site's Header/Footer. They are rendered within a simple div
    // to ensure a consistent background and full height.
    return <div className="bg-background min-h-dvh">{children}</div>;
  }

  // For all other public-facing pages, wrap with the main site layout.
  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Faq />
      <Footer />
    </div>
  );
}
