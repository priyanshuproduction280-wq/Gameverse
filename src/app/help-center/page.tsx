
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LifeBuoy } from "lucide-react";

export default function HelpCenterPage() {
  return (
    <div className="container py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Help Center</CardTitle>
          <CardDescription>Find answers to your questions.</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground space-y-4 py-16">
          <LifeBuoy className="mx-auto h-12 w-12" />
          <h2 className="text-2xl font-semibold">Content Coming Soon</h2>
          <p>This page is currently under construction. Please check our FAQ section for immediate help.</p>
        </CardContent>
      </Card>
    </div>
  );
}
