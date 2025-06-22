import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import GlobalFooter from './components/GlobalFooter'

// Load Inter font (Neue Einstellung substitute)
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

// Load Cormorant Garamond (brand primary serif)
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant'
})

// Load local Bodoni font as backup
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

export const metadata = {
  title: 'SELFIE AI™ - Your Selfie is Your Brand | Personal Brand Platform',
  description: 'Build your personal brand from your camera roll. Join 10,000+ women who transformed their online presence in 90 days. Free guide included.',
  keywords: 'personal branding, selfie strategy, content creation, women entrepreneurs, brand building, social media strategy',
  openGraph: {
    title: 'SELFIE AI™ - Your Selfie is Your Brand',
    description: 'Transform your online presence with AI-powered personal brand tools. Built by women, for women.',
    url: 'https://selfie-ai.com',
    siteName: 'SELFIE AI™',
    images: [
      {
        url: 'https://selfie-ai.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SELFIE AI™ - Personal Brand Platform',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SELFIE AI™ - Your Selfie is Your Brand',
    description: 'Transform your online presence in 90 days',
    images: ['https://selfie-ai.com/twitter-image.jpg'],
    creator: '@sandraselfieai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://selfie-ai.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${bodoni.variable}`}>
      <head>
        <link rel="preconnect" href="https://i.postimg.cc" />
        <link rel="dns-prefetch" href="https://i.postimg.cc" />
      </head>
      <body>
        {children}
        <GlobalFooter />
      </body>
    </html>
  )
}