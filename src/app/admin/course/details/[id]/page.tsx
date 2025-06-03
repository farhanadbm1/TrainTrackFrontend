"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCourseById, updateCourse, resetStatus } from "@/lib/features/courseSlice"
import type { AppDispatch, RootState } from "@/lib/store"
import { useParams } from "next/navigation"
import { Loader2, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import CourseAssignmentTable from "@/components/courseAssignment/CourseAssignmentTable"
import CourseDetails from "@/components/course/CourseDetails"
import { clearAssignments, fetchAssignmentsByCourse, resetAssignmentStatus } from "@/lib/features/courseAssignmentSlice"

const CourseDetailsPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { courseDetails, loading, error, success } = useSelector((state: RootState) => state.course)

  useEffect(() => {
    if (id) {
      dispatch(fetchCourseById(Number(id)))
    }
  }, [id, dispatch])

  useEffect(() => {
    if (success) {
      toast.success("Course updated successfully!")
      dispatch(fetchCourseById(Number(id)))
      dispatch(resetStatus())
    }
  }, [success, id, dispatch])

    useEffect(() => {
    dispatch(clearAssignments())
    dispatch(fetchAssignmentsByCourse({ courseId: Number(id) }))
  
    return () => {
      dispatch(resetAssignmentStatus())
    }
  }, [dispatch, id])
  

  const handleEditSubmit = (formData: {
    title: string
    description: string
    startDate: string
    endDate: string
  }) => {
    if (id) {
      dispatch(updateCourse({ id: Number(id), form: formData }))
    }
  }

  if (loading && !courseDetails) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
      </div>
    )
  }

  if (error && !courseDetails) {
    return <div className="text-red-500 text-center mt-8">{error}</div>
  }

  if (!courseDetails) {
    return <div className="text-center mt-8">No course found.</div>
  }

  return (
    <main className="container mx-auto py-6 px-4 max-w-6xl">
      <CourseDetails courseDetails={courseDetails} loading={loading} error={error} onEditSubmit={handleEditSubmit} canEdit={true} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Assigned Users
          </CardTitle>
          <CardDescription>Users who have been assigned to this course</CardDescription>
        </CardHeader>
        <CardContent>
          <CourseAssignmentTable courseId={courseDetails.id} showActions />
        </CardContent>
      </Card>
    </main>
  )
}

export default CourseDetailsPage
