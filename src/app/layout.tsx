import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/providers/AuthProvider'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Meta Fácil - Marketing Completo para Opções Binárias',
  description: 'Sistema completo de marketing digital para opções binárias. Gerencie Instagram, Facebook e Telegram com IA integrada.',
  keywords: ['opções binárias', 'marketing digital', 'instagram', 'facebook', 'telegram', 'IA', 'automação'],
  authors: [{ name: 'Meta Fácil Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Meta Fácil - Marketing Completo para Opções Binárias',
    description: 'Sistema completo de marketing digital para opções binárias',
    type: 'website',
    locale: 'pt_BR',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <div id="root">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}