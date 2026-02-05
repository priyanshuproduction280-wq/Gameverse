'use client';

import { motion } from 'framer-motion';
import { GameCard } from '@/components/game-card';
import type { Game } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function GamesPageClient() {
  const firestore = useFirestore();
  
  const allGamesQuery = useMemoFirebase(() => {
    if(!firestore) return null;
    return query(collection(firestore, 'games'));
  }, [firestore]);

  const { data: allGames, isLoading } = useCollection<Game>(allGamesQuery);

  return (
    <div className="container py-16">
      <h1 className="text-5xl font-headline font-bold text-center mb-4">
        All Games
      </h1>
      <p className="text-lg text-muted-foreground text-center mb-12">
        Explore our entire library of digital games.
      </p>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        {isLoading && Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[500px] w-full" />
        ))}
        {allGames?.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </motion.div>
    </div>
  );
}
