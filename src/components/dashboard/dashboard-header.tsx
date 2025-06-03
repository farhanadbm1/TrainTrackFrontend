"use client"

import { Button } from "@/components/ui/button"
import { User, Plus } from "lucide-react"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

interface DashboardHeaderProps {
  profile: any
  router: AppRouterInstance
}

export function DashboardHeader({ profile, router }: DashboardHeaderProps) {
  // Check if user is admin or trainer
  const isAdmin = profile?.role === "Admin"
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {profile.name}!</h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your courses and assignments</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => router.push("/me")}>
          <User className="mr-2 h-4 w-4" />
          View Profile
        </Button>
        {isAdmin && (
          <Button onClick={() => router.push("/admin/course/register")}>
            <Plus className="mr-2 h-4 w-4" />
            New Course
          </Button>
        )}
      </div>
    </div>
  )
}
