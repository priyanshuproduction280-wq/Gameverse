'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, orderBy, query } from 'firebase/firestore';
import type { ContactMessage } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { format } from 'date-fns';
import { Mail } from 'lucide-react';

export default function AdminMessagesPage() {
  const firestore = useFirestore();

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'contact_messages'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: messages, isLoading } = useCollection<ContactMessage>(messagesQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Messages</CardTitle>
        <CardDescription>Messages submitted through the contact form.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        )}
        {!isLoading && messages && messages.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            {messages.map((message) => (
              <AccordionItem key={message.id} value={message.id}>
                <AccordionTrigger>
                  <div className="flex justify-between items-center w-full pr-4">
                    <div className="text-left">
                      <p className="font-semibold">{message.subject}</p>
                      <p className="text-sm text-muted-foreground">From: {message.name} ({message.email})</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(message.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="prose prose-invert max-w-none text-muted-foreground leading-relaxed p-4 bg-secondary/30 rounded-md">
                  <p>{message.message}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
        {!isLoading && (!messages || messages.length === 0) && (
           <div className="text-center py-16 text-muted-foreground">
             <Mail className="mx-auto h-12 w-12" />
             <h3 className="mt-4 text-lg font-semibold">No Messages</h3>
             <p>There are no messages yet.</p>
           </div>
        )}
      </CardContent>
    </Card>
  );
}
