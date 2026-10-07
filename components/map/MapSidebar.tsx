'use client'

import { format } from 'date-fns'

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
import { cn } from '@/lib/utils'

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
    <aside className="w-72 sm:w-80 flex-shrink-0 border-r border-white/5 bg-[#0A0A0A] flex flex-col h-full overflow-y-auto overflow-x-hidden scrollbar-hide z-10 pt-10">
      <div className="p-5 flex flex-col gap-6">
        
        {/* Time Slot Selection */}
        <div className="rounded-xl border border-white/10 bg-[#111] overflow-hidden">
          <CardHeader className="pb-4 pt-5 px-5">
            <CardTitle className="text-sm font-semibold tracking-wide text-white">
              Select Time Slot
            </CardTitle>
            <CardDescription className="text-xs mt-1 text-white/50">Choose when you need a venue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 px-5 pb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <Label className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Start Date</Label>
                <Popover>
                  <PopoverTrigger className={buttonVariants({ variant: "outline", className: cn(
                      "w-full justify-center text-center font-medium px-3 h-10 text-xs bg-[#0A0A0A] border-white/10 hover:bg-[#1A1A1A] hover:text-white transition-colors",
                      !startDate && "text-white/40"
                    )})}>
                    <span className="truncate">{startDate ? format(startDate, "MMM d, yyyy") : "Select"}</span>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-white/10 bg-[#0A0A0A] text-white" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(d) => d && setStartDate(d)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2.5">
                <Label className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">End Date</Label>
                <Popover>
                  <PopoverTrigger className={buttonVariants({ variant: "outline", className: cn(
                      "w-full justify-center text-center font-medium px-3 h-10 text-xs bg-[#0A0A0A] border-white/10 hover:bg-[#1A1A1A] hover:text-white transition-colors",
                      !endDate && "text-white/40"
                    )})}>
                    <span className="truncate">{endDate ? format(endDate, "MMM d, yyyy") : "Select"}</span>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-white/10 bg-[#0A0A0A] text-white" align="start">
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
                <Label className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Start Time</Label>
                <div className="relative">
                  <Input 
                    type="time" 
                    className="px-3 text-center h-10 text-xs font-medium bg-[#0A0A0A] border-white/10 text-white focus-visible:ring-1 focus-visible:ring-white/20 transition-all" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <Label className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">End Time</Label>
                <div className="relative">
                  <Input 
                    type="time" 
                    className="px-3 text-center h-10 text-xs font-medium bg-[#0A0A0A] border-white/10 text-white focus-visible:ring-1 focus-visible:ring-white/20 transition-all" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 w-full flex justify-center">
              <Button 
                className="w-full text-xs font-medium h-10 bg-white text-black hover:bg-white/90 transition-colors" 
                onClick={onCheck}
                disabled={isChecking}
              >
                {isChecking ? 'Checking...' : 'Check Availability'}
              </Button>
            </div>
          </CardContent>
        </div>

        {/* Legend */}
        <div className="rounded-xl border border-white/10 bg-[#111] overflow-hidden">
          <CardHeader className="pb-4 pt-5 px-5">
            <CardTitle className="text-sm font-semibold tracking-wide text-white">
              Legend
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-5 pb-6">
            <div className="flex items-center gap-3 text-xs text-white/70">
              <div className="w-2.5 h-2.5 rounded-[3px] bg-green-500/20 border border-green-500/50 flex-shrink-0" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/70">
              <div className="w-2.5 h-2.5 rounded-[3px] bg-amber-500/20 border border-amber-500/50 flex-shrink-0" />
              <span>Pending Request</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/70">
              <div className="w-2.5 h-2.5 rounded-[3px] bg-red-500/20 border border-red-500/50 flex-shrink-0" />
              <span>Booked / Approved</span>
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center gap-3 text-xs text-white/70">
              <div className="w-2.5 h-2.5 rounded-[3px] bg-white/5 border border-white/10 flex-shrink-0" />
              <span>{hasChecked ? 'Not Available' : 'No Selection Yet'}</span>
            </div>
          </CardContent>
        </div>

      </div>
    </aside>
  )
}
