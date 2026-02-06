'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { PaymentConfig } from "@/lib/types";
import { collection, doc, writeBatch } from "firebase/firestore";
import { ArrowLeft, Loader2, CreditCard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

type CartItem = {
    id: string;
    gameId: string;
    quantity: number;
    title: string;
    price: number;
    imageUrl: string;
}

export default function CheckoutPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // Redirect if not logged in
    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);

    // Fetch Cart Items
    const cartQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return collection(firestore, 'users', user.uid, 'carts');
    }, [firestore, user]);
    const { data: cartItems, isLoading: isCartLoading } = useCollection<CartItem>(cartQuery);

    // Fetch Payment QR Code
    const paymentConfigRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'payment_qr', 'current');
    }, [firestore]);
    const { data: paymentConfig, isLoading: isPaymentConfigLoading } = useDoc<PaymentConfig>(paymentConfigRef);

    const total = cartItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) ?? 0;

    const handlePlaceOrder = async () => {
        if (!firestore || !user || !cartItems || cartItems.length === 0) return;

        setIsPlacingOrder(true);

        const newOrderData = {
            userId: user.uid,
            userEmail: user.email,
            items: cartItems.map(item => ({
                gameId: item.gameId,
                title: item.title,
                price: item.price,
                quantity: item.quantity,
            })),
            totalAmount: total,
            status: false,
            createdAt: Date.now()
        };

        const batch = writeBatch(firestore);

        const ordersCollectionRef = collection(firestore, 'users', user.uid, 'orders');
        const newOrderRef = doc(ordersCollectionRef);
        batch.set(newOrderRef, newOrderData);

        cartItems.forEach(item => {
            const cartItemRef = doc(firestore, 'users', user.uid, 'carts', item.id);
            batch.delete(cartItemRef);
        });

        try {
            await batch.commit();

            toast({
                title: "Order Placed!",
                description: "Your order has been submitted. Thank you!",
            });
            
            router.push('/orders');
        } catch (error: any) {
             toast({
                variant: "destructive",
                title: "Order Failed",
                description: error.message || "There was a problem placing your order.",
            });
            setIsPlacingOrder(false);
        }
    };

    if (isUserLoading || isCartLoading || isPaymentConfigLoading || !user) {
        return (
            <div className="container py-12">
                <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </div>
        );
    }
    
    if (!isCartLoading && (!cartItems || cartItems.length === 0)) {
         return (
            <div className="container py-12 text-center">
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
                        <CardTitle>Your cart is empty</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>You need to add items to your cart before you can checkout.</CardDescription>
                         <Button asChild className="mt-4">
                            <Link href="/games">Explore Games</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
         )
    }

    return (
        <div className="container py-12">
            <div className="mb-8">
                <Button variant="ghost" asChild>
                    <Link href="/cart"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart</Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <Card className="glassmorphism">
                        <CardHeader>
                            <CardTitle>Complete Your Payment</CardTitle>
                            <CardDescription>Scan the QR code with your payment app and then click "Place Order".</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-6">
                            {paymentConfig?.qrCodeUrl ? (
                                <div className="relative w-64 h-64 rounded-lg overflow-hidden border bg-white p-2">
                                    <Image src={paymentConfig.qrCodeUrl} alt="Payment QR Code" fill className="object-contain" />
                                </div>
                            ) : (
                                <div className="w-64 h-64 rounded-lg border flex items-center justify-center bg-muted text-muted-foreground">
                                    <p>QR Code not available</p>
                                </div>
                            )}
                             <p className="text-sm text-center text-muted-foreground">
                                After completing the payment, please click the button below to confirm your order. Your order status will be updated to 'Delivered' once payment is manually verified.
                            </p>
                            <Button size="lg" className="w-full" onClick={handlePlaceOrder} disabled={isPlacingOrder}>
                                {isPlacingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isPlacingOrder ? "Placing Order..." : "Place Order"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                
                <div>
                     <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <ul className="divide-y">
                                    {cartItems.map(item => (
                                        <li key={item.id} className="flex items-center justify-between py-2">
                                            <div className="flex items-center gap-3">
                                                 <Image src={item.imageUrl} alt={item.title} width={48} height={48} className="rounded-md object-cover" />
                                                 <div>
                                                    <p className="font-medium">{item.title}</p>
                                                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                                 </div>
                                            </div>
                                            <p>₹{item.price.toFixed(2)}</p>
                                        </li>
                                    ))}
                                </ul>
                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Subtotal</span>
                                        <span>₹{total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>₹{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                     </Card>
                </div>
            </div>
        </div>
    );
}
