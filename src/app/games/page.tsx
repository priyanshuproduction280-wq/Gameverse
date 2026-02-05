import { getGames } from '@/lib/data';
import { GamesPageClient } from '@/components/games-page-client';

export const metadata = {
  title: 'All Games',
  description: 'Browse our full collection of games.',
};

export default async function GamesPage() {
  const allGames = await getGames();

  return <GamesPageClient allGames={allGames} />;
}
