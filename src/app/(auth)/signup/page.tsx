'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { ensureUserProfileDocument } from '@/lib/user';

export default function SignupPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await ensureUserProfileDocument(result.user);
      router.push('/');
      toast({
        title: 'Account created!',
        description: "You're now signed in.",
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not sign up with Google.',
      });
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Passwords do not match.',
        description: 'Please check your passwords and try again.',
      });
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // We can extract a display name from the email
      const displayName = email.split('@')[0];
      await updateProfile(userCredential.user, { displayName });
      
      // We need to pass the updated user object to create the profile
      await ensureUserProfileDocument({ ...userCredential.user, displayName });

      router.push('/');
      toast({
        title: 'Account created!',
        description: "You're now signed in.",
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not create account.',
      });
    }
  };

  if (isUserLoading || (!isUserLoading && user)) {
     return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <Card className="w-full max-w-md glassmorphism">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
        <CardDescription>Join GamerVerse to start your collection.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEmailSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full font-bold">Create Account</Button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={handleGoogleSignUp}>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A8.003 8.003 0 0 1 24 36c-5.225 0-9.552-3.444-11.082-8.06l-6.573 4.82C9.656 39.663 16.318 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C42.012 35.196 44 30.028 44 24c0-1.341-.138-2.65-.389-3.917z"/>
          </svg>
          Sign Up with Google
        </Button>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-accent hover:underline">
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
