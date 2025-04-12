import Link from "next/link"
import { CalendarDays, MessageSquare, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Automate Your Interview Scheduling
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Our voice-driven assistant calls candidates, collects information, and books appointments
                  automatically. Save time and focus on finding the right talent.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/demo">
                  <Button size="lg" className="w-full">
                    Try Demo
                  </Button>
                </Link>
                <Link href="/schedule">
                  <Button size="lg" variant="outline" className="w-full">
                    Schedule Interview
                  </Button>
                </Link>
              </div>
            </div>
            <img
              src="/placeholder.svg?height=550&width=550"
              width={550}
              height={550}
              alt="Hero"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">How It Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our voice-driven assistant streamlines the interview scheduling process with a conversational approach.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <Card>
              <CardHeader>
                <MessageSquare className="h-10 w-10 mb-2" />
                <CardTitle>Automated Calls</CardTitle>
                <CardDescription>
                  Our system calls candidates and conducts a natural conversation to gather information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Using advanced speech recognition and natural language processing, our assistant engages candidates in
                  a human-like conversation.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/demo">Learn more</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 mb-2" />
                <CardTitle>Information Collection</CardTitle>
                <CardDescription>
                  Gather all necessary candidate details through a conversational Q&A process.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  The assistant collects candidate information, preferences, and qualifications, storing everything in
                  your database for easy access.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/candidates">Learn more</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CalendarDays className="h-10 w-10 mb-2" />
                <CardTitle>Appointment Booking</CardTitle>
                <CardDescription>
                  Automatically schedule interviews based on availability and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  The system checks your calendar, offers available slots to candidates, and confirms appointments in
                  real-time.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/schedule">Learn more</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
