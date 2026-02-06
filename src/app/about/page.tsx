
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">About Us</CardTitle>
          <CardDescription>Learn more about GamerVerse.</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground space-y-4 py-16">
          <Info className="mx-auto h-12 w-12" />
          <h2 className="text-2xl font-semibold">Content Coming Soon</h2>
          <p>This page is currently under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
