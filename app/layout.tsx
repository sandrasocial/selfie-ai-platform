import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { Playfair_Display } from 'next/font/google'
import './globals.css'
import GlobalFooter from './components/GlobalFooter'

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
    <html lang="en" className={`${inter.variable} ${bodoni.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://i.postimg.cc" />
        <link rel="dns-prefetch" href="https://i.postimg.cc" />
        <link rel="preload" href="/fonts/bodoni-moda.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        <GlobalFooter />
      </body>
    </html>
  )
}