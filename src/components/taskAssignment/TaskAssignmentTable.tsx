"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchTaskAssignmentsByCourseId,
  updateTaskAssignment,
  deleteTaskAssignment,
  createTaskAssignment,
  TaskAssignment,
} from "@/lib/features/taskAssignmentSlice";
import { useRouter } from "next/navigation";
import { ReusableDataTable } from "@/components/ReusableDataTable";
import { taskAssignmentColumns } from "@/components/taskAssignment/TaskAssignmentColumns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import TaskAssignmentForm from "@/components/taskAssignment/TaskAssignmentForm";

interface Props {
  courseId: number;
  roleInCourse: "Trainer" | "Trainee" | "Admin";
}

export default function TaskAssignmentTable({ courseId, roleInCourse }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { tasks, loading, error } = useSelector((state: RootState) => state.taskAssignment);
  const authUser = useSelector((state: RootState) => state.user.authUser);
  const [trainerId, setTrainerId] = useState<number | null>(null);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskAssignment | null>(null);

  useEffect(() => {
    dispatch(fetchTaskAssignmentsByCourseId(courseId));
  }, [dispatch, courseId]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setTrainerId(parsedUser.id);
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
      }
    }
  }, []);

  const basePath = authUser?.role?.toLowerCase?.() || "trainee";

  const handleView = (task: TaskAssignment) => {
    router.push(`/${basePath}/mycourses/tasks/details/${courseId}/${task.id}`);
  };

  const handleEdit = (task: TaskAssignment) => {
    setSelectedTask(task);
    setEditDialogOpen(true);
  };

  const handleDeleteRequest = (task: TaskAssignment) => {
    setSelectedTask(task);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedTask) {
      setDeleteDialogOpen(false);
      setEditDialogOpen(false);
      await dispatch(deleteTaskAssignment(selectedTask.id));
      dispatch(fetchTaskAssignmentsByCourseId(courseId));
      toast.success("Task deleted successfully.");
      setSelectedTask(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Task Assignments</CardTitle>
        {(roleInCourse === "Trainer" || roleInCourse === "Admin") && (
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create Task</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
              </DialogHeader>
              {trainerId !== null && (
                <TaskAssignmentForm
                  courseId={courseId}
                  trainerId={trainerId}
                  onSubmit={async (values) => {
                    await dispatch(createTaskAssignment(values));
                    dispatch(fetchTaskAssignmentsByCourseId(courseId));
                    setCreateDialogOpen(false);
                    toast.success("Task created successfully.");
                  }}
                />
              )}
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <ReusableDataTable
            columns={taskAssignmentColumns(roleInCourse, handleView, handleEdit, handleDeleteRequest)}
            data={tasks}
            searchKey="title"
            emptyMessage="No task assignments found."
          />
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {trainerId !== null && selectedTask && (
            <TaskAssignmentForm
              courseId={selectedTask.courseId}
              trainerId={trainerId}
              defaultValues={selectedTask}
              onSubmit={async (values) => {
                await dispatch(updateTaskAssignment({ id: selectedTask.id, data: values }));
                dispatch(fetchTaskAssignmentsByCourseId(courseId));
                setEditDialogOpen(false);
                toast.success("Task updated successfully.");
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedTask?.title}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={!selectedTask}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}