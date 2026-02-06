'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GameCard } from '@/components/game-card';
import { AnimatedText } from '@/components/animated-text';
import type { Game } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, limit, query, where, orderBy } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';
import { ArrowRight, Flame, Gamepad2, Instagram } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function GameCardSkeleton() {
    return <Skeleton className="h-[430px] w-full" />
}

export function HomePageClient() {
  const firestore = useFirestore();

  const featuredGamesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'games'), where("rating", ">=", 4.5), limit(3));
  }, [firestore]);

  const { data: featuredGames, isLoading: isLoadingFeatured } = useCollection<Game>(featuredGamesQuery);

  const handleBrowseClick = () => {
    document.getElementById('featured-games')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col">
      <section className="w-full min-h-[80vh] md:min-h-svh flex items-center text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-grid-white/[0.03] [mask-image:linear-gradient(to_bottom,white_5%,transparent_80%)]"></div>
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background"></div>
        
        <div className="container z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center space-y-6"
          >
            <AnimatedText
              el="h1"
              text="Your Universe of Games Awaits"
              className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-br from-primary-foreground to-muted-foreground"
            />

            <motion.p
              variants={itemVariants}
              className="max-w-[700px] text-muted-foreground md:text-xl"
            >
             Instantly access and play the best games. Unbeatable prices, instant delivery, and a universe of fun at your fingertips.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="font-bold text-lg" onClick={handleBrowseClick}>
                <Gamepad2 className="mr-2" /> Start Exploring
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="https://www.instagram.com/steeam.mafia/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="mr-2" /> Follow on Instagram
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="space-y-24 py-24 bg-background">
        <section id="featured-games" className="container">
          <div className="flex items-center gap-4 mb-8">
            <Flame className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Top Rated
            </h2>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {isLoadingFeatured && (
              <>
                <GameCardSkeleton />
                <GameCardSkeleton />
                <GameCardSkeleton />
              </>
            )}
            {featuredGames?.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </motion.div>
        </section>

        <section className="container text-center">
            <h2 className="text-3xl font-bold mb-4">And So Much More...</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Our library is constantly growing. Dive in and find your next favorite game.</p>
            <Button asChild size="lg" className="font-bold text-lg">
                <Link href="/games">See All Games <ArrowRight className="ml-2" /></Link>
            </Button>
        </section>

      </div>
    </div>
  );
}
