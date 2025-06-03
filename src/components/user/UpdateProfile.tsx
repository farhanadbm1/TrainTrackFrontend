"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { fetchUserById, resetStatus, updateUser } from "@/lib/features/userSlice"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, User, Mail, Phone, Camera, ArrowLeft } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/lib/store"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import ChangePasswordDialog from "./ChangePasswordForm"

const CLOUD_NAME = "dou4dg3ha"
const UPLOAD_PRESET = "ml_default"

const UpdateProfileForm = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { profile, token, loading, error, success, authUser } = useSelector((state: RootState) => state.user)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    profilePicture: "",
  })

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (authUser && token) {
      dispatch(fetchUserById({ id: Number(authUser.id) }))
    }
  }, [authUser, token, dispatch])

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        profilePicture: profile.profilePicture || "",
      })
    }
  }, [profile])

  useEffect(() => {
    if (success) {
      toast.success("Profile updated successfully!")
      dispatch(resetStatus())
    } else if (error) {
      toast.error(error)
      dispatch(resetStatus())
    }
  }, [success, error, dispatch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = async (file: File): Promise<string | null> => {
    const data = new FormData()
    data.append("file", file)
    data.append("upload_preset", UPLOAD_PRESET)

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data,
      })

      const result = await res.json()
      return result.secure_url
    } catch (err) {
      toast.error("Image upload failed")
      return null
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const localUrl = URL.createObjectURL(file)
      setPreviewUrl(localUrl)

      setUploading(true)
      const imageUrl = await handleImageUpload(file)
      setUploading(false)

      if (imageUrl) {
        setFormData({
          ...formData,
          profilePicture: imageUrl,
        })

        URL.revokeObjectURL(localUrl)
        setPreviewUrl(null)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !profile) return

    await dispatch(
      updateUser({
        id: Number(profile.id),
        form: formData,
      }),
    )
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (!profile || !authUser || !token) {
    return (
      <div className="flex justify-center items-center mt-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <Button variant="ghost" onClick={() => router.push("/me")} className="mb-6 -ml-2 flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Profile
      </Button>

      <Card className="shadow-md">
        <CardHeader>
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <Avatar className="w-28 h-28 border-4 border-primary/10">
                {previewUrl ? (
                  <AvatarImage src={previewUrl || "/placeholder.svg"} alt="Preview" />
                ) : formData.profilePicture ? (
                  <AvatarImage src={formData.profilePicture || "/placeholder.svg"} alt={formData.name} />
                ) : null}
                <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                  {getInitials(formData.name)}
                </AvatarFallback>

                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  id="profilePictureUpload"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="profilePictureUpload"
                  className="absolute bottom-0 right-0 bg-primary text-white rounded-full shadow-md p-2 cursor-pointer flex items-center justify-center hover:bg-primary/90 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </label>
              </Avatar>
            </div>

            <CardTitle className="text-xl font-semibold">Edit Profile</CardTitle>
            <CardDescription className="text-center mt-1">
              Update your personal information and profile picture
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="123456789"
                  className="w-full"
                />
              </div>
            </div>

            {/* <Separator className="my-6" /> */}

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => router.push("/me")}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || uploading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>

          <Separator className="my-6" />

          <div className="flex justify-center">
            <ChangePasswordDialog />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UpdateProfileForm
