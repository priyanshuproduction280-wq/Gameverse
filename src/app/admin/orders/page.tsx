import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">Review all customer orders.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            This feature is currently under construction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Why isn&apos;t this feature available yet?</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                This feature isn&apos;t implemented yet because it requires a different approach than the rest of the app. Here&apos;s a brief explanation:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>
                  <strong>Security First:</strong> Your app&apos;s security rules are designed to protect user privacy. They prevent any single user—even an admin—from downloading all orders for all users at once directly on the website. This is a critical security measure.
                </li>
                <li>
                  <strong>Client vs. Server:</strong> To build this feature securely, the app would need a trusted backend process (like a Cloud Function) that runs with special admin permissions to gather the orders. The current app is built to run entirely on the user&apos;s device (the client), so it doesn&apos;t have this backend component yet.
                </li>
              </ul>
               <p className="mt-3">
                Building this out is a more advanced step that involves server-side code.
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
