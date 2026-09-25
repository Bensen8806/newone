'use client';

import JellyRadio from '@/components/ui/JellyRadio';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Calendar, Map as MapIcon, User, LogIn } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface NavbarJellyProps {
  user: any;
  dashboardLink: string;
  showMap: boolean;
}

export default function NavbarJelly({ user, dashboardLink, showMap }: NavbarJellyProps) {
  const router = useRouter();
  const pathname = usePathname();

  const items = [];
  
  items.push({
    value: '/',
    label: 'Home'
  });

  if (user) {
    items.push({
      value: '/events',
      label: 'Main Feed'
    });
    
    if (showMap) {
      items.push({
        value: '/map',
        label: 'Map'
      });
    }
    
    items.push({
      value: dashboardLink,
      label: 'Dashboard'
    });
  } else {
    items.push({
      value: '/login',
      label: 'Log in'
    });
  }

  // Determine active tab based on pathname
  let activeValue = '/';
  if (pathname?.startsWith('/events')) activeValue = '/events';
  else if (pathname?.startsWith('/map')) activeValue = '/map';
  else if (pathname?.startsWith('/login')) activeValue = '/login';
  else if (pathname !== '/') activeValue = dashboardLink;

  return (
    <>
      <div className="absolute top-6 left-8 z-50 pointer-events-auto flex items-center h-[44px]">
        <Link href="/">
          <Image src="/logo-new.png" alt="NSSCE Logo" width={110} height={28} className="object-contain drop-shadow-md hover:scale-105 transition-transform opacity-90 hover:opacity-100" priority />
        </Link>
      </div>

      <div className="fixed top-6 left-0 w-full z-50 flex justify-center pointer-events-none px-6">
        <div className="pointer-events-auto">
          <JellyRadio 
            items={items}
            value={activeValue}
            onChange={(val) => router.push(val)}
          />
        </div>
      </div>
    </>
  );
}
