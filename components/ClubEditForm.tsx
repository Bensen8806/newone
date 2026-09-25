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
        <Button variant="outline" className="rounded-full mt-4 border-white/20 hover:bg-white/10 dark:text-white">Edit Club Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle>Edit Club Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Club Name</Label>
            <Input id="name" name="name" defaultValue={club?.name || ''} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Club Type</Label>
            <Input id="type" name="type" defaultValue={club?.type || ''} required placeholder="e.g. Technical, Cultural" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input id="logo_url" name="logo_url" defaultValue={club?.logo_url || ''} placeholder="https://example.com/logo.png" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Club Head Email</Label>
            <Input id="email" name="email" type="email" defaultValue={profile?.email || ''} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department_id">Department</Label>
            <select 
              id="department_id" 
              name="department_id" 
              defaultValue={club?.department_id || ''} 
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="faculty_advisor_id">Faculty Advisor</Label>
            <select 
              id="faculty_advisor_id" 
              name="faculty_advisor_id" 
              defaultValue={club?.faculty_advisor_id || ''} 
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select an advisor</option>
              {facultyAdvisors.map((adv) => (
                <option key={adv.id} value={adv.id}>{adv.name || adv.email}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
