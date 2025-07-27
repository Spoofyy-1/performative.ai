import React from 'react'
import './globals.css'
import { Inter } from 'next/font/google'
import type { Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Performative.AI - AI Detection Suite for Modern Culture',
  description: 'Advanced AI detection for matcha, Labubu, tote bags, and performative behavior. Four specialized models powered by OpenAI Vision.',
  keywords: 'AI detection, matcha recognition, Labubu detector, tote bag identification, performative male analysis',
  authors: [{ name: 'Performative.AI' }],
  creator: 'Performative.AI',
  publisher: 'Performative.AI',
  openGraph: {
    title: 'Performative.AI - AI Detection Suite',
    description: 'Advanced AI detection for modern culture analysis',
    url: 'https://performative-ai.vercel.app',
    siteName: 'Performative.AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Performative.AI - AI Detection Suite',
    description: 'Advanced AI detection for modern culture analysis',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#6366f1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Performative.AI" />
      </head>
      <body className={`${inter.className} touch-manipulation`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
} 