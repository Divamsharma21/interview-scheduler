"use client"

import { useState } from "react"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const [user] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "Admin",
    company: "Acme Inc.",
  })

  const handleLogout = () => {
    // In a real app, this would handle logout logic
    window.location.href = "/"
  }

  return (
    <div className="p-8">
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button variant="destructive" size="sm" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
      <div className="border p-4 rounded-md">
        <h2 className="text-xl mb-4">Profile Information</h2>
        <p>Settings page content will appear here.</p>
      </div>
    </div>
  )
}
