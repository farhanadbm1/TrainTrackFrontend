"use client"

import { QuickActions } from "../overview/quick-actions"
import { RecentActivity } from "../overview/recent-activity"
import { SystemStats } from "../overview/system-stats"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

interface OverviewTabProps {
  profile: any
  systemStats: any
  setActiveTab: (tab: string) => void
  router: AppRouterInstance
  assignments: any[]
  courses: any[]
}

export function OverviewTab({
  systemStats,
  profile,
  setActiveTab,
  router,
  assignments,
  courses,
}: OverviewTabProps) {
  // Check if user is admin or trainer
  const isAdmin = profile?.role === "Admin"
  return (
    <>
      {/* System statistics (for admin/trainer) */}
      <SystemStats systemStats={systemStats} setActiveTab={setActiveTab} />
      {/* <RecentActivity
        profile={profile}
        setActiveTab={setActiveTab}
        assignments={assignments}
        courses={courses}
      /> */}

      {/* Quick actions */}
      <QuickActions isAdminOrTrainer={isAdmin} router={router} />
    </>
  )
}