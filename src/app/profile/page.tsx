'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useAuth, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

// Schema for form validation
const profileFormSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name is too long."),
  username: z.string().min(3, "Username must be at least 3 characters.").max(30, "Username is too long.").optional().or(z.literal('')),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits.").optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { userProfile, isLoading: isProfileLoading } = useUserProfile();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: "",
      username: "",
      phoneNumber: "",
    },
  });

  // If user is not logged in, redirect to login page
  useEffect(() => {
    if (!isProfileLoading && !userProfile) {
      router.push('/login');
    }
  }, [isProfileLoading, userProfile, router]);
  
  // Populate form with user data once it's loaded
  useEffect(() => {
    if (userProfile) {
      form.reset({
        displayName: userProfile.displayName || "",
        username: userProfile.username || "",
        phoneNumber: userProfile.phoneNumber || "",
      });
    }
  }, [userProfile, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!userProfile || !auth.currentUser) {
      toast({
        variant: "destructive",
        title: "Not authenticated",
        description: "You must be logged in to update your profile.",
      });
      return;
    }

    try {
      // 1. Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: data.displayName,
      });

      // 2. Update Firestore document
      const userDocRef = doc(firestore, "users", userProfile.uid);
      setDocumentNonBlocking(userDocRef, {
        displayName: data.displayName,
        username: data.username,
        phoneNumber: data.phoneNumber,
      }, { merge: true });

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "An error occurred while updating your profile.",
      });
    }
  };

  if (isProfileLoading || !userProfile) {
    return <div className="flex min-h-screen items-center justify-center">Loading profile...</div>;
  }

  return (
    <div className="container py-12">
      <Card className="max-w-2xl mx-auto glassmorphism">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Your Profile</CardTitle>
          <CardDescription>Manage your account settings and personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="your_username" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your unique username.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Your phone number" {...field} />
                    </FormControl>
                     <FormDescription>
                      Used for account recovery and notifications.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input readOnly disabled value={userProfile.email || 'No email provided'} />
                </FormControl>
                <FormDescription>
                  Your email address cannot be changed.
                </FormDescription>
              </FormItem>

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
