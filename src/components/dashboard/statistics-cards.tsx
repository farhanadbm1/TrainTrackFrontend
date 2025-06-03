import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Clock, Calendar, GraduationCap } from "lucide-react"

interface StatisticsCardsProps {
  stats: {
    totalCourses: number
    upcomingCourses: number
    ongoingCourses: number
    completedCourses: number
  }
}

export function StatisticsCards({ stats }: StatisticsCardsProps) {
  return (
    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className=" border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">Upcoming Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-3xl font-bold text-blue-700">{stats.upcomingCourses}</div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <p className="text-xs text-blue-600">Courses that haven't started yet</p>
        </CardFooter>
      </Card>

      <Card className=" border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-700">Ongoing Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-3xl font-bold text-green-700">{stats.ongoingCourses}</div>
            <Calendar className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <p className="text-xs text-green-600">Courses currently in progress</p>
        </CardFooter>
      </Card>

      <Card className=" border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Completed Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-3xl font-bold text-gray-700">{stats.completedCourses}</div>
            <GraduationCap className="h-8 w-8 text-gray-500" />
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <p className="text-xs text-gray-600">Courses you've completed</p>
        </CardFooter>
      </Card>
    </div>
  )
}
