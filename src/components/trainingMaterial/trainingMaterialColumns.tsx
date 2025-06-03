"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Download, Trash2 } from "lucide-react";

export interface TrainingMaterial {
  id: number;
  courseId: number;
  title: string;
  description: string;
  filePath: string;
  fileType: string;
  uploadedBy: number;
  uploadedAt: string;
  updatedAt: string | null;
  isAvailable: boolean;
  isDeleted: boolean;
}

const getFileTypeLabel = (mimeType: string | undefined | null): string => {
  if (!mimeType || typeof mimeType !== "string") return "Unknown";
  const lower = mimeType.toLowerCase();
  if (lower.includes("pdf")) return "PDF";
  if (lower.includes("word")) return "DOCX";
  if (lower.includes("excel")) return "XLSX";
  if (lower.includes("powerpoint")) return "PPTX";
  if (lower.includes("text")) return "TXT";
  if (lower.includes("zip") || lower.includes("rar")) return "Archive";
  if (lower.includes("image")) return "Image";
  if (lower.includes("video")) return "Video";
  if (lower.includes("audio")) return "Audio";
  if (lower.includes("javascript")) return "JS";
  if (lower.includes("json")) return "JSON";
  if (lower.includes("html")) return "HTML";
  if (lower.includes("css")) return "CSS";
  if (lower.includes("java")) return "Java";
  if (lower.includes("csharp") || lower.includes("cs")) return "C#";
  if (lower.includes("cpp")) return "C++";
  return "Unknown";
};

export const trainingMaterialColumns = (
  roleInCourse: "Trainer" | "Trainee" | "Admin",
  onDelete?: (material: TrainingMaterial) => void
): ColumnDef<TrainingMaterial>[] => [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "fileType",
    header: "File Type",
    cell: ({ row }) => getFileTypeLabel(row.original.fileType),
  },
  {
    accessorKey: "uploadedAt",
    header: "Uploaded At",
    cell: ({ row }) => new Date(row.original.uploadedAt).toLocaleString(),
  },
  {
    accessorKey: "isAvailable",
    header: "Available",
    cell: ({ row }) =>
      row.original.isAvailable ? (
        <Badge variant="default">Yes</Badge>
      ) : (
        <Badge variant="secondary">No</Badge>
      ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const material = row.original;
      // Only show dropdown if there is an action for this role
      if (roleInCourse === "Trainer" || roleInCourse === "Admin") {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onDelete && onDelete(material)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
      if (roleInCourse === "Trainee") {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => window.open(material.filePath, "_blank")}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
      return null;
    },
  },
];