'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateClubDetails } from '@/app/actions/club'

export default function ClubEditForm({ 
  club, 
  profile, 
  facultyAdvisors, 
  departments 
}: { 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  club: any, 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any, 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  facultyAdvisors: any[], 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  departments: any[] 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    try {
      await updateClubDetails(formData)
      setIsOpen(false)
    } catch (error) {
      console.error(error)
      alert("Failed to update details")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          size="sm"
          className="w-full h-8 text-xs font-medium border-white/10 bg-transparent text-white/70 hover:bg-white/5 hover:text-white transition-colors"
        >
          Edit Club Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-[#0A0A0A] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Club Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white/70 text-xs uppercase tracking-wider font-semibold">Club Name</Label>
            <Input id="name" name="name" defaultValue={club?.name || ''} required className="bg-[#111] border-white/10 text-white focus-visible:ring-1 focus-visible:ring-white/30" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type" className="text-white/70 text-xs uppercase tracking-wider font-semibold">Club Type</Label>
            <Input id="type" name="type" defaultValue={club?.type || ''} required placeholder="e.g. Technical, Cultural" className="bg-[#111] border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo_url" className="text-white/70 text-xs uppercase tracking-wider font-semibold">Logo URL</Label>
            <Input id="logo_url" name="logo_url" defaultValue={club?.logo_url || ''} placeholder="https://example.com/logo.png" className="bg-[#111] border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/70 text-xs uppercase tracking-wider font-semibold">Club Head Email</Label>
            <Input id="email" name="email" type="email" defaultValue={profile?.email || ''} required className="bg-[#111] border-white/10 text-white focus-visible:ring-1 focus-visible:ring-white/30" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department_id" className="text-white/70 text-xs uppercase tracking-wider font-semibold">Department</Label>
            <select 
              id="department_id" 
              name="department_id" 
              defaultValue={club?.department_id || ''} 
              className="flex h-10 w-full items-center justify-between rounded-md border border-white/10 bg-[#111] px-3 py-2 text-sm text-white ring-offset-background placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id} className="bg-[#111] text-white">{dept.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="faculty_advisor_id" className="text-white/70 text-xs uppercase tracking-wider font-semibold">Faculty Advisor</Label>
            <select 
              id="faculty_advisor_id" 
              name="faculty_advisor_id" 
              defaultValue={club?.faculty_advisor_id || ''} 
              className="flex h-10 w-full items-center justify-between rounded-md border border-white/10 bg-[#111] px-3 py-2 text-sm text-white ring-offset-background placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select an advisor</option>
              {facultyAdvisors.map((adv) => (
                <option key={adv.id} value={adv.id} className="bg-[#111] text-white">{adv.name || adv.email}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-white/5 mt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="h-9 px-4 text-xs font-medium border-white/10 bg-transparent text-white/70 hover:bg-white/5 hover:text-white transition-colors"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="h-9 px-4 text-xs font-medium bg-white text-black hover:bg-white/90 transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
