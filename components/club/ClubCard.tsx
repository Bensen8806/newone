"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

/* eslint-disable @typescript-eslint/no-explicit-any */
type ClubCardProps = {
  club: any
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default function ClubCard({ club }: ClubCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="group relative border border-white/10 bg-[#0A0A0A] rounded-xl p-5 transition-all duration-300 hover:border-white/20 hover:bg-[#111] cursor-pointer text-left h-full flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            {club.logo_url ? (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 bg-white/5">
                <Image
                  src={club.logo_url}
                  alt={`${club.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-white/50 text-xl font-medium flex-shrink-0 border border-white/10">
                {club.name ? club.name.charAt(0).toUpperCase() : 'C'}
              </div>
            )}
            <div>
              <h2 className="text-base font-medium text-white group-hover:text-white/90 transition-colors line-clamp-1">{club.name || 'Unnamed Club'}</h2>
              {club.type && (
                <span className="text-[11px] text-white/40 uppercase tracking-wider mt-1 block">
                  {club.type}
                </span>
              )}
            </div>
          </div>
          
          {club.department?.name && (
            <div className="mt-auto text-xs text-white/40 flex items-center gap-1.5 pt-4 border-t border-white/5">
              <span className="truncate">{club.department.name}</span>
            </div>
          )}

          <div className="absolute top-5 right-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
            </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-3xl bg-[#0A0A0A] text-white border-white/10 p-0 overflow-hidden shadow-2xl">
        <div className="p-8 pb-6 border-b border-white/10">
          <DialogHeader>
            <div className="flex items-center gap-5">
              {club.logo_url ? (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 bg-white/5">
                  <Image
                    src={club.logo_url}
                    alt={`${club.name} logo`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center text-white/50 text-2xl font-medium flex-shrink-0 border border-white/10">
                  {club.name ? club.name.charAt(0).toUpperCase() : 'C'}
                </div>
              )}
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-semibold tracking-tight">{club.name}</DialogTitle>
                {club.type && (
                  <span className="text-[11px] text-white/50 uppercase tracking-wider block">
                    {club.type}
                  </span>
                )}
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8 p-8 bg-black/40">
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4">Club Details</h3>
            
            <div className="space-y-4">
              {club.department?.name && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 bg-white/5 rounded-md border border-white/5">
                    </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white/40 uppercase tracking-wider mb-0.5">Department</span>
                    <span className="text-sm text-white/90">{club.department.name}</span>
                  </div>
                </div>
              )}
              
              {club.head_user && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 bg-white/5 rounded-md border border-white/5">
                    </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white/40 uppercase tracking-wider mb-0.5">Club Head</span>
                    <span className="text-sm text-white/90">{club.head_user.name || 'Not specified'}</span>
                    <a href={`mailto:${club.head_user.email}`} className="text-white/50 hover:text-white transition-colors text-xs mt-0.5">
                      {club.head_user.email}
                    </a>
                  </div>
                </div>
              )}

              {club.faculty_advisor && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 bg-white/5 rounded-md border border-white/5">
                    </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white/40 uppercase tracking-wider mb-0.5">Faculty Advisor</span>
                    <span className="text-sm text-white/90">{club.faculty_advisor.name || 'Not specified'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4">Organized Events</h3>
            
            <ScrollArea className="h-64 pr-4">
              {!club.events || club.events.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/30 py-10 border border-white/5 border-dashed rounded-xl">
                  <p className="text-sm">No events organized yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {club.events.map((event: any) => (
                    <div key={event.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <h4 className="font-medium text-sm text-white mb-2">{event.title}</h4>
                      <div className="flex items-center justify-between text-xs text-white/50">
                        <div className="flex items-center gap-1.5">
                          <span>{new Date(event.start_time).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/5 text-[10px] text-white/70">
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
