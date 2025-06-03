"use client"

import * as React from "react"
import { useMemo, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/lib/store"
import { useRouter } from "next/navigation"
import { Calendar, Clock } from "lucide-react"
import { toggleCourseStatus, type Course } from "@/lib/features/courseSlice"
import { toast } from "sonner"
import { ReusableDataTable } from "@/components/ReusableDataTable"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { courseColumns, getCourseTimelineStatus } from "./courseColumns"

interface Props {
  courses: Course[]
  showArchived: boolean
}

type Timeline = "all" | "upcoming" | "ongoing" | "completed"

const CourseTable = ({ courses, showArchived }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { token } = useSelector((state: RootState) => state.user)

  const [timeline, setTimeline] = useState<Timeline>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const filteredCourses = useMemo(() => {
    const activeCourses = courses.filter(course => course.status === (showArchived ? "Archived" : "Active"))
    if (timeline === "all") return activeCourses
    return activeCourses.filter(course => getCourseTimelineStatus(course) === timeline)
  }, [courses, showArchived, timeline])

  const handleDelete = () => {
    if (selectedCourse && token) {
      dispatch(toggleCourseStatus(selectedCourse.id))
      toast.success(`Course deleted: ${selectedCourse.title}`)
      setDialogOpen(false)
    }
  }

  const timelineCounts = useMemo(() => {
    const result = { upcoming: 0, ongoing: 0, completed: 0, total: 0 }
    const filtered = courses.filter(course => course.status === (showArchived ? "Archived" : "Active"))
    filtered.forEach(course => {
      const status = getCourseTimelineStatus(course)
      result[status]++
      result.total++
    })
    return result
  }, [courses, showArchived])

  const viewCourseDetails = (course: Course) => {
    router.push(`/admin/course/details/${course.id}`)
  }

  const openDeleteDialog = (course: Course) => {
    setSelectedCourse(course)
    setDialogOpen(true)
  }

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
        columns={courseColumns(viewCourseDetails, showArchived ? undefined : openDeleteDialog)}
        data={filteredCourses}
        searchKey="title"
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedCourse?.title}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CourseTable
