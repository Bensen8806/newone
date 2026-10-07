'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function RegistrationModal({
  registrationUrl,
  eventTitle
}: {
  registrationUrl: string
  eventTitle: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full bg-white text-black hover:bg-white/90 font-medium"
        >
          Register Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] w-[90vw] h-[80vh] flex flex-col p-0 border-white/10 bg-[#0A0A0A]">
        <DialogHeader className="p-4 border-b border-white/10">
          <DialogTitle className="text-white">Register: {eventTitle}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 bg-[#111] relative w-full h-full">
          <iframe 
            src={registrationUrl} 
            className="w-full h-full absolute inset-0 border-0" 
            title={`Registration for ${eventTitle}`}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
