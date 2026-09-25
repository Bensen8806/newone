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
import SpecularButton from "@/components/ui/SpecularButton"

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
        <SpecularButton 
          className="w-full"
          baseColor="#065f46"
          lineColor="#10b981"
        >
          Register Now
        </SpecularButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] w-[90vw] h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Register: {eventTitle}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 bg-muted/20 relative w-full h-full">
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
