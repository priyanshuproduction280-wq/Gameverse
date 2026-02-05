import { GameForm } from '@/components/admin/game-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewGamePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Game</CardTitle>
        <CardDescription>Fill out the form below to add a new game to your store.</CardDescription>
      </CardHeader>
      <CardContent>
        <GameForm />
      </CardContent>
    </Card>
  );
}
