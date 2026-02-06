'use client';

import { motion } from 'framer-motion';
import { GameCard } from '@/components/game-card';
import type { Game } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';
import { useMemo, useState } from 'react';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Button } from './ui/button';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

function GameCardSkeleton() {
    return <Skeleton className="h-[430px] w-full" />
}

export function GamesPageClient() {
  const firestore = useFirestore();
  
  const allGamesQuery = useMemoFirebase(() => {
    if(!firestore) return null;
    return query(collection(firestore, 'games'));
  }, [firestore]);

  const { data: allGames, isLoading } = useCollection<Game>(allGamesQuery);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [priceRange, setPriceRange] = useState([5000]);

  const genres = useMemo(() => {
    if (!allGames) return [];
    const allTags = allGames.flatMap(game => game.tags || []);
    return ['all', ...Array.from(new Set(allTags))];
  }, [allGames]);

  const filteredGames = useMemo(() => {
    if (!allGames) return [];

    return allGames.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenre === 'all' || (game.tags && game.tags.includes(selectedGenre));
      const matchesPrice = game.price <= priceRange[0];
      
      return matchesSearch && matchesGenre && matchesPrice;
    });
  }, [allGames, searchTerm, selectedGenre, priceRange]);
  
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGenre('all');
    setPriceRange([5000]);
  }

  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-center mb-4">
            All Games
        </h1>
        <p className="text-lg text-muted-foreground text-center">
            Explore our entire library of digital games.
        </p>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 p-4 rounded-lg border bg-card/50">
            <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search for a game..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
             <div>
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Genre" />
                    </SelectTrigger>
                    <SelectContent>
                        {genres.map(genre => (
                            <SelectItem key={genre} value={genre} className="capitalize">{genre === 'all' ? 'All Genres' : genre}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                 <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Price Range</span>
                    <span>Up to ₹{priceRange[0]}</span>
                 </div>
                 <Slider 
                    min={0}
                    max={5000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                 />
            </div>
            <div className="md:col-span-4 text-center">
                <Button variant="ghost" onClick={resetFilters}>Reset Filters</Button>
            </div>
       </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
                <GameCardSkeleton key={i} />
            ))}
        </div>
      )}

      {!isLoading && filteredGames.length > 0 && (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
            {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
            ))}
        </motion.div>
      )}

      {!isLoading && filteredGames.length === 0 && (
        <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-2">No Games Found</h2>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
