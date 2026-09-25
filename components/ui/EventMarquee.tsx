import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface EventMarqueeProps {
  events: any[];
}

export default function EventMarquee({ events }: EventMarqueeProps) {
  if (!events || events.length === 0) return null;

  // We need enough items to ensure it seamlessly loops and spans the whole screen width
  const items = events.slice(0, 10);
  
  // Create an array with multiple copies of the items to ensure it fills wide screens
  // and translates exactly 50% for a seamless loop
  const marqueeItems = [...items, ...items, ...items, ...items, ...items, ...items, ...items, ...items, ...items, ...items];

  return (
    <div className="w-full overflow-hidden bg-black/40 border-y border-white/5 py-4 flex relative z-20 backdrop-blur-md">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {marqueeItems.map((event, index) => {
          const image = event.event_posts?.[0]?.poster_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop';
          const link = event.event_posts?.[0]?.registration_url || '#';
          
          return (
            <Link 
              key={`${event.id}-${index}`}
              href={link}
              target="_blank"
              className="flex-shrink-0 flex items-center gap-4 px-10 group transition-all"
            >
              <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                <Image 
                  src={image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                  {event.title}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                  {new Date(event.start_time).toLocaleDateString('en-GB')} • {event.venues?.name || 'TBA'}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
