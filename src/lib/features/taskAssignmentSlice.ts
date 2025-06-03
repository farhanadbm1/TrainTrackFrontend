import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

export interface TaskAssignment {
  id: number;
  courseId: number;
  trainerId: number;
  title: string;
  description: string;
  materialUrl: string;
  dueDate: string;
  mark?: number;
  createdAt: string;
  isAvailable: boolean;
  isDeleted: boolean;
}

interface TaskAssignmentState {
  tasks: TaskAssignment[];
  selectedTask?: TaskAssignment;
  loading: boolean;
  error: string | null;
}

const initialState: TaskAssignmentState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTaskAssignmentsByCourseId = createAsyncThunk<TaskAssignment[], number>(
  "taskAssignment/fetchByCourse",
  async (courseId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/TaskAssignment/by-course/${courseId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch task assignments");
    }
  }
);

export const fetchTaskAssignmentById = createAsyncThunk<
  TaskAssignment,
  number,
  { rejectValue: string }
>(
  "taskAssignment/fetchById",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/TaskAssignment/${id}`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch task details");
    }
  }
);


export const createTaskAssignment = createAsyncThunk<
  void,
  {
    courseId: number;
    trainerId: number;
    title: string;
    description?: string;
    materialUrl?: string;
    dueDate: string;
    mark?: number;
  },
  { rejectValue: string }
>(
  "taskAssignment/create",
  async (newTask, thunkAPI) => {
    try {
      await axiosInstance.post("/TaskAssignment", newTask);
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to create task");
    }
  }
);

export const updateTaskAssignment = createAsyncThunk<
  void,
  {
    id: number;
    data: {
      courseId: number;
      trainerId: number;
      title: string;
      description?: string;
      materialUrl?: string;
      dueDate: string;
      mark?: number;
      isAvailable: boolean;
      isDeleted: boolean;
    };
  },
  { rejectValue: string }
>(
  "taskAssignment/update",
  async ({ id, data }, thunkAPI) => {
    try {
      await axiosInstance.put(`/TaskAssignment/${id}`, data); // ✅ backtick fix
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to update task");
    }
  }
);

export const deleteTaskAssignment = createAsyncThunk<
  void,
  number,
  { rejectValue: string }
>(
  "taskAssignment/delete",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/TaskAssignment/${id}`);
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to delete task");
    }
  }
);

const taskAssignmentSlice = createSlice({
  name: "taskAssignment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTaskAssignmentsByCourseId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskAssignmentsByCourseId.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchTaskAssignmentsByCourseId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create
      .addCase(createTaskAssignment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTaskAssignment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createTaskAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateTaskAssignment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTaskAssignment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateTaskAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteTaskAssignment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTaskAssignment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteTaskAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTaskAssignmentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTaskAssignmentById.fulfilled, (state, action) => {
        state.selectedTask = action.payload;
        state.loading = false;
      })
      .addCase(fetchTaskAssignmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch task detail";
      });
  },
});

export default taskAssignmentSlice.reducer;
