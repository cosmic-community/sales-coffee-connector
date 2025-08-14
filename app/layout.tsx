import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProviderWrapper from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sales Coffee Connector',
  description: 'Connect with fellow sales professionals for coffee chats and knowledge sharing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  )
}