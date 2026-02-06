
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Contact Us</CardTitle>
          <CardDescription>Get in touch with the GamerVerse team.</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground space-y-4 py-16">
          <Mail className="mx-auto h-12 w-12" />
          <h2 className="text-2xl font-semibold">Content Coming Soon</h2>
          <p>This page is currently under construction. For support, please refer to our FAQ.</p>
        </CardContent>
      </Card>
    </div>
  );
}
