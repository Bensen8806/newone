'use client'

import { useState } from 'react'
import { login, signup } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import BorderGlow from '@/components/ui/BorderGlow'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = isLogin ? await login(formData) : await signup(formData)
    
    if (result?.error) {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <BorderGlow 
        className="w-full max-w-md space-y-8 rounded-xl shadow-sm p-8" 
        backgroundColor="hsl(var(--card))"
        glowColor="270 100 70" 
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Students must use an <span className="font-semibold text-primary">@nssce.ac.in</span> email.
          </p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required={!isLogin} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requestedRole">Requested Role (Optional)</Label>
                <Select name="requestedRole" defaultValue="STUDENT">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student (Default)</SelectItem>
                    <SelectItem value="CLUB_HEAD">Club Head</SelectItem>
                    <SelectItem value="HOD">Head of Department (HoD)</SelectItem>
                    <SelectItem value="PRINCIPAL">Principal</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">Special roles require admin approval.</p>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" name="email" type="email" placeholder="name@nssce.ac.in" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>

          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Sign in' : 'Sign up')}
          </Button>
        </form>

        <div className="text-center text-sm mt-8">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-primary hover:underline"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </BorderGlow>
    </div>
  )
}
