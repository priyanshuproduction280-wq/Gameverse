import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome back! Here&apos;s a quick overview of your store.
      </p>
      <AdminDashboardClient />
    </div>
  );
}
