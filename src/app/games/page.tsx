import { getGames } from '@/lib/data';
import { GameCard } from '@/components/game-card';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const metadata = {
  title: 'All Games',
  description: 'Browse our full collection of games.',
};

export default async function GamesPage() {
  const allGames = await getGames();

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
        {allGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </motion.div>
    </div>
  );
}
