import { getFeaturedGames } from '@/lib/data';
import { HomePageClient } from '@/components/home-page-client';

export default async function Home() {
  const featuredGames = await getFeaturedGames(3);

  return <HomePageClient featuredGames={featuredGames} />;
}
