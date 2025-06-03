"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";
import { ReusableDataTable } from "@/components/ReusableDataTable";
import { getTaskEvaluationColumns } from "./taskEvaluationColumns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { evaluateTrainee, fetchTaskTraineesForTask, TaskTraineeEvaluationDto } from "@/lib/features/taskEvaluationSlice";



interface Props {
  taskId: number;
}

const TaskEvaluationReportTable = ({ taskId }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { trainees, loading } = useSelector((state: RootState) => state.taskEvaluation);
  const { authUser } = useSelector((state: RootState) => state.user);
  const [selectedRow, setSelectedRow] = useState<TaskTraineeEvaluationDto | null>(null);
  const [mark, setMark] = useState<number>(0);

  useEffect(() => {
    dispatch(fetchTaskTraineesForTask(taskId));
  }, [dispatch, taskId]);

  const handleEvaluate = async () => {
    if (!selectedRow) return;

    const user = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    const trainerId = user ? JSON.parse(user).id : authUser?.id ?? 0;

    await dispatch(
      evaluateTrainee({
        taskId: taskId,
        traineeId: selectedRow.userId,
        trainerId,
        taskSubmissionId: selectedRow.taskSubmissionId ?? 0,
        mark,
      })
    ).unwrap();

    toast.success("Evaluation submitted");
    setSelectedRow(null); // close dialog
    setMark(0);
    // Optionally re-fetch to reflect changes
    dispatch(fetchTaskTraineesForTask(taskId));
  };

  return (
    <div className="space-y-4">
      <ReusableDataTable
        columns={getTaskEvaluationColumns({
          onEvaluateClick: (row: TaskTraineeEvaluationDto) => {
            setSelectedRow(row);
            setMark(row.taskEvaluationMark ?? 0);
          },
        })}
        data={trainees}
        searchKey="name"
        emptyMessage={loading ? "Loading evaluations..." : "No evaluations found."}
      />

      {/* Evaluation Dialog */}
      <Dialog open={!!selectedRow} onOpenChange={() => setSelectedRow(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Evaluate {selectedRow?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Mark</Label>
            <Input
              type="number"
              value={mark}
              onChange={(e) => setMark(Number(e.target.value))}
            />
            <Button className="w-full" onClick={handleEvaluate} disabled={loading}>
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskEvaluationReportTable;