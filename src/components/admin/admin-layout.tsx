'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { GamerVerseLogo } from '@/components/icons';
import { ADMIN_NAV_LINKS } from '@/lib/constants';
import { Home, Gamepad2, ShoppingCart, Settings, ArrowLeft } from 'lucide-react';
import { UserNav } from '@/components/auth/user-nav';
import { Button } from '../ui/button';

const ICONS: { [key: string]: React.ElementType } = {
  Dashboard: Home,
  Games: Gamepad2,
  Orders: ShoppingCart,
  Settings: Settings,
};

function AdminBreadcrumbs() {
  const pathname = usePathname();
  const pathParts = pathname.split('/').filter(part => part);

  // Don't show breadcrumbs on the main admin dashboard
  if (pathParts.length <= 1) {
    return (
        <h1 className="text-xl font-semibold">Dashboard</h1>
    );
  }

  const breadcrumbs = pathParts.slice(1).map((part, index) => {
    const href = '/admin/' + pathParts.slice(1, index + 2).join('/');
    // Capitalize and decode URI component for display
    const text = decodeURIComponent(part).split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const isLast = index === pathParts.length - 2;

    return { href, text, isLast };
  });

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/admin">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.text}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.text}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <GamerVerseLogo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {ADMIN_NAV_LINKS.map((link) => {
              const Icon = ICONS[link.name];
              return (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    isActive={
                      pathname === link.href ||
                      (link.href !== '/admin' && pathname.startsWith(link.href))
                    }
                    asChild
                  >
                    <Link href={link.href}>
                      {Icon && <Icon />}
                      <span>{link.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6">
          <SidebarTrigger className="sm:hidden" />
          <AdminBreadcrumbs />
          <div className="ml-auto flex items-center gap-2">
             <Button variant="outline" size="sm" asChild>
              <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Store</Link>
            </Button>
            <UserNav />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
