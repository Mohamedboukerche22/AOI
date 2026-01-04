import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AOI Management Portal - Algerian Olympiad in Informatics',
  description: 'Digitize administrative workflow for Algerian Olympiad in Informatics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Make sure this path is correct relative to your public folder */}
        <link rel="icon" href="/AOI_COLOR_NLOGO_WHITE.ico" />
      </head>
      <body className={inter.className}>
        {/* The Toaster handles all your beautiful notifications */}
        <Toaster 
          position="top-right" 
          richColors 
          theme="dark" 
          closeButton 
          expand={false}
        />
        
        {children}
        
        <SpeedInsights />
      </body>
    </html>
  )
}