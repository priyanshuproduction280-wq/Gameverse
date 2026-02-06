'use client';

import { useUserProfile } from "@/hooks/use-user-profile";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import type { Order } from "@/lib/types";
import { collection, orderBy, query } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function OrdersPage() {
  const { userProfile, isLoading: isProfileLoading } = useUserProfile();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!isProfileLoading && !userProfile) {
      router.push('/login');
    }
  }, [isProfileLoading, userProfile, router]);

  const ordersQuery = useMemoFirebase(() => {
    if (!userProfile) return null;
    return query(collection(firestore, 'users', userProfile.uid, 'orders'), orderBy('createdAt', 'desc'));
  }, [firestore, userProfile]);

  const { data: orders, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);

  if (isProfileLoading || !userProfile) {
    return <div className="flex min-h-screen items-center justify-center">Loading orders...</div>;
  }

  return (
    <div className="container py-12">
        <Card className="max-w-4xl mx-auto glassmorphism">
        <CardHeader>
            <CardTitle className="text-3xl font-headline">My Orders</CardTitle>
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
    </div>
  )
}
