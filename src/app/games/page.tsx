import { GamesPageClient } from '@/components/games-page-client';

export const metadata = {
  title: 'All Games',
  description: 'Browse our full collection of games.',
};

export default function GamesPage() {
  return <GamesPageClient />;
}
