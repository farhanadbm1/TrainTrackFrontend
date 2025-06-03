/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { TaskAssignment } from "@/lib/features/taskAssignmentSlice";

const CLOUD_NAME = "dou4dg3ha";
const UPLOAD_PRESET = "ml_default";

interface TaskAssignmentFormProps {
  courseId: number;
  trainerId: number;
  defaultValues?: TaskAssignment;
  loading?: boolean;
  error?: string | null;
  formType?: "create" | "edit";
  onSubmit: (values: Omit<TaskAssignment, "id" | "createdAt">) => Promise<void>;
  onSuccess?: () => void;
}

const TaskAssignmentForm = ({
  courseId,
  trainerId,
  defaultValues,
  loading = false,
  error,
  formType = "create",
  onSubmit,
  onSuccess,
}: TaskAssignmentFormProps) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    materialUrl: "",
    dueDate: "",
    mark: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (defaultValues) {
      setForm({
        title: defaultValues.title ?? "",
        description: defaultValues.description ?? "",
        materialUrl: defaultValues.materialUrl ?? "",
        dueDate: defaultValues.dueDate ? defaultValues.dueDate.split("T")[0] : "",
        mark: defaultValues.mark !== undefined && defaultValues.mark !== null ? String(defaultValues.mark) : "",
      });
    }
  }, [defaultValues]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.title.trim()) errors.title = "Title is required.";
    if (!form.dueDate) errors.dueDate = "Due date is required.";
    if (form.mark && isNaN(Number(form.mark))) errors.mark = "Mark must be a number.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, dueDate: e.target.value }));

    if (formErrors.dueDate) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.dueDate;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    let fileUrl = form.materialUrl;

    if (file) {
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await uploadRes.json();
        if (!result.secure_url) throw new Error("Cloudinary upload failed");

        fileUrl = result.secure_url;
      } catch (error) {
        toast.error("File upload failed.");
        setUploading(false);
        return;
      }
    }

    await onSubmit({
      courseId,
      trainerId,
      title: form.title,
      description: form.description,
      materialUrl: fileUrl,
      dueDate: form.dueDate,
      mark: form.mark ? Number(form.mark) : undefined,
      isAvailable: true,
      isDeleted: false,
    });

    setUploading(false);
    if (onSuccess) onSuccess();
  };

  return (
    <Card className="border-none shadow-none p-4">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-base">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                className={formErrors.title ? "border-red-500 mt-1.5" : "mt-1.5"}
                placeholder="Enter task title"
              />
              {formErrors.title && <p className="text-sm text-red-500 mt-1.5">{formErrors.title}</p>}
            </div>

            <div>
              <Label htmlFor="description" className="text-base">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                className="mt-1.5 min-h-[100px]"
                placeholder="Enter description"
              />
              {formErrors.description && <p className="text-sm text-red-500 mt-1.5">{formErrors.description}</p>}
            </div>

            <div>
              <Label htmlFor="materialFile" className="text-base">
                Material File
              </Label>
              <Input
                id="materialFile"
                type="file"
                onChange={handleFileChange}
                className="mt-1.5"
              />
              {form.materialUrl && (
                <div className="mt-1.5 text-xs text-muted-foreground">
                  <a href={form.materialUrl} target="_blank" rel="noopener noreferrer" className="underline">
                    View current file
                  </a>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="dueDate" className="text-base">
                Due Date
              </Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleDateChange}
                className={formErrors.dueDate ? "border-red-500 mt-1.5" : "mt-1.5"}
                required
              />
              {formErrors.dueDate && <p className="text-sm text-red-500 mt-1.5">{formErrors.dueDate}</p>}
            </div>

            <div>
              <Label htmlFor="mark" className="text-base">
                Mark
              </Label>
              <Input
                id="mark"
                name="mark"
                type="number"
                value={form.mark}
                onChange={handleChange}
                placeholder="Enter mark (optional)"
                className="mt-1.5"
                min={0}
              />
              {formErrors.mark && <p className="text-sm text-red-500 mt-1.5">{formErrors.mark}</p>}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 mt-8"
            disabled={loading || uploading}
          >
            {(loading || uploading) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {formType === "edit"
                  ? (uploading ? "Uploading..." : "Updating...")
                  : (uploading ? "Uploading..." : "Save")
                }
              </>
            ) : formType === "edit" ? (
              "Update Task"
            ) : (
              "Save"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskAssignmentForm;