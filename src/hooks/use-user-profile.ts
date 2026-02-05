'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { UserProfile } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { useMemo } from 'react';

type UseUserProfileReturn = {
  userProfile: UserProfile | null;
  isLoading: boolean;
};

export function useUserProfile(): UseUserProfileReturn {
  const { user: authUser, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return doc(firestore, 'users', authUser.uid);
  }, [firestore, authUser]);

  const { data: userDoc, isLoading: isDocLoading } = useDoc<UserProfile>(userDocRef);

  const userProfile = useMemo(() => {
    if (!authUser) return null;
    
    // The user document from Firestore is the source of truth for profile data
    // but we can fall back to the auth user's data if the doc is loading or doesn't exist.
    return {
      uid: authUser.uid,
      email: userDoc?.email ?? authUser.email,
      displayName: userDoc?.displayName ?? authUser.displayName,
      photoURL: userDoc?.photoURL ?? authUser.photoURL,
      isAdmin: userDoc?.isAdmin ?? false, // Default to false
    };
  }, [authUser, userDoc]);

  return {
    userProfile,
    isLoading: isAuthLoading || isDocLoading,
  };
}
