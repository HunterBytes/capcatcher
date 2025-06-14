import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CapCatcher - Geography Capital Cities Game by Hunter J",
  description:
    "Test your knowledge of world capital cities in this fun and challenging geography game. Play with different regions, time limits, and difficulty modes! Created by Hunter J.",
  keywords: "geography, capitals, quiz, game, countries, flags, education",
  authors: [{ name: "Hunter J" }],
  openGraph: {
    title: "CapCatcher - Geography Game",
    description: "Test your knowledge of world capital cities!",
    type: "website",
  },
    generator: 'v0.dev'
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
