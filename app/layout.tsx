import type { Metadata } from 'next'
import { Noto_Sans as FontSans } from 'next/font/google'
import { cn } from '../lib/utils'
import './globals.css'
import { ThemeProvider } from '../components/theme-provider'
import { Toaster } from 'sonner'
import CheckAuthGuard from '../components/guards/auth-guard'
import { MainNav } from '../components/ui/main-nav'

export const metadata: Metadata = {
  title: 'Users Management',
  description: 'Users Management Application',
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
          'overflow-x-hidden',
          fontSans
        )}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <CheckAuthGuard>
            <MainNav />
            {children}
            <Toaster visibleToasts={10} richColors closeButton />
          </CheckAuthGuard>
        </ThemeProvider>
      </body>
    </html>
  )
}
