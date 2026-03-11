import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import './globals.css'

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Color Palette Generator',
  description:
    'Generate an 11-step Tailwind-style palette in OKLCH with APCA contrast scores.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className={`${geistMono.variable}`}>
      <body className='antialiased'>{children}</body>
    </html>
  )
}
