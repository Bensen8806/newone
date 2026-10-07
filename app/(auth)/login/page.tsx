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

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
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
    <div className="flex min-h-screen items-center justify-center bg-transparent px-4">
      <div className="w-full max-w-md space-y-8 bg-[#0A0A0A] border border-white/10 rounded-xl p-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Students must use an <span className="font-medium text-white/80">@nssce.ac.in</span> email.
          </p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white/70">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="John Doe" 
                  required={!isLogin} 
                  className="bg-[#111] border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requestedRole" className="text-white/70">Requested Role <span className="text-white/30">(Optional)</span></Label>
                <Select name="requestedRole" defaultValue="STUDENT">
                  <SelectTrigger className="bg-[#111] border-white/10 text-white focus:ring-1 focus:ring-white/30">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A0A0A] border-white/10 text-white">
                    <SelectItem value="STUDENT" className="focus:bg-white/10 focus:text-white">Student (Default)</SelectItem>
                    <SelectItem value="CLUB_HEAD" className="focus:bg-white/10 focus:text-white">Club Head</SelectItem>
                    <SelectItem value="HOD" className="focus:bg-white/10 focus:text-white">Head of Department (HoD)</SelectItem>
                    <SelectItem value="PRINCIPAL" className="focus:bg-white/10 focus:text-white">Principal</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-white/40 mt-1">Special roles require admin approval.</p>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/70">Email address</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="name@nssce.ac.in" 
              required 
              className="bg-[#111] border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/70">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="pr-14 bg-[#111] border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium uppercase tracking-wider text-white/40 hover:text-white/80 transition-colors focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-10 bg-white text-black hover:bg-white/90 font-medium transition-colors" 
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign in' : 'Sign up')}
          </Button>
        </form>

        <div className="text-center text-sm text-white/50 mt-8">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-white hover:text-white/80 transition-colors ml-1"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
