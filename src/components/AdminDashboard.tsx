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
import { OverviewTab } from "@/components/dashboard/tabs/overview-tab"
import { CoursesTab } from "@/components/dashboard/tabs/courses-tab"
import { AllCoursesTab } from "@/components/dashboard/tabs/all-courses-tab"
import { UsersTab } from "@/components/dashboard/tabs/users-tab"
import { getCourseTimelineStatus } from "@/lib/utils"
import { fetchCoursesByUserId } from "@/lib/features/courseAssignmentSlice"

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const {
    authUser,
    profile,
    users,
    loading: userLoading,
    error: userError,
  } = useSelector((state: RootState) => state.user)
  const { courses, loading: coursesLoading, error: coursesError } = useSelector((state: RootState) => state.course)
  const {
    userCourses,
    loading: assignmentsLoading,
    error: assignmentsError,
  } = useSelector((state: RootState) => state.courseAssignment)

  const [activeTab, setActiveTab] = useState("overview")
  const [courseSearch, setCourseSearch] = useState("")
  const [userSearch, setUserSearch] = useState("")

  useEffect(() => {
    if (authUser) {
      dispatch(fetchUserById({ id: Number(authUser.id) }))
      dispatch(fetchCourses())
      dispatch(fetchCoursesByUserId(Number(authUser.id)))
      dispatch(fetchUsers())
      
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

  

  // System-wide statistics
  const systemStats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => !u.isDeleted).length,
    deletedUsers: users.filter((u) => u.isDeleted).length,
    totalCourses: courses.length,
    activeCourses: courses.filter((c) => c.status === "Active").length,
    archivedCourses: courses.filter((c) => c.status === "Archived").length,
    adminUsers: users.filter((u) => u.role === "Admin").length,
    trainerUsers: users.filter((u) => u.role === "Trainer").length,
    traineeUsers: users.filter((u) => u.role === "Trainee").length,
  }

  // Filter courses based on search
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
      course.description.toLowerCase().includes(courseSearch.toLowerCase()),
  )

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.username.toLowerCase().includes(userSearch.toLowerCase()),
  )

  // Loading state
  const isLoading = userLoading || coursesLoading || assignmentsLoading

  // Error state
  const hasError = userError || coursesError || assignmentsError
  const errorMessage = userError || coursesError || assignmentsError

  

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

  if (hasError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
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
        <DashboardHeader profile={profile} router={router} />

        {/* Dashboard content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* User profile card */}
          <ProfileCard profile={profile} router={router} />

          {/* Stats cards */}
          <StatisticsCards stats={stats} />
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-[600px] mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="allCourses">All Courses</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <OverviewTab
              profile={profile}
              systemStats={systemStats}
              setActiveTab={setActiveTab}
              router={router} assignments={[]} courses={[]}            />
          </TabsContent>

          {/* Courses Tab - Implementation would be provided in CoursesTab component */}
          <TabsContent value="courses">
            <CoursesTab userCourses={userCourses} router={router} authUser={authUser} />
          </TabsContent>

          {/* All Courses Tab (Admin/Trainer only) */}
           
            <TabsContent value="allCourses">
              <AllCoursesTab
                courses={filteredCourses}
                courseSearch={courseSearch}
                setCourseSearch={setCourseSearch}
                router={router}
              />
            </TabsContent>
          

          {/* Users Tab (Admin/Trainer only) */}
          
            <TabsContent value="users">
              <UsersTab users={filteredUsers} userSearch={userSearch} setUserSearch={setUserSearch} router={router} />
            </TabsContent>
          
        </Tabs>
      </div>
    </div>
  )
}

export default AdminDashboard
