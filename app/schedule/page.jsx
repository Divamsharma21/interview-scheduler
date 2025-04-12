"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  // Fix the Schedule Interview button functionality
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Generate days for the current month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    const days = []
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const days = getDaysInMonth(currentDate)

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  // Check if a date has interviews scheduled
  const hasInterviews = (date) => {
    if (!date) return false
    // This would normally check against actual data
    // For demo purposes, we'll randomly assign interviews to some days
    return date.getDate() % 3 === 0
  }

  // Get number of interviews for a date
  const getInterviewCount = (date) => {
    if (!date) return 0
    // This would normally check against actual data
    // For demo purposes, we'll randomly assign interview counts
    return date.getDate() % 5 === 0 ? 3 : date.getDate() % 3 === 0 ? 2 : 0
  }

  // Handle date selection
  const handleDateSelect = (date) => {
    if (date) {
      setSelectedDate(new Date(date))
    }
  }

  // Get time for display
  const getTimeForDisplay = (date, hoursToAdd) => {
    if (!date) return ""
    const newDate = new Date(date)
    newDate.setHours(9 + hoursToAdd, 0, 0)
    return newDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl">Interview Schedule</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Interview
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Interview</DialogTitle>
                <DialogDescription>Create a new interview slot for a candidate.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="candidate">Candidate</Label>
                  <Select>
                    <SelectTrigger id="candidate">
                      <SelectValue placeholder="Select candidate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="candidate1">John Doe</SelectItem>
                      <SelectItem value="candidate2">Jane Smith</SelectItem>
                      <SelectItem value="candidate3">Robert Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" type="time" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="position">Position</Label>
                  <Select>
                    <SelectTrigger id="position">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineer">Software Engineer</SelectItem>
                      <SelectItem value="designer">UX Designer</SelectItem>
                      <SelectItem value="manager">Product Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="interviewer">Interviewer</Label>
                  <Select>
                    <SelectTrigger id="interviewer">
                      <SelectValue placeholder="Select interviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interviewer1">Alex Johnson</SelectItem>
                      <SelectItem value="interviewer2">Maria Garcia</SelectItem>
                      <SelectItem value="interviewer3">David Chen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={() => {
                    alert("Interview scheduled successfully!")
                    setIsDialogOpen(false)
                  }}
                >
                  Schedule Interview
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Calendar</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="min-w-[150px] text-center font-medium">{formatDate(currentDate)}</div>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>View and manage your interview schedule.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="font-medium text-sm py-1">
                    {day}
                  </div>
                ))}

                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`aspect-square p-1 rounded-md border ${
                      day && day.getDate() === new Date().getDate() && day.getMonth() === new Date().getMonth()
                        ? "bg-primary/10 border-primary"
                        : ""
                    } ${day ? "cursor-pointer hover:bg-muted" : ""}`}
                    onClick={() => day && handleDateSelect(day)}
                  >
                    {day && (
                      <div className="h-full flex flex-col">
                        <div className="text-sm">{day.getDate()}</div>
                        {hasInterviews(day) && (
                          <div className="mt-auto">
                            <div className="text-xs font-medium text-primary">{getInterviewCount(day)} interviews</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate
                  ? selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                  : "Select a Date"}
              </CardTitle>
              <CardDescription>
                {selectedDate
                  ? `${getInterviewCount(selectedDate)} interviews scheduled`
                  : "Click on a date to view scheduled interviews"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                getInterviewCount(selectedDate) > 0 ? (
                  <div className="space-y-4">
                    {Array.from({ length: getInterviewCount(selectedDate) }).map((_, i) => (
                      <div key={i} className="flex flex-col space-y-2 p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">Candidate {i + 1}</div>
                          <div className="text-sm text-muted-foreground">{getTimeForDisplay(selectedDate, i * 2)}</div>
                        </div>
                        <div className="text-sm">
                          Position: {["Software Engineer", "UX Designer", "Product Manager"][i % 3]}
                        </div>
                        <div className="text-sm">
                          Interviewer: {["Alex Johnson", "Maria Garcia", "David Chen"][i % 3]}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                          <Button size="sm">Join</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-center">
                    <p className="text-muted-foreground mb-2">No interviews scheduled for this date</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Interview
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Schedule New Interview</DialogTitle>
                          <DialogDescription>Create a new interview slot for a candidate.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="candidate">Candidate</Label>
                            <Select>
                              <SelectTrigger id="candidate">
                                <SelectValue placeholder="Select candidate" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="candidate1">John Doe</SelectItem>
                                <SelectItem value="candidate2">Jane Smith</SelectItem>
                                <SelectItem value="candidate3">Robert Johnson</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="date">Date</Label>
                              <Input
                                id="date"
                                type="date"
                                value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
                                readOnly
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="time">Time</Label>
                              <Input id="time" type="time" />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="position">Position</Label>
                            <Select>
                              <SelectTrigger id="position">
                                <SelectValue placeholder="Select position" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="engineer">Software Engineer</SelectItem>
                                <SelectItem value="designer">UX Designer</SelectItem>
                                <SelectItem value="manager">Product Manager</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="interviewer">Interviewer</Label>
                            <Select>
                              <SelectTrigger id="interviewer">
                                <SelectValue placeholder="Select interviewer" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="interviewer1">Alex Johnson</SelectItem>
                                <SelectItem value="interviewer2">Maria Garcia</SelectItem>
                                <SelectItem value="interviewer3">David Chen</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Schedule Interview</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-center">
                  <p className="text-muted-foreground">Select a date from the calendar to view scheduled interviews</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
