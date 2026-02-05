'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { userProfile, isLoading } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !userProfile?.isAdmin) {
      router.replace('/');
    }
  }, [userProfile, isLoading, router]);

  if (isLoading || !userProfile?.isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-2">
           <div className="w-8 h-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}
