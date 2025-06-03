import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

interface RoleDistributionProps {
  roleStats: {
    asTrainer: number
    asTrainee: number
  }
}

export function RoleDistribution({ roleStats }: RoleDistributionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5" />
          Role Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>As Trainer</span>
            </div>
            <Badge variant="outline">{roleStats.asTrainer}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>As Trainee</span>
            </div>
            <Badge variant="outline">{roleStats.asTrainee}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
