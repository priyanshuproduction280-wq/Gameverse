'use client';
import Link from 'next/link';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useCollection, useFirestore, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc, query } from 'firebase/firestore';
import type { Game } from '@/lib/types';
import { Badge } from '../ui/badge';
import { Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function GamesTable() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const gamesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'games'));
  }, [firestore]);

  const { data: games, isLoading } = useCollection<Game>(gamesQuery);

  const handleDelete = (gameId: string) => {
    if (!firestore) {
        toast({
            variant: 'destructive',
            title: 'Error deleting game',
            description: 'Firestore is not available.',
        });
        return;
    }
    const gameDocRef = doc(firestore, 'games', gameId);
    deleteDocumentNonBlocking(gameDocRef);
    toast({
        title: 'Game deleted',
        description: 'The game has been successfully deleted.',
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Games</CardTitle>
            <CardDescription>Manage the games in your store.</CardDescription>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/games/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Game
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
      <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">
              Image
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead className="hidden md:table-cell">Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-16 w-16 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          {games?.map((game) => (
            <TableRow key={game.id}>
              <TableCell className="hidden sm:table-cell">
                <Image
                  alt={game.title}
                  className="aspect-square rounded-md object-cover"
                  height="64"
                  src={game.imageUrl}
                  width="64"
                />
              </TableCell>
              <TableCell className="font-medium">{game.title}</TableCell>
              <TableCell>
                <Badge variant="outline">{game.platform}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {game.price > 0 ? `₹${game.price.toFixed(2)}` : 'Free'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/admin/games/${game.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the game &quot;{game.title}&quot;.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(game.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
      {games && games.length === 0 && !isLoading && (
        <div className="text-center p-8 text-muted-foreground">
          No games found. Get started by adding a new game.
        </div>
      )}
      </CardContent>
    </Card>
  );
}
