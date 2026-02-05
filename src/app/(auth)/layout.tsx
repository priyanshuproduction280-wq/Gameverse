import { GamerVerseLogo } from '@/components/icons';
import Link from 'next/link';
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center p-4">
       <Link href="/" className="mb-8">
          <GamerVerseLogo className="text-3xl" />
        </Link>
      {children}
    </div>
  );
}
