"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Layers, Users, FileText, User } from "lucide-react"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

interface QuickActionsProps {
  isAdminOrTrainer: boolean
  router: AppRouterInstance
}

export function QuickActions({ isAdminOrTrainer, router }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => router.push("/admin/course")}>
            <Layers className="h-6 w-6" />
            <span>Browse Courses</span>
          </Button>
          {isAdminOrTrainer && (
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => router.push("/admin/users")}>
              <Users className="h-6 w-6" />
              <span>View Users</span>
            </Button>
          )}
          {isAdminOrTrainer && (
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => router.push("/admin/course/register")}
            >
              <FileText className="h-6 w-6" />
              <span>Create Course</span>
            </Button>
          )}
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col gap-2"
            onClick={() => router.push("/me/update")}
          >
            <User className="h-6 w-6" />
            <span>Edit Profile</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
