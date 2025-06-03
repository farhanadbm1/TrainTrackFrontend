/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ReusableDataTable } from "@/components/ReusableDataTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TrainingMaterial,
  trainingMaterialColumns,
} from "@/components/trainingMaterial/trainingMaterialColumns";
import {
  deleteTrainingMaterial,
  fetchTrainingMaterials,
  uploadTrainingMaterial,
} from "@/lib/features/trainingMaterialSlice";

interface TrainingMaterialSectionProps {
  courseId: number;
  roleInCourse: "Trainer" | "Trainee" | "Admin";
  canUpload?: boolean;
}

export default function TrainingMaterialSection({
  courseId,
  roleInCourse,
  canUpload,
}: TrainingMaterialSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { materials} = useSelector(
    (state: RootState) => state.trainingMaterial
  );

  // Dialog states
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] =
    useState<TrainingMaterial | null>(null);

  useEffect(() => {
    dispatch(fetchTrainingMaterials(courseId));
  }, [dispatch, courseId]);

  // Only show materials with valid id and title
  const validMaterials = useMemo(
    () => materials.filter((m) => m && typeof m.id === "number" && m.title),
    [materials]
  );

  const handlePrepareDelete = useCallback((material: TrainingMaterial) => {
    setSelectedMaterial(material);
    setDialogOpen(true);
  }, []);

  const columns = useMemo(
    () => trainingMaterialColumns(roleInCourse, handlePrepareDelete),
    [roleInCourse, handlePrepareDelete]
  );

  const handleDelete = async (material: TrainingMaterial) => {
    setDialogOpen(false);
    setSelectedMaterial(null);
    try {
      await dispatch(
        deleteTrainingMaterial({ courseId, materialId: material.id })
      ).unwrap();
      toast.success("Material deleted successfully!");
    } catch (err: any) {
      toast.error("Failed to delete material");
    }
  };

  const handleUpload = async () => {
  if (!file || !title || !description) {
    toast.error("Please fill all fields and select a file.");
    return;
  }
  setUploading(true);
  try {
    await dispatch(
      uploadTrainingMaterial({
        courseId,
        title,
        description,
        file,
      })
    ).unwrap();
    toast.success("Material uploaded successfully!");
    setTitle("");
    setDescription("");
    setFile(null);
    setUploadDialogOpen(false);
  } catch (err: any) {
    toast.error("Upload failed.");
  } finally {
    setUploading(false); // <-- ensures the button becomes enabled again
  }
};


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Training Materials</CardTitle>
        {(canUpload ||
          roleInCourse === "Trainer" ) && (
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UploadCloud className="w-4 h-4 mr-2" />
                Upload Material
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg space-y-4">
              <DialogHeader>
                <DialogTitle>Upload Training Material</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Material Title"
                />
                <Label>Description</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Material Description"
                />
                <Label>Choose File</Label>
                <Input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full mt-4"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <CardContent>
          <ReusableDataTable
            columns={columns}
            data={validMaterials}
            searchKey="title"
            emptyMessage="No training materials available."
          />
        </CardContent>
      </CardContent>
      {/* Delete Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Material</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedMaterial?.title}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedMaterial && handleDelete(selectedMaterial)}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
