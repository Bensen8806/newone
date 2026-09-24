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
    <aside className="w-72 sm:w-80 flex-shrink-0 border-r bg-muted/30 flex flex-col h-full overflow-y-auto">
      <div className="p-4 flex flex-col gap-4">
        
        {/* Time Slot Selection */}
        <BorderGlow className="rounded-xl shadow-lg border bg-card" backgroundColor="hsl(var(--card))" glowColor="270 100 70">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Filter className="h-4 w-4 text-muted-foreground" />
              Select Time Slot
            </CardTitle>
            <CardDescription>Choose when you need a venue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label className="text-xs">Start Date</Label>
                <Popover>
                  <PopoverTrigger className={buttonVariants({ variant: "outline", className: cn(
                      "w-full justify-start text-left font-normal px-2",
                      !startDate && "text-muted-foreground"
                    )})}>
                    <CalendarIcon className="mr-2 h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{startDate ? format(startDate, "MMM d, yyyy") : "Pick"}</span>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(d) => d && setStartDate(d)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">End Date</Label>
                <Popover>
                  <PopoverTrigger className={buttonVariants({ variant: "outline", className: cn(
                      "w-full justify-start text-left font-normal px-2",
                      !endDate && "text-muted-foreground"
                    )})}>
                    <CalendarIcon className="mr-2 h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{endDate ? format(endDate, "MMM d, yyyy") : "Pick"}</span>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(d) => d && setEndDate(d)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label className="text-xs">Start Time</Label>
                <div className="relative">
                  <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="time" 
                    className="pl-8 px-2" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">End Time</Label>
                <div className="relative">
                  <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="time" 
                    className="pl-8 px-2" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button 
              className="w-full mt-2 font-semibold" 
              onClick={onCheck}
              disabled={isChecking}
            >
              {isChecking ? 'Checking...' : 'Check Availability'}
            </Button>
          </CardContent>
        </BorderGlow>

        {/* Legend */}
        <BorderGlow className="rounded-xl shadow-lg border bg-card" backgroundColor="hsl(var(--card))" glowColor="270 100 70">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Layers className="h-4 w-4 text-muted-foreground" />
              Legend
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
