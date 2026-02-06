'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useDoc, useFirestore, useMemoFirebase, setDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { PaymentConfig } from "@/lib/types";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

const settingsFormSchema = z.object({
  qrCodeUrl: z.string().min(1, "Please upload an image for the QR code."),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function AdminSettingsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const paymentConfigRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'payment_qr', 'current');
  }, [firestore]);

  const { data: paymentConfig, isLoading } = useDoc<PaymentConfig>(paymentConfigRef);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      qrCodeUrl: "",
    },
  });

  const watchedQrCodeUrl = form.watch('qrCodeUrl');

  useEffect(() => {
    if (paymentConfig) {
      form.reset({
        qrCodeUrl: paymentConfig.qrCodeUrl,
      });
    }
  }, [paymentConfig, form]);

  const onSubmit = (data: SettingsFormValues) => {
    if (!paymentConfigRef) {
      toast({
        variant: "destructive",
        title: "Error updating settings",
        description: "Firestore is not available.",
      });
      return;
    }
    
    setDocumentNonBlocking(paymentConfigRef, data, { merge: false });
    toast({
      title: "Settings Updated",
      description: "The payment QR code has been updated.",
    });
  };

  return (
    <div className="space-y-6">
       <div>
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">Manage your application settings.</p>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Payment QR Code</CardTitle>
          <CardDescription>Update the QR code used for payments at checkout.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="qrCodeUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>QR Code Image</FormLabel>
                        <FormControl>
                          <Input 
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        field.onChange(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          This image will be displayed to users for payment.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Saving..." : "Save Settings"}
                  </Button>
                </form>
              </Form>
            </div>
            <div className="flex items-center justify-center">
                {isLoading && !watchedQrCodeUrl && <Skeleton className="w-64 h-64" />}
                {watchedQrCodeUrl ? (
                    <div className="relative w-64 h-64 rounded-lg overflow-hidden border">
                         <Image src={watchedQrCodeUrl} alt="Payment QR Code Preview" fill className="object-contain" />
                    </div>
                ) : !isLoading && (
                    <div className="w-64 h-64 rounded-lg border flex items-center justify-center bg-muted text-muted-foreground">
                        <p>No QR Code set</p>
                    </div>
                 )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
