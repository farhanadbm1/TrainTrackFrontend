import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskTraineeEvaluationDto } from "@/lib/features/taskEvaluationSlice";

interface Props {
  onEvaluateClick: (row: TaskTraineeEvaluationDto) => void;
}

export const getTaskEvaluationColumns = ({ onEvaluateClick }: Props): ColumnDef<TaskTraineeEvaluationDto>[] => [
  {
    accessorKey: "userId",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Name <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "taskTitle",
    header: "Task Title",
  },
  {
    accessorKey: "taskUrl",
    header: "Submission URL",
    cell: ({ row }) => {
      const url = row.getValue("taskUrl") as string | null;
      return url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View
        </a>
      ) : (
        <span className="text-gray-400">N/A</span>
      );
    },
  },
  {
    accessorKey: "taskAssignmentMark",
    header: "Assignment Mark",
    cell: ({ row }) => {
      const assMark = row.original.taskAssignmentMark;
      return typeof assMark === "number" ? assMark : "-";
    },
  },
  {
    accessorKey: "taskEvaluationMark",
    header: "Evaluation Mark",
    cell: ({ row }) => {
      const evalMark = row.original.taskEvaluationMark;
      return typeof evalMark === "number" && evalMark > 0 ? evalMark : <span className="text-gray-400">Not Graded</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <Button size="sm" variant="outline" onClick={() => onEvaluateClick(row.original)}>
          {row.original.taskEvaluationMark > 0 ? "Re-Evaluate" : "Evaluate"}
        </Button>
      );
    },
  },
];