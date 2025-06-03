"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Layers } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCourseTimelineStatus } from "@/lib/utils"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { use } from "react"

interface CoursesTabProps {
  userCourses: any[]
  router: AppRouterInstance
  authUser: any
}

export function CoursesTab({ userCourses, router, authUser }: CoursesTabProps) {
  // This is the simplified component - you would implement the full functionality here
const basePath=authUser?.role.toLowerCase()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Layers className="h-5 w-5" />
          My Courses
        </CardTitle>
      </CardHeader>
      <CardContent>
        {userCourses && userCourses.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userCourses.map((userCourse) => {
                  const course = userCourses ?.find((c) => c.id === userCourse.id)
                  if (!course) return null

                  const status = getCourseTimelineStatus(course.startDate, course.endDate)
                  return (
                    <TableRow key={userCourse.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            status === "upcoming"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : status === "ongoing"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                          }
                        >
                          {status === "upcoming" ? "Upcoming" : status === "ongoing" ? "Ongoing" : "Completed"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(course.startDate).toLocaleDateString()} -{" "}
                        {new Date(course.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/${basePath}/mycourses/details/${course.id}`)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">No courses found</h3>
            <p className="text-muted-foreground">You are not assigned to any courses yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
