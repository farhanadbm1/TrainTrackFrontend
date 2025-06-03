// components/userColumns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/lib/features/userSlice"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Props {
  onView: (user: User) => void
  onDelete: (user: User) => void
}

export const userColumns = ({ onView, onDelete }: Props): ColumnDef<User>[] => [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Name<ChevronDown className="ml-2 h-4 w-4" /></Button>
    ),
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profilePicture || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0).toUpperCase() || "?"}</AvatarFallback>
          </Avatar>
          <span>{user.name || "Unknown"}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Email<ChevronDown className="ml-2 h-4 w-4" /></Button>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Phone<ChevronDown className="ml-2 h-4 w-4" /></Button>
    ),
    cell: ({ row }) => row.original.phoneNumber || "-",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "isDeleted",
    header: "Status",
    cell: ({ row }) =>
      row.original.isDeleted ? (
        <Badge variant="destructive">Deleted</Badge>
      ) : (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          Active
        </Badge>
      ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onView(user)}>View Details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(user)}
                className={user.isDeleted ? "text-green-600" : "text-destructive"}
              >
                {user.isDeleted ? "Restore" : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
