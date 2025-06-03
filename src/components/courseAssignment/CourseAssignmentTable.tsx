"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";
import { toast } from "sonner";

import {
  fetchAssignmentsByCourse,
  unassignUserFromCourse,
  createAssignment,
} from "@/lib/features/courseAssignmentSlice";
import { fetchUsers } from "@/lib/features/userSlice";

import { ReusableDataTable } from "@/components/ReusableDataTable";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Filter } from "lucide-react";

import AssignCourseForm from "./AssignRoleForm";
import { assignmentColumns } from "./assignmentColumns";

interface Props {
  courseId: number;
  showActions?: boolean;
}

const CourseAssignmentTable = ({ courseId, showActions = false }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { assignments, loading } = useSelector(
    (state: RootState) => state.courseAssignment
  );
  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useSelector((state: RootState) => state.user);

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(
    null
  );
  const [selectedRole, setSelectedRole] = useState<string>("all");

  useEffect(() => {
    // dispatch(fetchAssignmentsByCourse({ courseId }));
    if (users.length === 0) dispatch(fetchUsers());
  }, [dispatch, courseId, users.length]);

  const uniqueRoles = useMemo(() => {
    return Array.from(new Set(assignments.map((a) => a.role)));
  }, [assignments]);

  const handleUnassign = async () => {
    if (!selectedAssignment) return;
    try {
      await dispatch(unassignUserFromCourse(selectedAssignment.id)).unwrap();
      toast.success("User unassigned successfully.");
      dispatch(fetchAssignmentsByCourse({ courseId }));
    } catch (err) {
      toast.error("Unassign failed");
    } finally {
      setDialogOpen(false);
    }
  };

  const handleAssign = async (form: { userId: number; role: string }) => {
    try {
      await dispatch(
        createAssignment({ data: { ...form, courseId } })
      ).unwrap();
      toast.success("User assigned successfully.");
      setAssignDialogOpen(false);
      dispatch(fetchAssignmentsByCourse({ courseId }));
    } catch {
      toast.error("Assignment failed");
    }
  };

  const setSelectedAssignmentAndOpen=(assignment: any)=> {
    setSelectedAssignment(assignment);
    setDialogOpen(true);
  }
  const RoleFilter = (
  <Select onValueChange={(value) => setSelectedRole(value)} defaultValue="all">
    <SelectTrigger className="w-[180px]">
      <Filter className="h-4 w-4 mr-2" />
      <SelectValue placeholder="Filter by role" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Roles</SelectItem>
      {uniqueRoles.map((role) => (
        <SelectItem key={role} value={role} className="capitalize">
          {role}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);


  return (
    <div className="space-y-4">
      {showActions && (
        <div className="flex justify-between flex-wrap gap-4 item">
          <div className="flex items-center gap-2">
            <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Assign User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Assign User to Course</DialogTitle>
                <AssignCourseForm
                  courseId={courseId}
                  users={users}
                  loading={usersLoading}
                  error={usersError}
                  onSubmit={handleAssign}
                  onSuccess={() => setAssignDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
            {RoleFilter}
          </div>
        </div>
      )}

      <ReusableDataTable
        columns={assignmentColumns(
          showActions ? setSelectedAssignmentAndOpen : undefined
        )}
        data={useMemo(() => {
          if (selectedRole === "all") return assignments;
          return assignments.filter((a) => a.role === selectedRole);
        }, [assignments, selectedRole])}
        searchKey="userName"
        emptyMessage="No users assigned."
      />

      {/* Unassign confirmation dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unassign User</DialogTitle>
            <DialogDescription>
              Are you sure you want to unassign{" "}
              <strong>{selectedAssignment?.userName}</strong> from this course?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleUnassign}>
              Confirm Unassign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

};

export default CourseAssignmentTable;
