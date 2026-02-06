'use client';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, CheckCircle, Info, ShoppingCart, Star, Zap } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import type { Game } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { GameRating } from '@/components/game-rating';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

function GameDetailSkeleton() {
    return (
        <div className="container py-12">
            <div className="h-10 w-3/4 md:w-1/2 mb-8"><Skeleton className="h-full w-full" /></div>
            <div className="grid lg:grid-cols-10 gap-8 lg:gap-12">
                <div className="lg:col-span-7">
                    <Skeleton className="aspect-video w-full rounded-xl" />
                    <div className="mt-8 space-y-6">
                        <Skeleton className="h-8 w-1/4" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                </div>
                <div className="lg:col-span-3">
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        </div>
    )
}

export default function GameDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isWishlisted, setIsWishlisted] = useState(false);

  const gameQuery = useMemoFirebase(() => {
    if (!firestore || !slug) return null;
    return query(collection(firestore, 'games'), where('slug', '==', slug), limit(1));
  }, [firestore, slug]);

  const { data: games, isLoading } = useCollection<Game>(gameQuery);
  const game = games?.[0];

  useEffect(() => {
    if (game?.title) {
      document.title = `${game.title} | GamerVerse`;
    }
  }, [game]);

  if (isLoading) {
    return <GameDetailSkeleton />;
  }

  if (!game) {
    notFound();
  }

  const handleWishlistClick = () => {
    setIsWishlisted(!isWishlisted);
    toast({
        title: isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist',
        description: `${game.title} has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
    })
  }

  return (
    <article className="container py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
            <div>
                 <div className="flex items-center gap-4 mb-2">
                    <Badge variant="secondary">{game.platform}</Badge>
                    {game.rating && game.rating > 0 && <GameRating rating={game.rating} />}
                 </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                {game.title}
                </h1>
            </div>
            <div className="flex-shrink-0 mt-4 md:mt-0">
                <p className="text-4xl font-bold text-primary">
                    {game.price > 0 ? `₹${game.price.toFixed(2)}` : 'Free to Play'}
                </p>
            </div>
        </div>
      
      <div className="grid lg:grid-cols-10 gap-8 lg:gap-12">
        <div className="lg:col-span-7">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-8 shadow-2xl shadow-primary/10">
                 <Image
                    src={game.bannerUrl}
                    alt={`${game.title} banner`}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 1000px"
                />
            </div>
          
          <div className="space-y-10">
            <Card>
                <CardHeader><CardTitle>Description</CardTitle></CardHeader>
                <CardContent>
                    <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
                        <p>{game.description}</p>
                    </div>
                </CardContent>
            </Card>

            {game.systemRequirements && (
                <Card>
                    <CardHeader><CardTitle>System Requirements</CardTitle></CardHeader>
                    <CardContent>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                            <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground">OS</span>
                                <span className="font-medium">{game.systemRequirements.os || 'N/A'}</span>
                            </div>
                             <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground">Processor</span>
                                <span className="font-medium">{game.systemRequirements.processor || 'N/A'}</span>
                            </div>
                             <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground">Memory</span>
                                <span className="font-medium">{game.systemRequirements.memory || 'N/A'}</span>
                            </div>
                             <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground">Graphics</span>
                                <span className="font-medium">{game.systemRequirements.graphics || 'N/A'}</span>
                            </div>
                             <div className="flex flex-col gap-1 md:col-span-2">
                                <span className="text-muted-foreground">Storage</span>
                                <span className="font-medium">{game.systemRequirements.storage || 'N/A'}</span>
                            </div>
                         </div>
                    </CardContent>
                </Card>
            )}

             <Card>
                <CardHeader><CardTitle>Reviews</CardTitle></CardHeader>
                <CardContent className="text-center text-muted-foreground space-y-4">
                    <Info className="mx-auto h-8 w-8" />
                    <p>User reviews are not yet available for this game.</p>
                    <p className="text-xs">This feature is coming soon!</p>
                </CardContent>
            </Card>

          </div>
        </div>
        
        <aside className="lg:col-span-3">
          <div className="sticky top-24 space-y-6">
             <Card className="overflow-hidden">
                <div className="relative h-64 w-full">
                    <Image src={game.imageUrl} alt={game.title} fill className="object-cover" />
                </div>
                 <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">{game.description}</p>
                 </CardContent>
             </Card>

            <div className="space-y-3">
                <Button size="lg" className="w-full font-bold text-lg">
                    <Zap className="mr-2" /> Buy Now
                </Button>
                <div className="flex gap-3">
                     <Button size="lg" variant="secondary" className="w-full">
                        <ShoppingCart className="mr-2" /> Add to Cart
                    </Button>
                    <Button size="icon" variant={isWishlisted ? "secondary" : "outline"} onClick={handleWishlistClick} aria-label="Add to wishlist" className="w-11 h-11 flex-shrink-0">
                        <Heart className={cn("transition-all", isWishlisted && "fill-destructive text-destructive")} />
                    </Button>
                </div>
            </div>
            
            <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent" /> <span>Instant Digital Delivery</span></li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent" /> <span>Official Publisher Key</span></li>
            </ul>

             <div className="flex flex-wrap gap-2">
              {game.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>

          </div>
        </aside>
      </div>
    </article>
  );
}
