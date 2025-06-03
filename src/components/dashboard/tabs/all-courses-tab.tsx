"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Layers, Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCourseTimelineStatus } from "@/lib/utils"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

interface AllCoursesTabProps {
  courses: any[]
  courseSearch: string
  setCourseSearch: (search: string) => void
  router: AppRouterInstance
}

export function AllCoursesTab({ courses, courseSearch, setCourseSearch, router }: AllCoursesTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="h-5 w-5" />
            All Courses
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-8"
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
              />
            </div>
            <Button size="sm" onClick={() => router.push("/admin/course/register")}>
              <Plus className="h-4 w-4 mr-2" />
              New Course
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length > 0 ? (
                courses.slice(0, 5).map((course) => {
                  const status = getCourseTimelineStatus(course.startDate, course.endDate)
                  return (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>
                        <Badge variant={course.status === "Active" ? "default" : "secondary"}>{course.status}</Badge>
                      </TableCell>
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
                      <TableCell>{course.durationDays} days</TableCell>
                      <TableCell>{course.createdByUserName}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/course/details/${course.id}`)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No courses found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {courses.length > 5 && (
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={() => router.push("/admin/course")}>
              View All {courses.length} Courses
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
