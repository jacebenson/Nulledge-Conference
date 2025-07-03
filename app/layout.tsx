import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })
let title = "Nulledge Conference 2025 | Unofficial Technology Conference"
let description = "Join the leading minds in technology for a day of innovation, networking, and cutting-edge insights at Nulledge Conference 2025."
export const metadata: Metadata = {
  title: title,
  description: description,
  generator: '',
  icons: {
    icon: '/nullEDGEicon.png',
  },
  openGraph: {
    title: title,
    description: description,
    url: 'https://thenulledge.com',
    siteName: title,
    images: [{ url: 'https://thenulledge.com/nullEDGE Conference.jpg' }]
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
