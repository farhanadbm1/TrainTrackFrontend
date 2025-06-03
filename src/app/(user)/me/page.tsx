'use client'

import NavigationPanel from "@/components/NavigationPanel"
import UserProfile from "@/components/user/UserProfile"
import ProtectedRoute from "@/components/ProtectedRoute"
import React from "react"

const ProfilePage = () => {
  return (
        <main>
          <UserProfile />
        </main>
  )
}

export default ProfilePage
