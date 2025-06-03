"use client"

import { useState, type FormEvent } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, UserPlus, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface AssignCourseFormProps {
  courseId: number
  users: { id: number; name: string; email: string }[]
  loading: boolean
  error: string | null
  onSubmit: (form: { userId: number; role: string }) => void
  onSuccess: () => void
}

const AssignCourseForm = ({ courseId, users, loading, error, onSubmit, onSuccess }: AssignCourseFormProps) => {
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>("Trainee")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!selectedUser) errors.user = "User is required."
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChangeUser = (value: string) => {
    setSelectedUser(Number(value))

    // Clear error when user selects a value
    if (formErrors.user) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.user
        return newErrors
      })
    }
  }

  const handleChangeRole = (value: string) => {
    setSelectedRole(value)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    onSubmit({ userId: selectedUser!, role: selectedRole })
    onSuccess()
  }

  // Get selected user details for display
  const selectedUserDetails = selectedUser ? users.find((u) => u.id === selectedUser) : null

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="user" className="text-base">
            Select User
          </Label>
          <div className="relative mt-1.5">
            <Select onValueChange={handleChangeUser} value={selectedUser?.toString()}>
              <SelectTrigger className={cn("w-full", formErrors.user && "border-red-500")}>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select a user" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <div className="max-h-[200px] overflow-y-auto">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        <div className="flex flex-col">
                          <span>{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-center text-sm text-muted-foreground">No users available</div>
                  )}
                </div>
              </SelectContent>
            </Select>
          </div>
          {formErrors.user && <p className="text-sm text-red-500 mt-1.5">{formErrors.user}</p>}
        </div>

        {selectedUserDetails && (
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium">{selectedUserDetails.name}</p>
            <p className="text-xs text-muted-foreground">{selectedUserDetails.email}</p>
          </div>
        )}

        <div>
          <Label htmlFor="role" className="text-base">
            Assign Role
          </Label>
          <div className="relative mt-1.5">
            <Select value={selectedRole} onValueChange={handleChangeRole}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select a role" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Trainer">
                  <div className="flex flex-col">
                    <span>Trainer</span>
                    <span className="text-xs text-muted-foreground">Can manage course content and trainees</span>
                  </div>
                </SelectItem>
                <SelectItem value="Trainee">
                  <div className="flex flex-col">
                    <span>Trainee</span>
                    <span className="text-xs text-muted-foreground">Can access course content</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Assigning...
            </>
          ) : (
            "Assign User"
          )}
        </Button>
      </div>
    </form>
  )
}

export default AssignCourseForm
