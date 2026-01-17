import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { LanguageProvider } from "@/lib/contexts/language-context"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Enchanted Hub - Life & Aim Tracker",
  description: "Your personal hub for goal tracking, gaming progress, daily journaling, and educational resources",
  generator: "NathanIs",
  authors: [{ name: "NathanIs" }],
  creator: "NathanIs",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body className="font-sans antialiased overflow-x-hidden">
        <ThemeProvider>
          <QueryProvider>
            <LanguageProvider>
              {children}
              <Toaster />
            </LanguageProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
