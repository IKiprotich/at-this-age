import type { Metadata } from 'next'
import './globals.css'
import ErrorSuppressor from './ErrorSuppressor'

export const metadata: Metadata = {
  title: 'at this age',
  description: 'A quiet space for personal reflection',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <ErrorSuppressor />
        {children}
      </body>
    </html>
  )
}
