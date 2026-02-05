'use client';

import { getFirestore, doc, setDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { initializeFirebase } from '@/firebase';

/**
 * Creates or updates a user profile document in Firestore.
 * This function is designed to be called after a user signs in or signs up.
 * It uses `setDoc` with `merge: true` to avoid overwriting existing data
 * and to create the document if it doesn't exist.
 *
 * @param user The Firebase Auth User object.
 */
export async function ensureUserProfileDocument(user: User) {
  const { firestore } = initializeFirebase();
  if (!user) return;

  const userRef = doc(firestore, `users/${user.uid}`);
  
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    // New users are not admins by default.
    // The isAdmin flag would be set through a separate admin process.
    isAdmin: false 
  };

  // Use setDoc with merge: true to create or update the document
  await setDoc(userRef, userData, { merge: true });
}
