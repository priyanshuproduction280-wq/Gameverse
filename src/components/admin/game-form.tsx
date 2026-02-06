'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import type { Game } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const slugify = (text: string) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

const gameFormSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  platform: z.enum(['PC']),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  shortDescription: z.string().min(10, 'Short description is too short.').max(160, 'Short description is too long.'),
  description: z.string().min(20, 'Description is too short.'),
  imageUrl: z.string().url('Must be a valid URL.'),
  bannerUrl: z.string().url('Must be a valid URL.'),
  tags: z.string().min(1, 'Please add at least one tag.').transform(val => val.split(',').map(tag => tag.trim())),
  rating: z.coerce.number().min(0).max(5).optional(),
  systemRequirements: z.object({
    os: z.string().optional(),
    processor: z.string().optional(),
    memory: z.string().optional(),
    graphics: z.string().optional(),
    storage: z.string().optional(),
  }).optional(),
});

type GameFormValues = z.infer<typeof gameFormSchema>;

type GameFormProps = {
  existingGame?: Game;
};

export function GameForm({ existingGame }: GameFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const defaultValues: Partial<GameFormValues> = existingGame
    ? { 
        ...existingGame, 
        tags: existingGame.tags?.join(', ') || '',
        rating: existingGame.rating || 0,
        systemRequirements: existingGame.systemRequirements || {},
      }
    : { platform: 'PC', price: 0, rating: 0, tags: '' };

  const form = useForm<GameFormValues>({
    resolver: zodResolver(gameFormSchema),
    defaultValues,
  });

  const onSubmit = (data: GameFormValues) => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Firestore not available' });
      return;
    }

    const slug = slugify(data.title);
    const gameData = { ...data, slug };

    try {
      if (existingGame) {
        // Update existing game
        const gameDocRef = doc(firestore, 'games', existingGame.id);
        updateDocumentNonBlocking(gameDocRef, gameData);
        toast({
          title: 'Game Updated',
          description: `${data.title} has been successfully updated.`,
        });
        router.push('/admin/games');
        router.refresh(); // Force a refresh to show updated data
      } else {
        // Add new game
        const gamesCollectionRef = collection(firestore, 'games');
        addDocumentNonBlocking(gamesCollectionRef, gameData);
        toast({
          title: 'Game Added',
          description: `${data.title} has been successfully added.`,
        });
        router.push('/admin/games');
      }
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'An error occurred',
            description: error.message || 'Could not save the game. Please try again.',
        });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
             <Card>
                <CardHeader><CardTitle>Core Details</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input placeholder="Cybernetic Horizons" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                            control={form.control}
                            name="platform"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Platform</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a platform" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="PC">PC</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Price (₹)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="59.99" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Rating (0-5)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.1" min="0" max="5" placeholder="4.5" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                                <Input placeholder="RPG, Sci-Fi, Open World" {...field} />
                            </FormControl>
                            <FormDescription>
                                Comma-separated list of tags.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
             </Card>

             <Card>
                <CardHeader><CardTitle>Descriptions</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                     <FormField
                        control={form.control}
                        name="shortDescription"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Short Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="A brief, catchy summary of the game for game cards." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Full Description</FormLabel>
                            <FormControl>
                                <Textarea rows={5} placeholder="The full, detailed description for the game's page." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>System Requirements</CardTitle></CardHeader>
                 <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="systemRequirements.os" render={({ field }) => (
                            <FormItem><FormLabel>Operating System</FormLabel><FormControl><Input placeholder="Windows 10 64-bit" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="systemRequirements.processor" render={({ field }) => (
                            <FormItem><FormLabel>Processor</FormLabel><FormControl><Input placeholder="Intel Core i5-9600K or AMD Ryzen 5 3600" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="systemRequirements.memory" render={({ field }) => (
                            <FormItem><FormLabel>Memory</FormLabel><FormControl><Input placeholder="16 GB RAM" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="systemRequirements.graphics" render={({ field }) => (
                            <FormItem><FormLabel>Graphics</FormLabel><FormControl><Input placeholder="NVIDIA GeForce GTX 1060 6GB or AMD Radeon RX 580 8GB" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="systemRequirements.storage" render={({ field }) => (
                            <FormItem className="md:col-span-2"><FormLabel>Storage</FormLabel><FormControl><Input placeholder="70 GB available space" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                </CardContent>
            </Card>

          </div>
          <div className="lg:col-span-1 space-y-8">
            <Card>
                 <CardHeader><CardTitle>Imagery</CardTitle></CardHeader>
                 <CardContent className="space-y-6">
                     <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Cover Image URL</FormLabel>
                            <FormControl>
                                <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormDescription>URL for the main game cover (portrait).</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bannerUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Banner Image URL</FormLabel>
                            <FormControl>
                                <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormDescription>URL for the wide banner image (landscape).</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? 'Saving...'
            : existingGame
            ? 'Save Changes'
            : 'Add Game'}
        </Button>
      </form>
    </Form>
  );
}
