"use client"

import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/lib/store"
import { registerCourse, resetStatus } from "@/lib/features/courseSlice"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"
import CourseForm from "@/components/course/CourseForm"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const RegisterCourse = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const { loading, error, success } = useSelector((state: RootState) => state.course)

  const handleSubmit = (formData: any) => {
    dispatch(registerCourse(formData))
  }

  useEffect(() => {
    if (success) {
      toast.success("Course registered successfully!")
      dispatch(resetStatus())
      router.push("/admin/course")
    }
    if (error) {
      toast.error(`Course registration failed: ${error}`)
    }
  }, [success, error, dispatch, router])

  return (
    <main className="container mx-auto pb-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Register New Course</h1>
      <CourseForm
        formType="create"
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
        onSuccess={() => router.push("/admin/course")}
      />
    </main>
  )
}

export default RegisterCourse
