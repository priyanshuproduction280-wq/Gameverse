'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Game } from '@/lib/types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GameRating } from './game-rating';
import { WithId } from '@/firebase';

type GameCardProps = {
  game: WithId<Game>;
  className?: string;
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function GameCard({ game, className }: GameCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { toast } = useToast();

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
     toast({
        title: isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist',
        description: `${game.title} has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
    })
  }

  return (
    <motion.div
      variants={cardVariants}
      layout
      className={cn('relative group', className)}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-primary rounded-lg blur-xl opacity-0 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      
      <Link href={`/games/${game.id}`} className="relative block h-full">
        <div className="relative h-full overflow-hidden rounded-lg bg-card border border-white/10 shadow-lg hover:shadow-primary/20 transition-shadow duration-300 ease-in-out flex flex-col">
            <motion.div
                className="relative h-[300px] w-full"
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <Image
                src={game.imageUrl}
                alt={game.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <Badge variant="secondary" className="absolute top-3 left-3">{game.platform}</Badge>
                <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-9 w-9 bg-black/30 backdrop-blur-sm hover:bg-black/50" onClick={handleWishlistClick}>
                    <Heart className={cn("h-5 w-5 text-white transition-all", isWishlisted && "fill-destructive text-destructive")} />
                </Button>
            </motion.div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-foreground truncate mb-1">
                    {game.title}
                </h3>
                {game.tags && game.tags.length > 0 && <p className="text-xs text-muted-foreground mb-2">{game.tags.join(', ')}</p>}
                
                <div className="mt-auto">
                    {game.rating && game.rating > 0 && (
                        <div className="my-3">
                             <GameRating rating={game.rating} />
                        </div>
                    )}
                   
                    <div className="flex justify-between items-center">
                        <p className="text-xl font-bold text-primary">
                            {game.price > 0 ? `₹${game.price.toFixed(2)}` : 'Free'}
                        </p>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="bg-primary/10 text-primary hover:bg-primary/20"
                            asChild
                        >
                           <span tabIndex={-1}>View</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      </Link>
    </motion.div>
  );
}
