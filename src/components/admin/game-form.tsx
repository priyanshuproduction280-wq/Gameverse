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
import { useFirestore, addDocumentNonBlocking, updateDocumentNonBlocking, WithId } from '@/firebase';
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
import Image from 'next/image';
import { OS_OPTIONS, PROCESSOR_OPTIONS, MEMORY_OPTIONS, GRAPHICS_OPTIONS, STORAGE_OPTIONS } from '@/lib/system-requirements';
import { useEffect } from 'react';

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
  slug: z.string().min(3, 'Slug must be at least 3 characters.').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be a valid URL slug.'),
  platform: z.enum(['PC']),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  description: z.string().min(10, 'Description is too short.'),
  imageUrl: z.string().min(1, 'A cover image is required.'),
  bannerUrl: z.string().min(1, 'A banner image is required.'),
  tags: z.string().min(1, 'Please add at least one tag.'),
  rating: z.coerce.number().min(0).max(5).optional(),
  systemRequirements: z.object({
    os: z.enum(OS_OPTIONS),
    processor: z.enum(PROCESSOR_OPTIONS),
    memory: z.enum(MEMORY_OPTIONS),
    graphics: z.enum(GRAPHICS_OPTIONS),
    storage: z.enum(STORAGE_OPTIONS),
  }),
});

type GameFormValues = z.infer<typeof gameFormSchema>;

type GameFormProps = {
  existingGame?: WithId<Game>;
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
        systemRequirements: existingGame.systemRequirements || {
          os: OS_OPTIONS[0],
          processor: PROCESSOR_OPTIONS[0],
          memory: MEMORY_OPTIONS[0],
          graphics: GRAPHICS_OPTIONS[0],
          storage: STORAGE_OPTIONS[0],
        },
      }
    : {
        title: '',
        slug: '',
        platform: 'PC',
        price: 0,
        rating: 0,
        tags: '',
        imageUrl: '',
        bannerUrl: '',
        description: '',
        systemRequirements: {
          os: OS_OPTIONS[0],
          processor: PROCESSOR_OPTIONS[0],
          memory: MEMORY_OPTIONS[0],
          graphics: GRAPHICS_OPTIONS[0],
          storage: STORAGE_OPTIONS[0],
        },
      };

  const form = useForm<GameFormValues>({
    resolver: zodResolver(gameFormSchema),
    defaultValues,
  });
  
  const title = form.watch('title');
  const isCreating = !existingGame;

  useEffect(() => {
      if (isCreating) {
          form.setValue('slug', slugify(title), { shouldValidate: true });
      }
  }, [title, form, isCreating]);

  const onSubmit = (data: GameFormValues) => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Firestore not available' });
      return;
    }

    const tagsArray = data.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    const gameData = { ...data, tags: tagsArray };

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
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="cybernetic-horizons" {...field} />
                          </FormControl>
                          <FormDescription>
                            A unique, URL-friendly identifier for the game.
                          </FormDescription>
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
                <CardHeader><CardTitle>Description</CardTitle></CardHeader>
                <CardContent>
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
                            <FormItem>
                                <FormLabel>Operating System</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select an OS" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {OS_OPTIONS.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="systemRequirements.processor" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Processor</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a Processor" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {PROCESSOR_OPTIONS.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="systemRequirements.memory" render={({ field }) => (
                           <FormItem>
                                <FormLabel>Memory</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Memory" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {MEMORY_OPTIONS.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="systemRequirements.graphics" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Graphics</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Graphics" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {GRAPHICS_OPTIONS.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={form.control} name="systemRequirements.storage" render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Storage</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Storage" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {STORAGE_OPTIONS.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
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
                            <FormLabel>Cover Image</FormLabel>
                            <FormControl>
                                <div>
                                    {form.getValues('imageUrl') && (
                                        <div className="relative w-full h-48 mb-2 rounded-md overflow-hidden border">
                                            <Image src={form.getValues('imageUrl')} alt="Cover image preview" layout="fill" objectFit="contain" />
                                        </div>
                                    )}
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
                                </div>
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
                            <FormLabel>Banner Image</FormLabel>
                             <FormControl>
                                <div>
                                    {form.getValues('bannerUrl') && (
                                        <div className="relative w-full aspect-video mb-2 rounded-md overflow-hidden border">
                                            <Image src={form.getValues('bannerUrl')} alt="Banner image preview" layout="fill" objectFit="contain" />
                                        </div>
                                    )}
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
                                </div>
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
