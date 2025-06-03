import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// Get initials for avatar fallback
export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

// Determine course timeline status
export function getCourseTimelineStatus(startDate: string, endDate: string) {
  const currentDate = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (currentDate < start) return "upcoming"
  if (currentDate > end) return "completed"
  return "ongoing"
}
