"use client"

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCourseTimelineStatus } from "@/lib/utils"

interface RecentActivityProps {
  assignments: any[]
  courses: any[]
  profile: any
  setActiveTab: (tab: string) => void
}

export function RecentActivity({ assignments, courses, profile, setActiveTab }: RecentActivityProps) {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {assignments && assignments.length > 0 ? (
          <div className="space-y-4">
            {assignments.slice(0, 3).map((assignment) => {
              // FIX: use assignment.courseId to find the course
              const course = courses.find((c) => c.id === assignment.courseId);
              if (!course) return null;

              const status = getCourseTimelineStatus(course.startDate, course.endDate);
              return (
                <div key={assignment.id} className="flex items-start gap-4">
                  <div
                    className={`w-2 h-2 mt-2 rounded-full ${
                      status === "upcoming"
                        ? "bg-blue-500"
                        : status === "ongoing"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{course.title}</h4>
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
                        {status === "upcoming"
                          ? "Upcoming"
                          : status === "ongoing"
                          ? "Ongoing"
                          : "Completed"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(course.startDate).toLocaleDateString()} -{" "}
                      {new Date(course.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="text-muted-foreground">Role:</span> {assignment.role}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No course assignments found.</p>
            <p className="text-sm text-muted-foreground mt-1">
              {profile.role === "Admin" || profile.role === "Trainer"
                ? "You can create a new course or assign users to existing courses."
                : "Contact an administrator or trainer to get assigned to courses."}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setActiveTab("courses")}>
          View all courses
        </Button>
      </CardFooter>
    </Card>
  );
}