"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getInitials } from "@/lib/utils"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

interface ProfileCardProps {
  profile: any
  router: AppRouterInstance
}

export function ProfileCard({ profile, router }: ProfileCardProps) {
  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Profile</CardTitle>
        <CardDescription>Your account information</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center text-center">
        <Avatar className="h-20 w-20 mb-4">
          {profile.profilePicture ? (
            <AvatarImage src={profile.profilePicture || "/placeholder.svg"} alt={profile.name} />
          ) : null}
          <AvatarFallback className="bg-primary/10 text-primary text-xl">{getInitials(profile.name)}</AvatarFallback>
        </Avatar>
        <h3 className="font-semibold text-lg">{profile.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{profile.email}</p>
        <Badge variant="outline" className="mb-4">
          {profile.role}
        </Badge>
        <Button variant="outline" size="sm" className="w-full" onClick={() => router.push("/me/update")}>
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  )
}
