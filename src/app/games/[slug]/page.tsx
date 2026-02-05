import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getGameBySlug, getGames } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Zap } from 'lucide-react';
import type { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = await getGameBySlug(params.slug);

  if (!game) {
    return {
      title: 'Game Not Found',
    };
  }

  return {
    title: game.title,
    description: game.shortDescription,
  };
}

export async function generateStaticParams() {
  const games = await getGames();
  return games.map((game) => ({
    slug: game.slug,
  }));
}

export default async function GameDetailPage({ params }: Props) {
  const game = await getGameBySlug(params.slug);

  if (!game) {
    notFound();
  }

  return (
    <article>
      <header className="relative h-[40vh] md:h-[60vh] w-full">
        <Image
          src={game.bannerUrl}
          alt={`${game.title} banner`}
          fill
          data-ai-hint={game.bannerHint}
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 flex items-end container">
          <div className="w-full pb-12 animate-fade-in-up">
            <Badge variant="secondary" className="mb-2">{game.platform}</Badge>
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-white drop-shadow-lg">
              {game.title}
            </h1>
          </div>
        </div>
      </header>

      <div className="container py-12">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-headline font-semibold mb-4">Description</h2>
            <div className="prose prose-invert max-w-none text-muted-foreground">
              <p>{game.description}</p>
            </div>
            <Separator className="my-8" />
            <div className="space-x-2">
              {game.tags.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
          
          <aside className="md:col-span-1">
            <div className="sticky top-24 p-6 rounded-lg glassmorphism">
              <p className="text-4xl font-bold font-headline text-accent mb-4">
                {game.price > 0 ? `₹${game.price.toFixed(2)}` : 'Free'}
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li className="flex items-center"><strong className="w-28 font-medium text-foreground">Platform:</strong> {game.platform}</li>
                <li className="flex items-center"><strong className="w-28 font-medium text-foreground">Edition:</strong> Standard</li>
                <li className="flex items-center"><strong className="w-28 font-medium text-foreground">Delivery:</strong> Instant Digital</li>
              </ul>
              <div className="flex flex-col gap-3">
                <Button size="lg" className="w-full font-bold">
                  <ShoppingCart className="mr-2" /> Add to Cart
                </Button>
                <Button size="lg" variant="secondary" className="w-full font-bold">
                  <Zap className="mr-2" /> Buy Now
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
