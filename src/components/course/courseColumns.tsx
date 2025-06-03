import { ColumnDef } from "@tanstack/react-table"
import { Course } from "@/lib/features/courseSlice"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, Calendar, MoreHorizontal } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export const getCourseTimelineStatus = (course: Course, currentDate = new Date()) => {
  const start = new Date(course.startDate)
  const end = new Date(course.endDate)
  if (start > currentDate) return "upcoming"
  if (end < currentDate) return "completed"
  return "ongoing"
}

export const getTimelineBadge = (status: string) => {
  switch (status) {
    case "upcoming":
      return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Upcoming</Badge>
    case "ongoing":
      return <Badge className="bg-green-50 text-green-700 border-green-200">Ongoing</Badge>
    case "completed":
      return <Badge className="bg-gray-50 text-gray-700 border-gray-200">Completed</Badge>
    default:
      return null
  }
}

export const formatDate = (value: string) => new Date(value).toLocaleDateString()

export const courseColumns = (onView?: (course: Course) => void, onDelete?: (course: Course) => void): ColumnDef<Course>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Title<ChevronDown className="ml-2 h-4 w-4" /></Button>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="max-w-[200px] truncate">{row.getValue("description")}</div>
          </TooltipTrigger>
          <TooltipContent className="max-w-md">
            <p>{row.getValue("description")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    id: "timelineStatus",
    header: "Timeline",
    cell: ({ row }) => getTimelineBadge(getCourseTimelineStatus(row.original)),
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => <div className="flex items-center gap-2"><Calendar className="h-4 w-4" />{formatDate(row.getValue("startDate"))}</div>,
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => <div className="flex items-center gap-2"><Calendar className="h-4 w-4" />{formatDate(row.getValue("endDate"))}</div>,
  },
  {
    accessorKey: "durationDays",
    header: "Duration",
    cell: ({ row }) => <div>{row.getValue("durationDays")} days</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return <Badge variant={status === "Active" ? "default" : "secondary"}>{status}</Badge>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const course = row.original
      return onView || onDelete ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {onView && <DropdownMenuItem onClick={() => onView(course)}>View details</DropdownMenuItem>}
            {onDelete && <><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive" onClick={() => onDelete(course)}>Delete</DropdownMenuItem></>}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null
    },
  },
]
