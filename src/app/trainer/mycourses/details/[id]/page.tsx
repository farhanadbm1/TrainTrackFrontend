"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchCourseById } from "@/lib/features/courseSlice";
import { Loader2 } from "lucide-react";
import CourseDetails from "@/components/course/CourseDetails";
import TrainingMaterialSection from "@/components/trainingMaterial/TrainingMaterialTable";
import { fetchCoursesByUserId } from "@/lib/features/courseAssignmentSlice";

const CourseDetailsPage = () => {
  const { id } = useParams();
  const courseId = Number(id);

  const dispatch = useDispatch<AppDispatch>();
  const { courseDetails, loading, error } = useSelector(
    (state: RootState) => state.course
  );
  const { userCourses } = useSelector(
    (state: RootState) => state.courseAssignment
  );

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseById(courseId));
    }
  }, [dispatch, courseId]);
  const { authUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (authUser?.id) {
      dispatch(fetchCoursesByUserId(authUser.id));
    }
  }, [dispatch, authUser]);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
      </div>
    );
  }

  if (!courseDetails)
    return <div className="text-center mt-8">No course found.</div>;

  const roleInCourse = userCourses.find((course) => course.id === courseId)
    ?.roleInCourse as "Trainer" | "Trainee" | "Admin";

  return (
    <main className="space-y-4">
      <CourseDetails
        courseDetails={courseDetails}
        loading={loading}
        error={error}
        onEditSubmit={null}
        canEdit={false}
      />

      <TrainingMaterialSection
        courseId={courseId}
        roleInCourse={roleInCourse}
      />
    </main>
  );
};

export default CourseDetailsPage;
