'use client';
import { GameForm } from '@/components/admin/game-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { Game } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { useParams, notFound } from 'next/navigation';

export default function EditGamePage() {
  const { id } = useParams();
  const firestore = useFirestore();
  const gameId = Array.isArray(id) ? id[0] : id;

  const gameRef = useMemoFirebase(() => {
    if (!firestore || !gameId) return null;
    return doc(firestore, 'games', gameId);
  }, [firestore, gameId]);

  const { data: game, isLoading } = useDoc<Game>(gameRef);

  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent className='space-y-4'>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-32" />
            </CardContent>
        </Card>
    );
  }

  if (!game) {
    return notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Game</CardTitle>
        <CardDescription>Update the details for &quot;{game.title}&quot; below.</CardDescription>
      </CardHeader>
      <CardContent>
        <GameForm existingGame={game} />
      </CardContent>
    </Card>
  );
}
