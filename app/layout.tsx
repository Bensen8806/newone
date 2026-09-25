import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

import { TooltipProvider } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'NSSCE Event Management System',
  description: 'NSS College of Engineering, Palakkad — Event Management and Venue Booking System.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn('dark', inter.variable, poppins.variable)}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <TooltipProvider>
          <div className="relative flex min-h-screen flex-col">
          <Navbar />
          
          <main className="flex-1 flex flex-col min-h-0">{children}</main>
          
          <Footer />
        </div>
        </TooltipProvider>
      </body>
    </html>
  )
}
