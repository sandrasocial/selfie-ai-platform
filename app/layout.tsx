import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { Playfair_Display } from 'next/font/google'
import './globals.css'

// Load Inter font
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

// Load local Bodoni font
const bodoni = localFont({
  src: [
    {
      path: '../public/fonts/bodoni/BodoniFlf-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/bodoni/BodoniFlf-Italic.woff',
      weight: '400',
      style: 'italic',
    }
  ],
  variable: '--font-bodoni'
})

// Load Playfair Display font
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair'
})

export const metadata: Metadata = {
  title: 'SELFIE AI™',
  description: 'Transform your personal brand with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${bodoni.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  )
}