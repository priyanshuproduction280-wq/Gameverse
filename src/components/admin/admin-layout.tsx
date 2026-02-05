'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { GamerVerseLogo } from '@/components/icons';
import { ADMIN_NAV_LINKS } from '@/lib/constants';
import { Home, Gamepad2, ShoppingCart, Settings } from 'lucide-react';
import { UserNav } from '@/components/auth/user-nav';

const ICONS: { [key: string]: React.ElementType } = {
  Dashboard: Home,
  Games: Gamepad2,
  Orders: ShoppingCart,
  Settings: Settings,
};

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
                    isActive={pathname.startsWith(link.href)}
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
        <header className="sticky top-0 z-40 flex h-14 items-center justify-end gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
          <SidebarTrigger className="sm:hidden" />
          <div className='flex-1'>
            <span className='font-semibold'>Admin Panel</span>
          </div>
          <UserNav />
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
