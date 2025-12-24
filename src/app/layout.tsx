import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { SpeedInsights } from "@vercel/speed-insights/next"

<SpeedInsights/>
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
        <link rel="icon" href="./AOI_COLOR_NLOGO_WHITE.ico" />
      </head>
      <body className={inter.className}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}