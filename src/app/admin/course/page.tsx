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

export default function CoursesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, error } = useSelector((state: RootState) => state.course);
  const token = useSelector((state: RootState) => state.user.token);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchCourses());
    }
  }, [dispatch, token]);

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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">
            {showArchived ? "Archived Courses" : "Course List"}
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowArchived(!showArchived)}
            title={showArchived ? "Show Active Courses" : "Show Archived Courses"}
          >
            {showArchived ? (
              <BookOpen className="w-5 h-5 text-blue-600" />
            ) : (
              <Archive className="w-5 h-5 text-gray-600" />
            )}
          </Button>
        </div>
        <Button onClick={() => (location.href = "/admin/course/register")}>
          Create Course
        </Button>
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-140px)] pr-2">
        <CourseTable courses={courses} showArchived={showArchived} />
      </div>
    </main>
  );
}
