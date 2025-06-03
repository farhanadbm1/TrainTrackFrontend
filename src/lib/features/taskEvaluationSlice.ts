/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";

export interface TaskEvaluation {
  id: number;
  taskId: number;
  taskTitle: string;
  taskSubmissionId: number;
  traineeId: number;
  traineeName: string;
  trainerId: number;
  trainerName: string;
  mark: number;
  createdAt: string;
  isAvailable: boolean;
  isDeleted: boolean;
}

export interface TaskTraineeEvaluationDto {
  userId: number;
  name: string;
  taskSubmissionId: number;
  taskUrl: string | null;
  taskAssignmentMark: number;
  taskEvaluationMark: number;
  taskTitle: string;
}

interface TaskEvaluationState {
  evaluations: TaskEvaluation[];
  trainees: TaskTraineeEvaluationDto[];
  authUserEvaluation: TaskEvaluation | null;
  loading: boolean;
  error: string | null;
}

const initialState: TaskEvaluationState = {
  evaluations: [],
  trainees: [],
  authUserEvaluation: null,
  loading: false,
  error: null,
};

// Fetch all trainees' evaluations for a task
export const fetchTaskTraineesForTask = createAsyncThunk<
  TaskTraineeEvaluationDto[],
  number,
  { rejectValue: string }
>("taskEvaluation/fetchTraineesForTask", async (taskId, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/TaskEvaluation/trainees/${taskId}`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue("Failed to fetch trainees for task.");
  }
});

// Fetch evaluation for the authenticated trainee for a task
export const fetchAuthUserEvaluation = createAsyncThunk<
  TaskEvaluation | null,
  { taskId: number; traineeId: number },
  { rejectValue: string }
>("taskEvaluation/fetchAuthUserEvaluation", async ({ taskId, traineeId }, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/TaskEvaluation/by-trainee/${taskId}/${traineeId}`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue("Failed to fetch your evaluation for this task.");
  }
});

// Create or update an evaluation for a trainee
export const evaluateTrainee = createAsyncThunk<
  { message: string; id: number },
  {
    taskId: number;
    traineeId: number;
    trainerId: number;
    mark: number;
    taskSubmissionId: number;
  },
  { rejectValue: string }
>("taskEvaluation/evaluateTrainee", async (evaluationData, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/TaskEvaluation/evaluate", evaluationData);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue("Failed to evaluate trainee.");
  }
});

const taskEvaluationSlice = createSlice({
  name: "taskEvaluation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all trainees' evaluations for a task
      .addCase(fetchTaskTraineesForTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskTraineesForTask.fulfilled, (state, action: PayloadAction<TaskTraineeEvaluationDto[]>) => {
        state.trainees = action.payload;
        state.loading = false;
      })
      .addCase(fetchTaskTraineesForTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch trainees for task";
      })

      // Fetch evaluation for auth user
      .addCase(fetchAuthUserEvaluation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthUserEvaluation.fulfilled, (state, action: PayloadAction<TaskEvaluation | null>) => {
        state.authUserEvaluation = action.payload;
        state.loading = false;
      })
      .addCase(fetchAuthUserEvaluation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch your evaluation for this task";
      })

      // Evaluate a trainee
      .addCase(evaluateTrainee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(evaluateTrainee.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(evaluateTrainee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Task evaluation failed";
      });
  },
});

export default taskEvaluationSlice.reducer;