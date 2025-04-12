import { Inter } from "next/font/google"
import Link from "next/link"
import { Headphones } from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "InterviewBot - Automated Interview Scheduling",
  description: "Voice-driven interview scheduling assistant",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-16 items-center">
                <div className="mr-4 hidden md:flex">
                  <Link href="/" className="mr-6 flex items-center space-x-2">
                    <Headphones className="h-6 w-6" />
                    <span className="hidden font-bold sm:inline-block">InterviewBot</span>
                  </Link>
                  <nav className="flex items-center space-x-6 text-sm font-medium">
                    <Link href="/dashboard" className="transition-colors hover:text-foreground/80">
                      Dashboard
                    </Link>
                    <Link href="/candidates" className="transition-colors hover:text-foreground/80">
                      Candidates
                    </Link>
                    <Link href="/schedule" className="transition-colors hover:text-foreground/80">
                      Schedule
                    </Link>
                    <Link href="/jobs" className="transition-colors hover:text-foreground/80">
                      Jobs
                    </Link>
                    <Link href="/settings" className="transition-colors hover:text-foreground/80">
                      Settings
                    </Link>
                  </nav>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-4">
                  <Link href="/signin">
                    <Button variant="outline" size="sm" className="h-8">
                      Sign In
                    </Button>
                  </Link>
                  <Button size="sm" className="h-8">
                    Get Started
                  </Button>
                </div>
              </div>
            </header>
            <div className="flex-1">{children}</div>
            <footer className="border-t py-6 md:py-0">
              <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  © 2023 InterviewBot. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                  <Link href="/terms" className="text-sm text-muted-foreground underline underline-offset-4">
                    Terms
                  </Link>
                  <Link href="/privacy" className="text-sm text-muted-foreground underline underline-offset-4">
                    Privacy
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'