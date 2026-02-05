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

  const adminRoleRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return doc(firestore, 'roles_admin', authUser.uid);
  }, [firestore, authUser]);

  const { data: adminRoleDoc, isLoading: isAdminRoleLoading } = useDoc<{ isAdmin: boolean }>(adminRoleRef);


  const userProfile = useMemo(() => {
    if (!authUser) return null;
    
    // The user document from Firestore is the source of truth for profile data
    // but we can fall back to the auth user's data if the doc is loading or doesn't exist.
    return {
      uid: authUser.uid,
      email: userDoc?.email ?? authUser.email,
      displayName: userDoc?.displayName ?? authUser.displayName,
      photoURL: userDoc?.photoURL ?? authUser.photoURL,
      username: userDoc?.username,
      phoneNumber: userDoc?.phoneNumber,
      isAdmin: !!adminRoleDoc, // Admin status is determined by the existence of the admin role doc
    };
  }, [authUser, userDoc, adminRoleDoc]);

  return {
    userProfile,
    isLoading: isAuthLoading || isDocLoading || isAdminRoleLoading,
  };
}
