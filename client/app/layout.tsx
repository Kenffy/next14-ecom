import type { Metadata } from 'next'
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import './globals.css'
import { ThemeProvider } from '@/features/theme/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthenticatedProviders } from '@/features/globals/providers';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn("w-full bg-background", fontSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthenticatedProviders>
            <div className="min-h-full flex flex-col">
              {children}
            </div>
          </AuthenticatedProviders>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
