import { GamesPageClient } from '@/components/games-page-client';
import { Suspense } from 'react';

export const metadata = {
  title: 'All Games',
  description: 'Browse our full collection of games.',
};

export default function GamesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GamesPageClient />
    </Suspense>
  );
}
