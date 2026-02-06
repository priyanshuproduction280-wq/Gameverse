
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="container py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
          <CardDescription>Please read our terms and conditions carefully.</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground space-y-4 py-16">
          <FileText className="mx-auto h-12 w-12" />
          <h2 className="text-2xl font-semibold">Content Coming Soon</h2>
          <p>This page is currently under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
