"use client";

import NavigationPanel from "@/components/NavigationPanel";
import { Loader2, Archive, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchCourses } from "@/lib/features/courseSlice";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";
import CourseTable from "@/components/course/CourseTable";
import UserCourseTable from "@/components/course/UserCourseTable";
import { fetchCoursesByUserId } from "@/lib/features/courseAssignmentSlice";

export default function CoursesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { authUser } = useSelector((state: RootState) => state.user);
  const {
    loading,
    error,
  } = useSelector((state: RootState) => state.courseAssignment);

  useEffect(() => {
    if (authUser?.id) {
      dispatch(fetchCoursesByUserId(authUser.id));
    }
  }, [dispatch, authUser?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-600 mb-2">{error}</p>
        <button
          onClick={() => location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <main>
      <div className="overflow-y-auto max-h-[calc(100vh-140px)] pr-2">
        <UserCourseTable />
      </div>
    </main>
  );
}
