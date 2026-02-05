'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { UserProfile } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { useMemo } from 'react';

// The AppUserProfile combines the Firestore document with live auth state
export type AppUserProfile = UserProfile & {
  isAdmin: boolean;
};

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

  // We fetch the base profile from Firestore. This type no longer has `isAdmin`.
  const { data: userDoc, isLoading: isDocLoading } = useDoc<UserProfile>(userDocRef);

  const adminRoleRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    // This is the source of truth for admin status.
    return doc(firestore, 'roles_admin', authUser.uid);
  }, [firestore, authUser]);

  // We fetch the admin role document. Its existence grants admin rights.
  const { data: adminRoleDoc, isLoading: isAdminRoleLoading } = useDoc<{ isAdmin: boolean }>(adminRoleRef);


  const userProfile = useMemo((): AppUserProfile | null => {
    if (!authUser) return null;
    
    // The final user profile object is composed here.
    return {
      uid: authUser.uid,
      email: userDoc?.email ?? authUser.email,
      displayName: userDoc?.displayName ?? authUser.displayName,
      photoURL: userDoc?.photoURL ?? authUser.photoURL,
      username: userDoc?.username,
      phoneNumber: userDoc?.phoneNumber,
      // `isAdmin` is now determined ONLY by the existence of the admin role doc.
      isAdmin: !!adminRoleDoc, 
    };
  }, [authUser, userDoc, adminRoleDoc]);

  return {
    userProfile,
    isLoading: isAuthLoading || isDocLoading || isAdminRoleLoading,
  };
}
