"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchAuthUserEvaluation } from "@/lib/features/taskEvaluationSlice";
import {
  fetchSubmissionsByTraineeId,
  submitTask,
} from "@/lib/features/taskSubmissionSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  BadgeCheck,
  CheckCircle,
  Clock,
  FileText,
  UploadCloud,
  User,
} from "lucide-react";
import { toast } from "sonner";

const CLOUD_NAME = "dou4dg3ha";
const UPLOAD_PRESET = "ml_default";

export default function TaskAuthUserEvaluationCard({
  taskId,
}: {
  taskId: number;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { authUserEvaluation } = useSelector(
    (state: RootState) => state.taskEvaluation
  );
  const { authUser } = useSelector((state: RootState) => state.user);
  const { submissions } = useSelector(
    (state: RootState) => state.taskSubmission
  );
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (taskId && authUser?.id) {
      dispatch(fetchAuthUserEvaluation({ taskId, traineeId: authUser.id }));
      dispatch(fetchSubmissionsByTraineeId(authUser.id));
    }
  }, [dispatch, taskId, authUser]);

  const mySubmission = submissions.find(
    (s) => s.taskId === taskId && s.submittedBy === authUser?.id && !s.isDeleted
  );

  let evalStatus = "Not Evaluated";
  let evalStatusColor = "bg-blue-50 text-blue-700 border-blue-200";
  if (authUserEvaluation) {
    if (authUserEvaluation.isDeleted) {
      evalStatus = "Deleted";
      evalStatusColor = "bg-gray-50 text-gray-700 border-gray-200";
    } else if (authUserEvaluation.isAvailable) {
      evalStatus = "Available";
      evalStatusColor = "bg-green-50 text-green-700 border-green-200";
    } else {
      evalStatus = "Not Available";
      evalStatusColor = "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file.");
      return;
    }
    if (!authUser?.id) {
      toast.error("User not found.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      setUploading(true);
      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await cloudRes.json();
      if (!result.secure_url) throw new Error("Upload failed");

      await dispatch(
        submitTask({
          taskId,
          submittedBy: authUser.id,
          taskUrl: result.secure_url,
        })
      ).unwrap();
      toast.success("Submission successful");
      setFile(null);
      dispatch(fetchAuthUserEvaluation({ taskId, traineeId: authUser.id }));
      dispatch(fetchSubmissionsByTraineeId(authUser.id));
    } catch (error) {
      console.error(error);
      toast.error("Submission failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Evaluation and Submission Details */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {authUserEvaluation ? "Your Evaluation" : "Submission Details"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Submitted File */}
          {mySubmission && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Your Submitted File
              </h3>
              <a
                href={mySubmission.taskUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {mySubmission.taskUrl}
              </a>
              <div className="text-xs text-muted-foreground">
                Submitted at:{" "}
                {new Date(mySubmission.createdAt).toLocaleString()}
              </div>
            </div>
          )}

          <Separator />

          {/* Evaluation + Upload Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <BadgeCheck className="h-4 w-4" />
                Evaluation
              </h3>
              {authUserEvaluation ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Mark:</span>
                    <Badge variant="outline">
                      {authUserEvaluation.mark}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Evaluator:</span>{" "}
                    {authUserEvaluation.trainerName ||
                      `Trainer #${authUserEvaluation.trainerId}`}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Evaluated at:</span>{" "}
                    {new Date(
                      authUserEvaluation.createdAt
                    ).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={evalStatusColor}>
                      {evalStatus}
                    </Badge>
                  </div>
                </div>
              ) : (
                <span className="text-muted-foreground">
                  Not yet evaluated.
                </span>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <UploadCloud className="h-4 w-4" />
                Submission
              </h3>
              {!authUserEvaluation?.taskId && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="file-upload">Upload or Re-Submit</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-fit mt-2"
                  >
                    <UploadCloud className="w-4 h-4 mr-2" />
                    {uploading
                      ? "Uploading..."
                      : mySubmission
                      ? "Re-Submit"
                      : "Submit"}
                  </Button>
                </div>
              )}
              {authUserEvaluation?.taskId && (
                <span className="text-muted-foreground text-sm">
                  You can't submit because this task has been evaluated.
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submission Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Submission Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <User className="w-4 h-4" />
                Submitted By
              </span>
              <span className="text-lg font-medium">
                {authUser?.name || "You"}
              </span>
            </div>
            <Separator />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <UploadCloud className="w-4 h-4" />
                Submission Status
              </span>
              <Badge
                className="w-fit mt-1"
                variant={mySubmission ? "default" : "secondary"}
              >
                {mySubmission ? "Submitted" : "Not Submitted"}
              </Badge>
            </div>
            <Separator />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Evaluation Status
              </span>
              <Badge
                className="w-fit mt-1"
                variant={authUserEvaluation ? "default" : "secondary"}
              >
                {authUserEvaluation ? "Evaluated" : "Not Evaluated"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
