'use client';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { Game } from "@/lib/types";
import { collection } from "firebase/firestore";
import { Info, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type CartItem = {
    id: string;
    gameId: string;
    quantity: number;
    title: string;
    price: number;
    imageUrl: string;
}

export default function CartPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const firestore = useFirestore();

    const cartQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return collection(firestore, 'users', user.uid, 'carts');
    }, [firestore, user]);

    const { data: cartItems, isLoading: isCartLoading } = useCollection<CartItem>(cartQuery);

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading || !user) {
        return <div className="container py-12 text-center">Loading...</div>
    }

    const total = cartItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) ?? 0;

    return (
        <div className="container py-12">
            <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
            {isCartLoading && (
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            )}

            {!isCartLoading && (!cartItems || cartItems.length === 0) && (
                <Card className="text-center py-16">
                    <CardContent className="space-y-4">
                        <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
                        <p className="text-muted-foreground">Looks like you haven't added any games yet.</p>
                        <Button asChild>
                            <Link href="/games">Explore Games</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {!isCartLoading && cartItems && cartItems.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card>
                             <CardContent className="divide-y">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 py-4">
                                        <Image src={item.imageUrl} alt={item.title} width={96} height={96} className="rounded-md object-cover" />
                                        <div className="flex-grow">
                                            <h3 className="font-semibold">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold">₹{item.price.toFixed(2)}</p>
                                    </div>
                                ))}
                             </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                <Button className="w-full" disabled>Proceed to Checkout</Button>
                                 <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertTitle>Checkout Unavailable</AlertTitle>
                                    <AlertDescription>
                                        The checkout and payment functionality is currently under construction.
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
