"use client";
import TaskAssignmentDetailCard from "@/components/taskAssignment/TaskAssignmentDetailCard";
import TaskAssignmentTable from "@/components/taskAssignment/TaskAssignmentTable";
import TaskEvaluationReportTable from "@/components/taskEvaluation/TaskEvaluationTable";
import TaskEvaluationTable from "@/components/taskEvaluation/TaskEvaluationTable";
import TaskAuthUserEvaluation from "@/components/taskSubmission/TaskSubmissionTable";
import TaskAuthUserEvaluationCard from "@/components/taskSubmission/TaskSubmissionTable";
import TaskSubmissionTable from "@/components/taskSubmission/TaskSubmissionTable";
import { fetchCoursesByUserId } from "@/lib/features/courseAssignmentSlice";
import { fetchCourses } from "@/lib/features/courseSlice";
import { fetchTaskAssignmentById } from "@/lib/features/taskAssignmentSlice";
import { fetchAuthUserEvaluation, fetchTaskTraineesForTask } from "@/lib/features/taskEvaluationSlice";
import { fetchSubmissionsByTaskId, fetchSubmissionsByTraineeId } from "@/lib/features/taskSubmissionSlice";
import { fetchUsers } from "@/lib/features/userSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Page = () => {
  const { userCourses } = useSelector(
    (state: RootState) => state.courseAssignment
  );
const { selectedTask, loading } = useSelector((state: RootState) => state.taskAssignment);
  const dispatch = useDispatch<AppDispatch>();

  const params = useParams();
  const courseId = Array.isArray(params?.id)
    ? Number(params.id[0])
    : Number(params?.id);
  const taskId = Array.isArray(params?.taskId)
    ? Number(params.taskId[0])
    : Number(params?.taskId);
  
const { authUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (authUser?.id) {
      dispatch(fetchCoursesByUserId(authUser.id));
    }
  }, [dispatch, authUser]);
  
  useEffect(() => {
    if (taskId){
      dispatch(fetchTaskAssignmentById(taskId));
      dispatch(fetchTaskTraineesForTask(taskId));
      dispatch(fetchSubmissionsByTaskId(taskId));
      dispatch(fetchCourses());
    }
  }, [dispatch, taskId]);
    useEffect(() => {
    if (taskId && authUser?.id) {
      dispatch(fetchAuthUserEvaluation({ taskId, traineeId: authUser.id }));
      dispatch(fetchSubmissionsByTraineeId(authUser.id));
    }
  }, [dispatch, taskId, authUser]);

  const roleInCourse = userCourses.find((course) => course.id === courseId)
    ?.roleInCourse as "Trainer" | "Trainee" | "Admin";
  return (
    <main className="space-y-4">
      <TaskAssignmentDetailCard task={selectedTask} />
      {roleInCourse === "Trainer" && (
        <div>
          <TaskEvaluationReportTable taskId={taskId} />
        </div>
      )}
      {roleInCourse === "Trainee" && (
        <div>
          <TaskAuthUserEvaluationCard taskId={taskId} />
        </div>
      )}
    </main>
  );
};

export default Page;
