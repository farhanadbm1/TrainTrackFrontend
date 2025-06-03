"use client"

import { useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/store"
import { toggleUserDeleted, User } from "@/lib/features/userSlice"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, UserIcon, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { userColumns } from "./userColumns"
import { ReusableDataTable } from "@/components/ReusableDataTable"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
  users: User[]
}

const UserTable = ({ users }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const { token } = useSelector((state: RootState) => state.user)

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [dialogType, setDialogType] = useState<"view" | "delete" | null>(null)
  const [showDeleted, setShowDeleted] = useState(false)
  const [roleFilter, setRoleFilter] = useState("all")

  // Only show deleted users if showDeleted is true, otherwise only active
  const filteredUsers = useMemo(() => {
    const baseList = showDeleted ? users.filter((u) => u.isDeleted) : users.filter((u) => !u.isDeleted)
    if (roleFilter === "all") return baseList
    return baseList.filter((u) => u.role === roleFilter)
  }, [users, showDeleted, roleFilter])

  const uniqueRoles = useMemo(() => {
    return Array.from(new Set(users.map((u) => u.role))).sort()
  }, [users])

  const userCounts = useMemo(() => ({
    total: users.length,
    active: users.filter((u) => !u.isDeleted).length,
    deleted: users.filter((u) => u.isDeleted).length,
  }), [users])

  const openDialog = (user: User, type: "view" | "delete") => {
    setSelectedUser(user)
    setDialogType(type)
  }

  const closeDialog = () => {
    setSelectedUser(null)
    setDialogType(null)
  }

  const confirmDeleteOrRestore = () => {
    if (selectedUser && token) {
      const willBeDeleted = !selectedUser.isDeleted
      dispatch(toggleUserDeleted({ id: selectedUser.id }))
      toast.success(
        `User ${willBeDeleted ? "deleted" : "restored"} successfully`,
        {
          description: `${selectedUser.name} has been ${
            willBeDeleted ? "removed from" : "re-added to"
          } the system.`,
        }
      )
      closeDialog()
    }
  }

  return (
    <div className="space-y-4">
      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`p-4 rounded-lg border ${
            !showDeleted ? "bg-gray-50 border-green-300" : "bg-white"
          } cursor-pointer`}
          onClick={() => setShowDeleted(false)}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-green-600">Active Users</h3>
              <p className="text-2xl font-bold text-green-700">{userCounts.active}</p>
            </div>
            <UserIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border ${
            showDeleted ? "bg-red-50 border-red-300" : "bg-white"
          } cursor-pointer`}
          onClick={() => setShowDeleted(true)}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-red-600">Deleted Users</h3>
              <p className="text-2xl font-bold text-red-700">{userCounts.deleted}</p>
            </div>
            <UserIcon className="h-8 w-8 text-red-400" />
          </div>
        </div>

        <div className="p-4 rounded-lg border bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
              <p className="text-2xl font-bold text-gray-700">{userCounts.total}</p>
            </div>
            <UserIcon className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* ✅ Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-2">
        <Select onValueChange={(value) => setRoleFilter(value)} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {uniqueRoles.map((role) => (
              <SelectItem key={role} value={role} className="capitalize">
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ✅ Table */}
      <ReusableDataTable
        columns={userColumns({
          onView: (user) => openDialog(user, "view"),
          onDelete: (user) => openDialog(user, "delete"),
        })}
        data={filteredUsers}
        searchKey="name"
        emptyMessage={
          showDeleted ? "No deleted users found." : "No users found."
        }
      />

      {/* ✅ Dialog */}
      <Dialog open={!!dialogType} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === "view" && "User Details"}
              {dialogType === "delete" &&
                (selectedUser?.isDeleted ? "Restore User" : "Delete User")}
            </DialogTitle>
            <DialogDescription>
              {dialogType === "view" && "View user information"}
              {dialogType === "delete" &&
                (selectedUser?.isDeleted
                  ? `Are you sure you want to restore ${selectedUser?.name}?`
                  : `Are you sure you want to delete ${selectedUser?.name}?`)}
            </DialogDescription>
          </DialogHeader>

          {dialogType === "view" && selectedUser && (
            <div>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedUser.profilePicture || "/placeholder.svg"}
                    alt={selectedUser.name}
                  />
                  <AvatarFallback className="text-xl">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.role}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p><strong>ID:</strong> {selectedUser.id}</p>
                <p><strong>Username:</strong> {selectedUser.username}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Phone:</strong> {selectedUser.phoneNumber || "-"}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedUser.isDeleted ? (
                    <Badge variant="destructive">Deleted</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                  )}
                </p>
              </div>
            </div>
          )}

          {dialogType === "delete" && (
            <DialogFooter>
              <Button variant="ghost" onClick={closeDialog}>Cancel</Button>
              <Button
                variant={selectedUser?.isDeleted ? "default" : "destructive"}
                onClick={confirmDeleteOrRestore}
              >
                {selectedUser?.isDeleted ? "Confirm Restore" : "Confirm Delete"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UserTable