
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import { GamerVerseLogo } from '../icons';
import { Github, Twitter, Twitch, Instagram } from 'lucide-react';

const footerLinks = {
    'GamerVerse': [
        { name: 'All Games', href: '/games' },
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ],
    'Support': [
        { name: 'FAQ', href: '#faq' },
        { name: 'Help Center', href: '/help-center' },
        { name: 'Terms of Service', href: '/terms-of-service' },
    ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-12">
           <div className="lg:col-span-3 space-y-4">
                <GamerVerseLogo className="text-2xl"/>
                <p className="text-sm text-muted-foreground max-w-xs">
                    The ultimate destination for digital games. Instant delivery, unbeatable prices.
                </p>
           </div>
           <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
               {Object.entries(footerLinks).map(([title, links]) => (
                   <div key={title}>
                        <h4 className="font-semibold text-foreground mb-3">{title}</h4>
                        <ul className="space-y-2">
                           {links.map(link => (
                               <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        {link.name}
                                    </Link>
                               </li>
                           ))}
                        </ul>
                   </div>
               ))}
           </div>
            <div className="lg:col-span-2 space-y-4">
                <h4 className="font-semibold text-foreground">Follow Us</h4>
                <div className="flex items-center gap-4">
                    <Link href="https://www.instagram.com/steeam.mafia/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-foreground transition-colors"><Instagram /></Link>
                    <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-foreground transition-colors"><Twitter /></Link>
                    <Link href="#" aria-label="Twitch" className="text-muted-foreground hover:text-foreground transition-colors"><Twitch /></Link>
                    <Link href="#" aria-label="GitHub" className="text-muted-foreground hover:text-foreground transition-colors"><Github /></Link>
                </div>
           </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-sm text-muted-foreground">
             <p>© {new Date().getFullYear()} {APP_NAME}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
