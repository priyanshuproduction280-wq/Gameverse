'use client';

import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import type { Game } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Gamepad2, ShoppingCart, Users } from "lucide-react";
import { collection, query } from "firebase/firestore";

export function AdminDashboardClient() {
  const firestore = useFirestore();

  const gamesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'games'));
  }, [firestore]);
  
  // Note: We cannot query all users or all orders from the client-side
  // due to security rules that prevent listing all documents in the 'users' collection.
  // This is a security best practice to prevent user enumeration.
  // The counts for users and orders are therefore placeholders.
  // A production implementation would use a server-side function (e.g., Cloud Function)
  // to maintain aggregate counts in a separate, readable document.

  const { data: games, isLoading: isLoadingGames } = useCollection<Game>(gamesQuery);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Games
            </CardTitle>
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingGames ? (
                <Skeleton className="h-8 w-16" />
            ) : (
                <div className="text-2xl font-bold">{games?.length ?? 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              managed in your store
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">
              Requires server-side aggregation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">
              Requires server-side aggregation
            </p>
          </CardContent>
        </Card>
      </div>
  );
}
