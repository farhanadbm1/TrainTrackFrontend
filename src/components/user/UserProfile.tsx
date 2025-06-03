"use client"

import { fetchUserById } from "@/lib/features/userSlice"
import type { AppDispatch, RootState } from "@/lib/store"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Pencil, Mail, Phone, AtSign, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

const UserProfile = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const { authUser, profile, token, loading, error } = useSelector((state: RootState) => state.user)

  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    if (authUser && token) {
      dispatch(fetchUserById({ id: Number(authUser.id) }))
      const timeout = setTimeout(() => {
        setShowProfile(true)
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [authUser, token, dispatch])


  if (loading || !showProfile) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-1/2 mb-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center">
              <Skeleton className="w-24 h-24 rounded-full mb-4" />
              <Skeleton className="h-6 w-1/3 mb-1" />
              <Skeleton className="h-4 w-1/4 mb-4" />
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-4 flex-1" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-4 flex-1" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-4 flex-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <Alert>
          <AlertDescription>No profile found. Please try again later.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <Card className="max-w-md mx-auto shadow-md">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle>Profile</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/me/update")}
          className="flex items-center gap-1"
        >
          <Pencil className="w-4 h-4" />
          Edit Profile
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center">
          <Avatar className="w-24 h-24 border-4 border-primary/10">
            {profile.profilePicture ? (
              <AvatarImage src={profile.profilePicture || "/placeholder.svg"} alt={profile.name} />
            ) : null}
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold mt-3">{profile.name}</h2>
          <div className="flex items-center gap-1 text-muted-foreground">
            <AtSign className="w-3 h-3" />
            <span className="text-sm">{profile.username}</span>
          </div>
          <Badge variant="outline" className="mt-2">
            {profile.role}
          </Badge>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm">{profile.phoneNumber || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Role & Permissions</p>
              <p className="text-sm">{profile.role}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {profile.role === "Admin"
                  ? "Full access to all features and settings"
                  : profile.role === "Trainer"
                    ? "Can manage courses and trainees"
                    : "Can access assigned courses and materials"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default UserProfile
