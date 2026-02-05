'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Game } from '@/lib/types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

type GameCardProps = {
  game: Game;
  className?: string;
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function GameCard({ game, className }: GameCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      className={cn('relative group', className)}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-primary rounded-lg blur-lg opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      <Link href={`/games/${game.slug}`} className="relative block h-full">
        <div className="relative h-full overflow-hidden rounded-lg glassmorphism shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
          <motion.div
            className="relative h-[400px] w-full"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={game.imageUrl}
              alt={game.title}
              fill
              data-ai-hint={game.imageHint}
              className="object-cover transition-transform duration-300 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </motion.div>
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-headline font-bold text-foreground truncate">
                {game.title}
              </h3>
              <Badge variant="secondary">{game.platform}</Badge>
            </div>
            <p className="mt-2 text-muted-foreground text-sm line-clamp-2">
              {game.shortDescription}
            </p>
            <div className="mt-6 flex justify-between items-center">
              <p className="text-2xl font-bold font-headline text-accent">
                {game.price > 0 ? `₹${game.price.toFixed(2)}` : 'Free'}
              </p>
              <Button
                variant="outline"
                className="bg-transparent border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
