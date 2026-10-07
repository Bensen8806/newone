'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface NavbarJellyProps {
  user: any;
  dashboardLink: string;
  showMap: boolean;
  clubLogo?: string | null;
}

export default function NavbarJelly({ user, dashboardLink, showMap, clubLogo }: NavbarJellyProps) {
  const pathname = usePathname();

  const items = [];
  items.push({ value: '/', label: 'Home' });

  if (user) {
    items.push({ value: '/events', label: 'Feed' });
    if (showMap) {
      items.push({ value: '/map', label: 'Map' });
    }
    items.push({ value: '/all-clubs', label: 'Clubs' });
    items.push({ value: dashboardLink, label: 'Dashboard' });
  }

  // Determine active tab based on pathname
  let activeValue = '/';
  if (pathname?.startsWith('/events')) activeValue = '/events';
  else if (pathname?.startsWith('/map')) activeValue = '/map';
  else if (pathname?.startsWith('/all-clubs')) activeValue = '/all-clubs';
  else if (pathname?.startsWith('/login')) activeValue = '/login';
  else if (pathname !== '/') activeValue = dashboardLink;

  return (
    <header className="fixed top-0 left-0 w-full z-50 h-16 flex items-center border-b border-white/5 bg-[#000000CC] backdrop-blur-md px-6">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto relative">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <Image src="/logo-new.png" alt="NSSCE Logo" width={110} height={28} className="object-contain brightness-0 invert" priority />
          {clubLogo && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={clubLogo} alt="Club Logo" className="w-6 h-6 rounded-md object-cover border border-white/10" />
          )}
        </Link>

        {/* Centered Navigation Options */}
        <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 p-1.5 px-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-lg">
          {items.map((item) => {
            const isActive = activeValue === item.value;
            return (
              <Link
                key={item.value}
                href={item.value}
                className={cn(
                  "px-5 py-2 text-xs font-medium rounded-full transition-all duration-200",
                  isActive 
                    ? "bg-white text-black shadow-sm" 
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Navigation fallback (just a simple row if md: is hidden) - for simplicity here, we'll keep it visible but uncentered on small screens, or we can just let it stack/scroll */}
        <nav className="md:hidden flex items-center gap-2 overflow-x-auto no-scrollbar ml-4 pr-4">
          {items.map((item) => {
            const isActive = activeValue === item.value;
            return (
              <Link
                key={item.value}
                href={item.value}
                className={cn(
                  "px-4 py-1.5 text-[11px] font-medium rounded-full transition-all duration-200 whitespace-nowrap",
                  isActive 
                    ? "bg-white text-black shadow-sm" 
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="flex items-center gap-3 shrink-0">
          {!user && (
            <Link 
              href="/login" 
              className="px-4 py-2 text-xs font-medium text-white bg-white/10 hover:bg-white/20 rounded-md transition-colors border border-white/5"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
