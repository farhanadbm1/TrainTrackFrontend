import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, parseISO } from "date-fns";
import { TaskAssignment } from "@/lib/features/taskAssignmentSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  Book,
  AlertCircle,
  Users,
  CalendarClock,
  FileText,
  FileCheck,
  FileWarning,
  Link,
  Clock,
  RefreshCw,
  GraduationCap,
} from "lucide-react";

interface Props {
  task: TaskAssignment | undefined;
  loading?: boolean;
}

const TaskAssignmentDetailCard: React.FC<Props> = ({ task, loading }) => {
  const allCourses = useSelector((state: RootState) => state.course.courses);
  const course = allCourses.find((c) => c.id === task?.courseId);
  const submissions = useSelector((state: RootState) => state.taskSubmission.submissions);
  const submissionCount = task
    ? submissions.filter((s) => s.taskId === task.id && !s.isDeleted).length
    : 0;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Task Details...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-gray-200 rounded w-2/5" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!task) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Task Selected</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a task from the list to view its details.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2 text-lg font-semibold">
          <Book className="w-5 h-5" />
          {task.title}
          {!task.isAvailable && <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Unavailable</Badge>}
          {task.isDeleted && <Badge variant="outline"><FileWarning className="w-3 h-3 mr-1" /> Deleted</Badge>}
        </CardTitle>

        <div className="flex flex-wrap gap-2 mt-2">
          {task.dueDate && (
            <Badge variant="secondary">
              <CalendarClock className="w-3 h-3 mr-1" />
              Due: {formatDistanceToNow(parseISO(task.dueDate), { addSuffix: true })}
            </Badge>
          )}
          {typeof task.mark === "number" && (
            <Badge variant="outline">
              <FileText className="w-3 h-3 mr-1" />
              Mark: {task.mark}
            </Badge>
          )}
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {submissionCount} Submission{submissionCount !== 1 && "s"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        <div className="text-gray-700">
          {task.description?.trim().length ? (
            task.description
          ) : (
            <span className="text-gray-400">No description provided.</span>
          )}
        </div>

        {Array.isArray((task as any).materialUrls) && (task as any).materialUrls.length > 0 && (
          <ul className="space-y-1">
            {(task as any).materialUrls.map((url: string) => (
              <li key={url}>
                <Link className="inline w-4 h-4 mr-1 text-muted-foreground" />
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline hover:text-blue-800"
                >
                  {url.split("/").pop()}
                </a>
              </li>
            ))}
          </ul>
        )}

        {task.materialUrl && (
          <div>
            <Link className="inline w-4 h-4 mr-1 text-muted-foreground" />
            <a
              href={task.materialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline hover:text-blue-800"
            >
              View Attached Material
            </a>
          </div>
        )}

        <div className="border-t pt-2 mt-2 text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className="font-medium">Created:</span>{" "}
            {task.createdAt
              ? formatDistanceToNow(parseISO(task.createdAt), { addSuffix: true })
              : "N/A"}
          </div>
          <div className="flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            <span className="font-medium">Last Updated:</span>{" "}
            {task.createdAt
              ? formatDistanceToNow(parseISO(task.createdAt), { addSuffix: true })
              : "N/A"}
          </div>
          <div className="flex items-center gap-1">
            <GraduationCap className="w-3 h-3" />
            <span className="font-medium">Course:</span> {course?.title || "N/A"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskAssignmentDetailCard;
