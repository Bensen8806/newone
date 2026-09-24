'use client'

import React from 'react'
import { Separator } from '@/components/ui/separator'
import Dock, { DockItemData } from '@/components/ui/Dock'
import { Code, Cpu, GraduationCap, Terminal, Globe, Zap, Sparkles, BookOpen } from 'lucide-react'

export default function Footer() {
  const dockItems: DockItemData[] = [
    {
      label: 'ACM NSSCE',
      icon: <Code className="w-5 h-5 text-indigo-400" />,
      onClick: () => window.open('https://nssce.acm.org', '_blank', 'noopener,noreferrer')
    },
    {
      label: 'STACS',
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
      onClick: () => window.open('https://stacs.nssce.ac.in', '_blank', 'noopener,noreferrer')
    },
    {
      label: 'MuLearn NSS',
      icon: <GraduationCap className="w-5 h-5 text-amber-400" />,
      onClick: () => window.open('https://mulearn-nss.vercel.app/', '_blank', 'noopener,noreferrer')
    },
    {
      label: 'Cypher Space',
      icon: <Terminal className="w-5 h-5 text-cyan-400" />,
      onClick: () => window.open('https://www.cypherspace.in/', '_blank', 'noopener,noreferrer')
    },
    {
      label: 'FOSS NSS',
      icon: <Globe className="w-5 h-5 text-green-400" />,
      onClick: () => window.open('https://fossnss.org', '_blank', 'noopener,noreferrer')
    },
    {
      label: 'IE(I) Electrical',
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      onClick: () => window.open('https://www.ieielectricalnssce.org/', '_blank', 'noopener,noreferrer')
    },
    {
      label: 'Celestia',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      onClick: () => window.open('https://celestianssce.org/', '_blank', 'noopener,noreferrer')
    },
    {
      label: 'ETLab Portal',
      icon: <BookOpen className="w-5 h-5 text-red-400" />,
      onClick: () => window.open('https://nssce.etlab.in/user/login', '_blank', 'noopener,noreferrer')
    }
  ]

  return (
    <footer className="w-full bg-background/30 backdrop-blur-md supports-[backdrop-filter]:bg-background/20 border-t border-white/10 mt-auto py-8">
      <div className="container mx-auto px-4 flex flex-col items-center gap-6">
        
        {/* Header Title */}
        <div className="text-center space-y-1">
          <h3 className="font-poppins text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Campus & Club Portals
          </h3>
          <p className="text-xs text-muted-foreground/70">
            Hover & click icons to access NSSCE portals
          </p>
        </div>

        {/* Dock Component for all Footer Links */}
        <div className="w-full flex justify-center py-2">
          <Dock
            items={dockItems}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
            distance={180}
          />
        </div>

        <Separator className="w-full my-2 bg-border/30" />

        {/* Bottom Bar */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="text-center sm:text-left text-xs leading-loose">
            Built for NSS College of Engineering, Palakkad. All rights reserved.
          </p>
          <p className="text-center text-xs font-medium italic text-muted-foreground">
            &quot;Uddhared atmanAtmanam&quot;
          </p>
        </div>
      </div>
    </footer>
  )
}
