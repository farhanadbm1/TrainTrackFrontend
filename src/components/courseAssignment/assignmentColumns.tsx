import { ColumnDef } from "@tanstack/react-table"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CourseAssignment } from "@/lib/features/courseAssignmentSlice"

export const assignmentColumns = (onUnassign?: (assignment: CourseAssignment) => void): ColumnDef<CourseAssignment>[] => [
  {
    accessorKey: "userId",
    header: "ID",
  },
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Name<ChevronDown className="ml-2 h-4 w-4" /></Button>
    ),
  },
  {
    accessorKey: "userEmail",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Email<ChevronDown className="ml-2 h-4 w-4" /></Button>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Role<ChevronDown className="ml-2 h-4 w-4" /></Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("role")}</div>,
  },
  {
    accessorKey: "assignedDate",
    header: "Assigned Date",
    cell: ({ row }) => <div>{new Date(row.getValue("assignedDate")).toLocaleDateString()}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const assignment = row.original
      return onUnassign ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onUnassign(assignment)} className="text-destructive">Unassign</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null
    },
  },
]
