'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GameCard } from '@/components/game-card';
import { AnimatedText } from '@/components/animated-text';
import type { Game } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, limit, query } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function HomePageClient() {
  const firestore = useFirestore();

  const featuredGamesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'games'), limit(3));
  }, [firestore]);

  const { data: featuredGames, isLoading } = useCollection<Game>(featuredGamesQuery);

  const handleBrowseClick = () => {
    const featuredGamesSection = document.getElementById('featured-games');
    if (featuredGamesSection) {
      featuredGamesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-24 md:py-32 lg:py-48 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-grid-white/[0.05] [mask-image:linear-gradient(to_bottom,white_5%,transparent_80%)]"></div>
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,hsl(var(--accent)/0.15),transparent_60%)]"></div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background"></div>
        <div className="container z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center space-y-8"
          >
            <AnimatedText
              el="h1"
              text="Your Universe of Games"
              className="text-5xl font-headline font-extrabold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-br from-primary-foreground via-primary-foreground/80 to-accent"
            />

            <motion.p
              variants={itemVariants}
              className="max-w-[700px] text-muted-foreground md:text-xl"
            >
              Discover, buy, and play. The ultimate destination for digital games across all platforms. Instant delivery, unbeatable prices.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="font-bold" onClick={handleBrowseClick}>
                Browse Games
              </Button>
              <Button asChild size="lg" variant="secondary" className="font-bold">
                <Link href="/login">Login to Buy</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="featured-games" className="container py-16">
        <h2 className="text-4xl font-headline font-bold text-center mb-12">
          Featured Games
        </h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {isLoading && (
            <>
              <Skeleton className="h-[500px] w-full" />
              <Skeleton className="h-[500px] w-full" />
              <Skeleton className="h-[500px] w-full" />
            </>
          )}
          {featuredGames?.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </motion.div>
      </section>
    </div>
  );
}
