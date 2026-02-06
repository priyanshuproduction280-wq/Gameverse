'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CreditCard, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useToast } from '@/hooks/use-toast';

export function UserNav() {
  const auth = useAuth();
  const { userProfile, isLoading } = useUserProfile();
  const { toast } = useToast();


  const signOut = () => {
    auth.signOut();
    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out.',
    });
  };

  if (isLoading) {
    // You can render a skeleton or a loading spinner here
    return <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />;
  }

  if (!userProfile) {
    return (
      <Button asChild>
        <Link href="/login">Login</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={userProfile.photoURL ?? ''} alt={userProfile.displayName ?? 'User'} />
            <AvatarFallback>
              {userProfile.displayName?.charAt(0).toUpperCase() ?? userProfile.email?.charAt(0).toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userProfile.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{userProfile.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/profile">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/orders">
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>My Orders</span>
            </DropdownMenuItem>
          </Link>
          {userProfile.isAdmin && (
            <Link href="/admin">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Admin Panel</span>
              </DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
