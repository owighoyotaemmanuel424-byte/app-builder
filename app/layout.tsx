import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'PATCHBAY — Build with AI', description: 'Describe an idea, generate an app, iterate, preview and deploy.' }

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>
}
