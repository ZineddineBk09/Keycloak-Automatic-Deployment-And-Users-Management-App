import type { Metadata } from 'next'
import { Noto_Sans as FontSans } from 'next/font/google'
import { cn } from '@/lib/utils'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeSwitch } from '@/components/theme-switch'
import SessionWrapper from '@/components/login/session-wrapper'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Keycloak User Management',
  description: 'Keycloak User Management App',
}

const fontSans = FontSans({
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={cn(
          'text-gray-900',
          'bg-white',
          'dark:bg-gray-900',
          'dark:text-gray-100',
          fontSans
        )}
      >
        <SessionWrapper>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <ThemeSwitch />
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  )
}
