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
import { useAuth, useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc, orderBy, query } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import type { Order } from "@/lib/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Schema for form validation
const profileFormSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name is too long."),
  username: z.string().min(3, "Username must be at least 3 characters.").max(30, "Username is too long.").optional().or(z.literal('')),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits.").optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;


function OrderHistory() {
  const { userProfile } = useUserProfile();
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!userProfile) return null;
    return query(collection(firestore, 'users', userProfile.uid, 'orders'), orderBy('createdAt', 'desc'));
  }, [firestore, userProfile]);

  const { data: orders, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);

  return (
    <Card id="orders" className="max-w-2xl mx-auto glassmorphism mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">My Orders</CardTitle>
        <CardDescription>View your past orders.</CardDescription>
      </CardHeader>
      <CardContent>
        {areOrdersLoading && (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        )}
        {!areOrdersLoading && (!orders || orders.length === 0) && (
          <p className="text-muted-foreground text-center py-8">You have no orders yet.</p>
        )}
        {!areOrdersLoading && orders && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="p-4 border rounded-lg bg-card/50">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-semibold text-sm">
                      Order ID: <span className="font-mono text-xs">{order.id.substring(0, 8)}...</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(order.createdAt), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <Badge variant={order.status === 'Delivered' ? 'secondary' : 'default'}>{order.status}</Badge>
                </div>
                <div className="mt-4">
                  <ul className="space-y-3">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between items-center text-sm">
                        <span className="flex-grow truncate pr-4">{item.title} <span className="text-muted-foreground"> (x{item.quantity})</span></span>
                        <span className="font-medium">₹{item.price.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

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
      <OrderHistory />
    </div>
  );
}
