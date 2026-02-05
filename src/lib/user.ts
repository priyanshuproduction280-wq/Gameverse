'use client';

import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { initializeFirebase } from '@/firebase';

/**
 * Creates a user profile document in Firestore ONLY if it doesn't already exist.
 * This prevents overwriting existing data (like the `isAdmin` flag) on subsequent logins.
 *
 * @param user The Firebase Auth User object.
 */
export async function ensureUserProfileDocument(user: User) {
  const { firestore } = initializeFirebase();
  if (!user) return;

  const userRef = doc(firestore, `users/${user.uid}`);

  // Check if the document already exists
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    // Document does not exist, so create it.
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      isAdmin: false, // Explicitly set isAdmin to false on creation
    };
    // Use a standard setDoc, no merge needed since it's a new doc.
    await setDoc(userRef, userData);
  }
  // If the document exists, we do nothing to preserve its existing state.
}
