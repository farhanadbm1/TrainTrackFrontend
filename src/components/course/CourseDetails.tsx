"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  FileText,
  Pencil,
  User,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import CourseForm from "@/components/course/CourseForm";

interface CourseDetailsProps {
  courseDetails: {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    durationDays: number;
    status: string;
    createdByUserName: string;
  };
  loading: boolean;
  error: string | null;
  onEditSubmit?:
    | ((formData: {
        title: string;
        description: string;
        startDate: string;
        endDate: string;
      }) => void)
    | null;
  canEdit?: boolean; // ✅ New optional prop
}

const CourseDetails = ({
  courseDetails,
  loading,
  error,
  onEditSubmit,
  canEdit = false,
}: CourseDetailsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const currentDate = new Date();
  const startDate = new Date(courseDetails.startDate);
  const endDate = new Date(courseDetails.endDate);

  let timelineStatus = "upcoming";
  if (currentDate >= startDate && currentDate <= endDate) {
    timelineStatus = "ongoing";
  } else if (currentDate > endDate) {
    timelineStatus = "completed";
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {courseDetails.title}
          </h1>
          <p className="text-muted-foreground mt-1">
            Course ID: {courseDetails.id} • Created by{" "}
            {courseDetails.createdByUserName}
          </p>
        </div>

        {canEdit && onEditSubmit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Pencil className="w-4 h-4 mr-2" />
                Edit Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Edit Course</DialogTitle>
              </DialogHeader>
              <CourseForm
                formType="edit"
                initialData={{
                  title: courseDetails.title,
                  description: courseDetails.description,
                  startDate: courseDetails.startDate,
                  endDate: courseDetails.endDate,
                }}
                loading={loading}
                error={error}
                onSubmit={onEditSubmit}
                onSuccess={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Course Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Description
              </h3>
              <p className="text-base">
                {courseDetails.description || "No description provided."}
              </p>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Start Date:</span>{" "}
                    {new Date(courseDetails.startDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">End Date:</span>{" "}
                    {new Date(courseDetails.endDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Duration:</span>{" "}
                    {courseDetails.durationDays} days
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Course Status:</span>{" "}
                    <Badge
                      variant={
                        courseDetails.status === "Active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {courseDetails.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Timeline:</span>{" "}
                    <Badge
                      variant="outline"
                      className={
                        timelineStatus === "upcoming"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : timelineStatus === "ongoing"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    >
                      {timelineStatus === "upcoming"
                        ? "Upcoming"
                        : timelineStatus === "ongoing"
                        ? "Ongoing"
                        : "Completed"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Course Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  Created By
                </span>
                <span className="text-lg font-medium">
                  {courseDetails.createdByUserName}
                </span>
              </div>

              <Separator />

              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  Created On
                </span>
                <span className="text-lg font-medium">
                  {new Date(courseDetails.startDate).toLocaleDateString()}
                </span>
              </div>

              <Separator />

              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  className="w-fit mt-1"
                  variant={
                    courseDetails.status === "Active" ? "default" : "secondary"
                  }
                >
                  {courseDetails.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CourseDetails;
