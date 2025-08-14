import { AuthProvider } from '@/lib/auth'
import { Inter } from 'next/font/google'
import CosmicBadge from '@/components/CosmicBadge'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sales Coffee Connector',
  description: 'Connect with sales professionals for 15-minute virtual coffee chats',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <CosmicBadge bucketSlug={bucketSlug} />
        </AuthProvider>
      </body>
    </html>
  )
}