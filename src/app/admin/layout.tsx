'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { userProfile, isLoading } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    // Only perform action once loading is complete.
    if (!isLoading) {
      // If there's no profile or the profile is not an admin, redirect.
      if (!userProfile?.isAdmin) {
        router.replace('/');
      }
    }
  }, [userProfile, isLoading, router]);

  // If the user is a confirmed admin, show the layout.
  if (!isLoading && userProfile?.isAdmin) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  // Otherwise, show a loading/verification screen.
  // This screen will be shown while loading, and for non-admins before they are redirected.
  return (
    <div className="flex h-screen items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-2">
         <div className="w-8 h-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <p className="text-muted-foreground">Verifying admin access...</p>
      </div>
    </div>
  );
}
