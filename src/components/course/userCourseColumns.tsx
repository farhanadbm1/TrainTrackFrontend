// components/userCourseColumns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Calendar, MoreHorizontal } from "lucide-react"
import { CourseWithRole } from "@/lib/features/courseAssignmentSlice"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"

const formatDate = (value: string) => new Date(value).toLocaleDateString()

export const userCourseColumns = (): ColumnDef<CourseWithRole>[] => {
  const router = useRouter()
  const { authUser } = useSelector((state: RootState) => state.user)

  const viewCourseDetails = (courseId: number) => {
    const basePath=authUser?.role.toLowerCase()
    router.push(`/${basePath}/mycourses/details/${courseId}`)
  }

  const viewTaskDetails = (courseId: number) => {
    const basePath=authUser?.role.toLowerCase()
    router.push(`/${basePath}/mycourses/tasks/${courseId}`)
  }

  return [
    {
      accessorKey: "title",
      header: "Course Title",
    },
    {
      accessorKey: "roleInCourse",
      header: "Role",
      cell: ({ row }) => <Badge>{row.getValue("roleInCourse")}</Badge>,
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {formatDate(row.getValue("startDate"))}
        </div>
      ),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {formatDate(row.getValue("endDate"))}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return <Badge variant={status === "Active" ? "default" : "secondary"}>{status}</Badge>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const course = row.original
        return (
          <div className="flex justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => viewCourseDetails(course.id)}>
                  View details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => viewTaskDetails(course.id)}>
                  View Tasks
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
