'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GamerVerseLogo } from '@/components/icons';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { UserNav } from '../auth/user-nav';

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled ? 'border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60' : 'bg-transparent'
    )}>
      <div className="container flex h-20 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <GamerVerseLogo />
        </Link>
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-2 rounded-md transition-colors hover:text-foreground',
                pathname === link.href ? 'text-foreground bg-secondary' : 'text-muted-foreground'
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
            </Button>
          <UserNav />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden animate-in fade-in-20 slide-in-from-top-4 bg-background border-t">
          <div className="container py-4">
            <nav className="grid gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-lg font-medium transition-colors hover:text-foreground',
                    pathname === link.href ? 'text-foreground' : 'text-muted-foreground'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
                <div className='pt-4 border-t'>
                    <Button variant="ghost" className="w-full justify-start text-lg">
                        <ShoppingCart className="mr-2 h-5 w-5" /> Cart
                    </Button>
                </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
