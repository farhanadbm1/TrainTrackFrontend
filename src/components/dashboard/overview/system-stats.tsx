"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Users,
  UserCheck,
  UserX,
  BookOpen,
  BookCheck,
  Archive,
  Shield,
  GraduationCap,
  User2,
} from "lucide-react";

interface SystemStatsProps {
  systemStats: {
    totalUsers: number;
    activeUsers: number;
    deletedUsers: number;
    totalCourses: number;
    activeCourses: number;
    archivedCourses: number;
    adminUsers: number;
    trainerUsers: number;
    traineeUsers: number;
  };
  setActiveTab: (tab: string) => void;
}

export function SystemStats({ systemStats, setActiveTab }: SystemStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          System Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Statistics */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              User Statistics
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  Total Users
                </span>
                <span className="font-medium">{systemStats.totalUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <UserCheck className="h-4 w-4" />
                  Active Users
                </span>
                <span className="font-medium">{systemStats.activeUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <UserX className="h-4 w-4" />
                  Deleted Users
                </span>
                <span className="font-medium">{systemStats.deletedUsers}</span>
              </div>
            </div>
          </div>

          {/* Course Statistics */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              Course Statistics
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  Total Courses
                </span>
                <span className="font-medium">{systemStats.totalCourses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <BookCheck className="h-4 w-4" />
                  Active Courses
                </span>
                <span className="font-medium">{systemStats.activeCourses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Archive className="h-4 w-4" />
                  Archived Courses
                </span>
                <span className="font-medium">{systemStats.archivedCourses}</span>
              </div>
            </div>
          </div>

          {/* Role Statistics */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              Role Statistics
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  Admins
                </span>
                <span className="font-medium">{systemStats.adminUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <User2 className="h-4 w-4" />
                  Trainers
                </span>
                <span className="font-medium">{systemStats.trainerUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  Trainees
                </span>
                <span className="font-medium">{systemStats.traineeUsers}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-end gap-4">
        <Button variant="outline" size="sm" onClick={() => setActiveTab("users")}>
          View All Users
        </Button>
        <Button variant="outline" size="sm" onClick={() => setActiveTab("allCourses")}>
          View All Courses
        </Button>
      </CardFooter>
    </Card>
  );
}
