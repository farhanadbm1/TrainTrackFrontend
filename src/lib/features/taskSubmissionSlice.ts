/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

export interface TaskSubmission {
  id: number;
  taskId: number;
  submittedBy: number;
  taskUrl: string;
  createdAt: string;
  isAvailable: boolean;
  isDeleted: boolean;
  submitterName?: string;
  courseTitle?: string;
  taskTitle?: string;
}

interface SubmissionState {
  submissions: TaskSubmission[];
  loading: boolean;
  error: string | null;
}

const initialState: SubmissionState = {
  submissions: [],
  loading: false,
  error: null,
};

export const fetchSubmissionsByTaskId = createAsyncThunk<
  TaskSubmission[],
  number,
  { rejectValue: string }
>(
  "taskSubmission/fetchByTaskId",
  async (taskId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/TaskSubmission/by-task/${taskId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch submissions.");
    }
  }
);

export const fetchSubmissionsByTraineeId = createAsyncThunk<
  TaskSubmission[],
  number,
  { rejectValue: string }
>(
  "taskSubmission/fetchByTraineeId",
  async (traineeId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/TaskSubmission/by-trainee/${traineeId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch trainee submissions.");
    }
  }
);

export const fetchSubmissionsByCourseId = createAsyncThunk<
  TaskSubmission[],
  number,
  { rejectValue: string }
>(
  "taskSubmission/fetchByCourseId",
  async (courseId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/TaskSubmission/by-course/${courseId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch course submissions.");
    }
  }
);

export const submitTask = createAsyncThunk<
  void,
  {
    taskId: number;
    submittedBy: number;
    taskUrl: string;
  },
  { rejectValue: string }
>(
  "taskSubmission/submit",
  async (submission, thunkAPI) => {
    try {
      await axiosInstance.post("/TaskSubmission", submission);
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to submit task");
    }
  }
);

const taskSubmissionSlice = createSlice({
  name: "taskSubmission",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubmissionsByTaskId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionsByTaskId.fulfilled, (state, action: PayloadAction<TaskSubmission[]>) => {
        state.submissions = action.payload;
        state.loading = false;
      })
      .addCase(fetchSubmissionsByTaskId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(fetchSubmissionsByTraineeId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionsByTraineeId.fulfilled, (state, action: PayloadAction<TaskSubmission[]>) => {
        state.submissions = action.payload;
        state.loading = false;
      })
      .addCase(fetchSubmissionsByTraineeId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(fetchSubmissionsByCourseId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionsByCourseId.fulfilled, (state, action: PayloadAction<TaskSubmission[]>) => {
        state.submissions = action.payload;
        state.loading = false;
      })
      .addCase(fetchSubmissionsByCourseId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(submitTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitTask.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Task submission failed";
      });
  },
});

export default taskSubmissionSlice.reducer;
