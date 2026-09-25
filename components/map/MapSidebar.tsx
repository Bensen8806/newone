'use client'

import { format } from 'date-fns'
import { Calendar as CalendarIcon, Clock, Filter, Layers } from 'lucide-react'

import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import SpecularButton from '@/components/ui/SpecularButton'
import { cn } from '@/lib/utils'
import BorderGlow from '@/components/ui/BorderGlow'

interface MapSidebarProps {
  startDate: Date
  setStartDate: (date: Date) => void
  endDate: Date
  setEndDate: (date: Date) => void
  startTime: string
  setStartTime: (time: string) => void
  endTime: string
  setEndTime: (time: string) => void
  onCheck: () => void
  isChecking: boolean
  hasChecked: boolean
}

export default function MapSidebar({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  onCheck,
  isChecking,
  hasChecked
}: MapSidebarProps) {
  return (
    <aside className="w-72 sm:w-80 flex-shrink-0 border-r border-white/10 bg-black/20 backdrop-blur-xl flex flex-col h-full overflow-y-auto overflow-x-hidden scrollbar-hide z-10">
      <div className="p-5 flex flex-col gap-6">
        
        {/* Time Slot Selection */}
        <BorderGlow className="rounded-xl shadow-xl border border-white/5 bg-black/40" borderRadius={12}>
          <CardHeader className="pb-4 pt-5 px-5">
            <CardTitle className="text-sm font-semibold tracking-wide">
              Select Time Slot
            </CardTitle>
            <CardDescription className="text-xs mt-1">Choose when you need a venue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 px-5 pb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Start Date</Label>
                <Popover>
                  <PopoverTrigger className={buttonVariants({ variant: "outline", className: cn(
                      "w-full justify-center text-center font-medium px-3 h-10 text-sm bg-black/40 border-white/10 hover:bg-white/5",
                      !startDate && "text-muted-foreground"
                    )})}>
                    <span className="truncate">{startDate ? format(startDate, "MMM d, yyyy") : "Select"}</span>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-white/10 bg-black/90 backdrop-blur-xl" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(d) => d && setStartDate(d)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2.5">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">End Date</Label>
                <Popover>
                  <PopoverTrigger className={buttonVariants({ variant: "outline", className: cn(
                      "w-full justify-center text-center font-medium px-3 h-10 text-sm bg-black/40 border-white/10 hover:bg-white/5",
                      !endDate && "text-muted-foreground"
                    )})}>
                    <span className="truncate">{endDate ? format(endDate, "MMM d, yyyy") : "Select"}</span>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-white/10 bg-black/90 backdrop-blur-xl" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(d) => d && setEndDate(d)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Start Time</Label>
                <div className="relative">
                  <Input 
                    type="time" 
                    className="px-3 text-center h-10 text-sm font-medium bg-black/40 border-white/10 focus-visible:ring-1 focus-visible:ring-primary/50" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">End Time</Label>
                <div className="relative">
                  <Input 
                    type="time" 
                    className="px-3 text-center h-10 text-sm font-medium bg-black/40 border-white/10 focus-visible:ring-1 focus-visible:ring-primary/50" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 w-full flex justify-center">
              <SpecularButton 
                className="w-full font-semibold text-sm h-10" 
                onClick={onCheck}
                disabled={isChecking}
                baseColor="#18181b"
                lineColor="#60a5fa"
              >
                {isChecking ? 'Checking...' : 'Check Availability'}
              </SpecularButton>
            </div>
          </CardContent>
        </BorderGlow>

        {/* Legend */}
        <BorderGlow className="rounded-xl shadow-xl border border-white/5 bg-black/40" borderRadius={12}>
          <CardHeader className="pb-4 pt-5 px-5">
            <CardTitle className="text-sm font-semibold tracking-wide">
              Legend
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-5 pb-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-3 h-3 rounded-sm bg-green-500/20 border-2 border-green-600 flex-shrink-0" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-3 h-3 rounded-sm bg-amber-500/20 border-2 border-amber-600 flex-shrink-0" />
              <span>Pending Request</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-3 h-3 rounded-sm bg-red-500/20 border-2 border-red-600 flex-shrink-0" />
              <span>Booked / Approved</span>
            </div>
            <Separator />
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-3 h-3 rounded-sm bg-muted border-2 border-muted-foreground/30 flex-shrink-0" />
              <span>{hasChecked ? 'Not Available' : 'No Selection Yet'}</span>
            </div>
          </CardContent>
        </BorderGlow>

      </div>
    </aside>
  )
}
