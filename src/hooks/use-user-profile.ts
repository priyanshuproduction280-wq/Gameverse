'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { UserProfile } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { useMemo } from 'react';

// The AppUserProfile combines the Firestore document with live auth state.
// It is the single source of truth for the user's profile in the app.
export type AppUserProfile = UserProfile;

type UseUserProfileReturn = {
  userProfile: AppUserProfile | null;
  isLoading: boolean;
};

export function useUserProfile(): UseUserProfileReturn {
  const { user: authUser, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return doc(firestore, 'users', authUser.uid);
  }, [firestore, authUser]);

  // Fetch the entire user profile from Firestore, which now includes the 'isAdmin' flag.
  const { data: userDoc, isLoading: isDocLoading } = useDoc<UserProfile>(userDocRef);

  const userProfile = useMemo((): AppUserProfile | null => {
    if (!authUser) return null;

    // The final user profile object is composed here.
    return {
      uid: authUser.uid,
      // We prioritize data from the Firestore document, falling back to the auth object.
      email: userDoc?.email ?? authUser.email,
      displayName: userDoc?.displayName ?? authUser.displayName,
      photoURL: userDoc?.photoURL ?? authUser.photoURL,
      username: userDoc?.username,
      phoneNumber: userDoc?.phoneNumber,
      // `isAdmin` is now sourced directly from the user document.
      // The `?? false` ensures that if the field is missing, the user is not an admin.
      isAdmin: userDoc?.isAdmin ?? false,
    };
  }, [authUser, userDoc]);

  return {
    userProfile,
    // Loading is complete once both auth state and the Firestore document are loaded.
    isLoading: isAuthLoading || isDocLoading,
  };
}
