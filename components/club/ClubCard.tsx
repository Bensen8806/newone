"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import BorderGlow from '@/components/ui/BorderGlow'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Calendar, User, Users, BookOpen } from 'lucide-react'

// Adjust type based on your actual fetch query
/* eslint-disable @typescript-eslint/no-explicit-any */
type ClubCardProps = {
  club: any
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default function ClubCard({ club }: ClubCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const glassCard = "bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/20 dark:hover:bg-white/5 flex flex-col h-full cursor-pointer w-full text-left"

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="h-full">
          <BorderGlow className={glassCard} backgroundColor="transparent" glowColor="40 100 70">
            <div className="flex-grow space-y-4">
              <div className="flex items-center gap-4">
                {club.logo_url ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/20">
                    <Image
                      src={club.logo_url}
                      alt={`${club.name} logo`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-inner">
                    {club.name ? club.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold line-clamp-2">{club.name || 'Unnamed Club'}</h2>
                  {club.type && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-500/30 whitespace-nowrap mt-2">
                      {club.type}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </BorderGlow>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-4xl bg-zinc-950 text-foreground border-zinc-800 p-8">
        <DialogHeader className="mb-2">
          <div className="flex items-center gap-6 mb-4">
            {club.logo_url ? (
              <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-zinc-700 shadow-lg">
                <Image
                  src={club.logo_url}
                  alt={`${club.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold flex-shrink-0 shadow-inner">
                {club.name ? club.name.charAt(0).toUpperCase() : 'C'}
              </div>
            )}
            <div className="space-y-2">
              <DialogTitle className="text-3xl font-bold">{club.name}</DialogTitle>
              {club.type && (
                <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {club.type}
                </span>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-4 mt-2">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b border-zinc-800 pb-3">Club Details</h3>
            
            <div className="space-y-5 text-base">
              {club.department?.name && (
                <div className="flex items-start gap-4">
                  <BookOpen className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-sm font-medium">Department</span>
                    <span className="font-medium mt-1">{club.department.name}</span>
                  </div>
                </div>
              )}
              
              {club.head_user && (
                <div className="flex items-start gap-4">
                  <User className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-sm font-medium">Club Head</span>
                    <span className="font-medium mt-1">{club.head_user.name || 'Not specified'}</span>
                    <a href={`mailto:${club.head_user.email}`} className="text-indigo-400 hover:underline text-sm mt-0.5">
                      {club.head_user.email}
                    </a>
                  </div>
                </div>
              )}

              {club.faculty_advisor && (
                <div className="flex items-start gap-4">
                  <Users className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-sm font-medium">Faculty Advisor</span>
                    <span className="font-medium mt-1">{club.faculty_advisor.name || 'Not specified'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b border-zinc-800 pb-3">Organized Events</h3>
            
            <ScrollArea className="h-72 pr-4">
              {!club.events || club.events.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 py-10">
                  <p className="italic">No events organized yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {club.events.map((event: any) => (
                    <div key={event.id} className="p-4 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/80 transition-colors border border-zinc-800 space-y-2">
                      <h4 className="font-semibold text-base">{event.title}</h4>
                      <div className="flex items-center justify-between text-sm text-zinc-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event.start_time).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 border border-zinc-700">
                          {event.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
