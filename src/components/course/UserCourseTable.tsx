// components/UserCourseTable.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Calendar, Clock } from "lucide-react"
import { ReusableDataTable } from "@/components/ReusableDataTable"
import type { RootState, AppDispatch } from "@/lib/store"
import { CourseWithRole, fetchCoursesByUserId } from "@/lib/features/courseAssignmentSlice"
import { userCourseColumns } from "./userCourseColumns"

type Timeline = "all" | "upcoming" | "ongoing" | "completed"

const getCourseTimelineStatus = (course: CourseWithRole, currentDate = new Date()) => {
  const start = new Date(course.startDate)
  const end = new Date(course.endDate)
  if (start > currentDate) return "upcoming"
  if (end < currentDate) return "completed"
  return "ongoing"
}

const UserCourseTable = () => {
  const { userCourses, loading, error } = useSelector((state: RootState) => state.courseAssignment)

  const [timeline, setTimeline] = useState<Timeline>("all")


  const filteredCourses = useMemo(() => {
    if (timeline === "all") return userCourses
    return userCourses.filter(course => getCourseTimelineStatus(course) === timeline)
  }, [userCourses, timeline])

  const timelineCounts = useMemo(() => {
    const result = { upcoming: 0, ongoing: 0, completed: 0, total: 0 }
    userCourses.forEach(course => {
      const status = getCourseTimelineStatus(course)
      result[status]++
      result.total++
    })
    return result
  }, [userCourses])

  return (
    <div className="space-y-4">
      {/* Timeline Filter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(["all", "upcoming", "ongoing", "completed"] as Timeline[]).map(key => (
          <div
            key={key}
            onClick={() => setTimeline(key)}
            className={`p-4 rounded-lg border cursor-pointer hover:bg-gray-50 ${
              timeline === key ? "bg-gray-50 border-gray-300" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground capitalize">{key} Courses</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {key === "all" ? timelineCounts.total : timelineCounts[key]}
                </p>
              </div>
              <div>
                {key === "upcoming" && <Clock className="h-8 w-8 text-blue-400" />}
                {key === "ongoing" && <Calendar className="h-8 w-8 text-green-400" />}
                {key === "completed" && <Calendar className="h-8 w-8 text-gray-400" />}
                {key === "all" && <Calendar className="h-8 w-8 text-gray-400" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reusable Data Table */}
      <ReusableDataTable
        columns={userCourseColumns()}
        data={filteredCourses}
        searchKey="title"
        emptyMessage={loading ? "Loading assigned courses..." : "No assigned courses found."}
      />
    </div>
  )
}

export default UserCourseTable
