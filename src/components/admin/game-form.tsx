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

const gameFormSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  slug: z.string().min(2, 'Slug must be at least 2 characters.'),
  platform: z.enum(['PC']),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  shortDescription: z.string().min(10, 'Short description is too short.').max(160, 'Short description is too long.'),
  description: z.string().min(20, 'Description is too short.'),
  imageUrl: z.string().url('Must be a valid URL.'),
  imageHint: z.string().optional(),
  bannerUrl: z.string().url('Must be a valid URL.'),
  bannerHint: z.string().optional(),
  tags: z.string().min(1, 'Please add at least one tag.').transform(val => val.split(',').map(tag => tag.trim())),
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
    ? { ...existingGame, tags: existingGame.tags.join(', ') }
    : { platform: 'PC', price: 0 };

  const form = useForm<GameFormValues>({
    resolver: zodResolver(gameFormSchema),
    defaultValues,
  });

  const onSubmit = (data: GameFormValues) => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Firestore not available' });
      return;
    }

    if (existingGame) {
      // Update existing game
      const gameDocRef = doc(firestore, 'games', existingGame.id);
      updateDocumentNonBlocking(gameDocRef, data);
      toast({
        title: 'Game Updated',
        description: `${data.title} has been successfully updated.`,
      });
      router.push('/admin/games');
    } else {
      // Add new game
      const gamesCollectionRef = collection(firestore, 'games');
      addDocumentNonBlocking(gamesCollectionRef, data);
      toast({
        title: 'Game Added',
        description: `${data.title} has been successfully added.`,
      });
      router.push('/admin/games');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                    <Input placeholder="cybernetic-horizons" {...field} />
                </FormControl>
                 <FormDescription>URL-friendly identifier.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                        <Input type="number" placeholder="59.99" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief, catchy summary of the game." {...field} />
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
                <Textarea rows={5} placeholder="The full, detailed description of the game." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                        <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormDescription>URL for the main game cover.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="imageHint"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Image Hint</FormLabel>
                    <FormControl>
                        <Input placeholder="futuristic city" {...field} />
                    </FormControl>
                     <FormDescription>Hint for AI image generation.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
                control={form.control}
                name="bannerUrl"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Banner Image URL</FormLabel>
                    <FormControl>
                        <Input placeholder="https://..." {...field} />
                    </FormControl>
                     <FormDescription>URL for the wide banner image.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="bannerHint"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Banner Hint</FormLabel>
                    <FormControl>
                        <Input placeholder="neon cityscape" {...field} />
                    </FormControl>
                     <FormDescription>Hint for AI image generation.</FormDescription>
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

        <Button type="submit" disabled={form.formState.isSubmitting}>
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
