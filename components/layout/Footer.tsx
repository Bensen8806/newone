'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import JellyRadio from '@/components/ui/JellyRadio'
import { Home, LayoutDashboard, Phone, Mail } from 'lucide-react'

interface QuickLink {
  name: string
  url: string
}

const QUICK_LINKS: QuickLink[] = [
  { name: 'ACM NSSCE', url: 'https://nssce.acm.org' },
  { name: 'STACS', url: 'https://stacs.nssce.ac.in' },
  { name: 'MuLearn NSS', url: 'https://mulearn-nss.vercel.app/' },
  { name: 'Cypher Space', url: 'https://www.cypherspace.in/' },
  { name: 'FOSS NSS', url: 'https://fossnss.org' },
  { name: 'IE(I) Electrical Chapter', url: 'https://www.ieielectricalnssce.org/' },
  { name: 'Celestia', url: 'https://celestianssce.org/' },
]

export default function Footer() {
  const router = useRouter()

  const radioItems = [
    {
      value: '/',
      label: 'Home',
      icon: <Home className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors" />
    },
    {
      value: '/login',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors" />
    },
    {
      value: 'contact',
      label: 'Contact',
      icon: <Phone className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors" />
    },
    {
      value: 'email',
      label: 'Email Us',
      icon: <Mail className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors" />
    }
  ]

  return (
    <footer className="w-full bg-background/30 backdrop-blur-md supports-[backdrop-filter]:bg-background/20 border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-4">
        
        {/* Navigation Dock in Footer (Above other links) */}
        <div className="w-full flex flex-col items-center gap-2 pb-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-red-500">
            Quick Navigation
          </span>
          <JellyRadio
            items={radioItems}
            defaultValue="/"
            onChange={(val) => {
              if (val === 'contact') {
                window.location.href = 'mailto:eventsnssce@gmail.com?subject=Inquiry%20-%20NSSCE%20Event%20System'
              } else if (val === 'email') {
                window.location.href = 'mailto:eventsnssce@gmail.com'
              } else {
                router.push(val)
              }
            }}
          />
        </div>

        <Separator className="mb-4 bg-border/40" />

        {/* Main Grid: Left side Brand + ETLab, Right side Club Portals */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-4">
          {/* Brand & Description + ETLab on the Left Side */}
          <div className="max-w-md space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-poppins font-bold text-xl tracking-tight text-primary">
                NSSCE
              </span>
              <span className="font-poppins text-sm text-muted-foreground font-medium">
                Event Management
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Official event scheduling and venue management portal for NSS College of Engineering, Palakkad.
            </p>

            {/* ETLab Link on the Left Side */}
            <div className="pt-2">
              <a
                href="https://nssce.etlab.in/user/login"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary font-medium text-xs transition-all duration-150 border border-primary/20 group"
              >
                <span>ETLab Academic Portal</span>
                <svg
                  className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Section on the Right Side */}
          <div className="flex-1 lg:max-w-2xl">
            <nav aria-label="Campus Portals and Clubs">
              <h3 className="font-poppins text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Campus & Club Portals
              </h3>
              <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-sm">
                {QUICK_LINKS.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors duration-150 group"
                    >
                      <span className="group-hover:underline underline-offset-4">{link.name}</span>
                      <svg
                        className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <Separator className="my-4 bg-border/40" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <p className="text-center sm:text-left text-xs leading-loose">
            Built for NSS College of Engineering, Palakkad. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
