"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/lib/store"
import { fetchUserById, fetchUsers } from "@/lib/features/userSlice"
import { fetchCourses } from "@/lib/features/courseSlice"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProfileCard } from "@/components/dashboard/profile-card"
import { StatisticsCards } from "@/components/dashboard/statistics-cards"
import { CoursesTab } from "@/components/dashboard/tabs/courses-tab"
import { getCourseTimelineStatus } from "@/lib/utils"
import { fetchCoursesByUserId } from "@/lib/features/courseAssignmentSlice"

const TrainerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const {
    authUser,
    profile,
    loading: userLoading,
    error: userError,
  } = useSelector((state: RootState) => state.user)
  const {
    userCourses,
    loading: assignmentsLoading,
    error: assignmentsError,
  } = useSelector((state: RootState) => state.courseAssignment)

  const [activeTab, setActiveTab] = useState("courses")

  useEffect(() => {
    if (authUser) {
      dispatch(fetchUserById({ id: Number(authUser.id) }))
      dispatch(fetchCoursesByUserId(Number(authUser.id)))
    }
  }, [authUser, dispatch])

  // Calculate statistics
  const stats = {
    totalCourses: userCourses?.length || 0,
    upcomingCourses:
      userCourses?.filter((a) => {
        const course = userCourses.find((c) => c.id === a.id)
        return course && getCourseTimelineStatus(course.startDate, course.endDate) === "upcoming"
      }).length || 0,
    ongoingCourses:
      userCourses?.filter((a) => {
        const course = userCourses.find((c) => c.id === a.id)
        return course && getCourseTimelineStatus(course.startDate, course.endDate) === "ongoing"
      }).length || 0,
    completedCourses:
      userCourses?.filter((a) => {
        const course = userCourses.find((c) => c.id === a.id)
        return course && getCourseTimelineStatus(course.startDate, course.endDate) === "completed"
      }).length || 0,
  }

  

  

  // Loading state
  const isLoading = userLoading || assignmentsLoading



  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="h-[180px] w-full md:w-1/3 rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
              <Skeleton className="h-[120px] rounded-lg" />
              <Skeleton className="h-[120px] rounded-lg" />
              <Skeleton className="h-[120px] rounded-lg" />
            </div>
          </div>
          <Skeleton className="h-[400px] rounded-lg" />
        </div>
      </div>
    )
  }



  if (!profile) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert>
          <AlertDescription>No profile found. Please try again later.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-8">
        {/* Header with welcome message */}
        <DashboardHeader profile={profile}  router={router} />

        {/* Dashboard content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* User profile card */}
          <ProfileCard profile={profile} router={router} />

          {/* Stats cards */}
          <StatisticsCards stats={stats} />
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="courses" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-[600px] mb-4">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
          </TabsList>


          {/* Courses Tab - Implementation would be provided in CoursesTab component */}
          <TabsContent value="courses">
            <CoursesTab userCourses={userCourses} router={router} authUser={authUser}/>
          </TabsContent>
          
        </Tabs>
      </div>
    </div>
  )
}

export default TrainerDashboard
