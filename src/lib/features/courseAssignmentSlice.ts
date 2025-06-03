import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

// Define Course Assignment interface
export interface CourseAssignment {
  id: number;
  role: string;
  assignedDate: string;
  userId: number;
  userName: string;
  userEmail: string;
}

export interface CourseWithRole {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  isAvailable: boolean;
  roleInCourse: string;
}

export interface CreateCourseAssignmentDTO {
  courseId: number;
  userId: string;
  role: string;
}

// State shape
interface AssignmentState {
  assignments: CourseAssignment[];
  userCourses: CourseWithRole[];
  currentAssignment: CourseAssignment | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Initial state
const initialState: AssignmentState = {
  assignments: [],
  userCourses: [],
  currentAssignment: null,
  loading: false,
  error: null,
  success: false,
};

// Thunks

export const fetchAssignmentsByCourse = createAsyncThunk<
  CourseAssignment[],
  { courseId: number },
  { rejectValue: string }
>("assignments/fetchByCourse", async ({ courseId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/CourseAssignment/course/${courseId}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch assignments.");
  }
});

// Create assignment
export const createAssignment = createAsyncThunk<
  { message: string }, // Adjust to match the response type
  { data: { userId: number; role: string; courseId: number } }, // Expecting userId, role, and courseId
  { rejectValue: string }
>("assignments/create", async ({ data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/CourseAssignment/assign-role", data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to assign role.");
  }
});

export const unassignUserFromCourse = createAsyncThunk<
  number, 
  number,
  { rejectValue: string }
>(
  "courseAssignments/unassignUserFromCourse",
  async (assignmentId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/CourseAssignment/unassign/${assignmentId}`);
      return assignmentId;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to unassign user.";
      return rejectWithValue(message);
    }
  }
);


export const fetchCoursesByUserId = createAsyncThunk<CourseWithRole[], number>(
  "courseAssignment/fetchCoursesByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/CourseAssignment/${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// Slice
// Slice
const assignmentSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    resetAssignmentStatus: (state) => {
      state.error = null;
      state.success = false;
    },clearAssignments: (state) => {
    state.assignments = []
  },
    clearCurrentAssignment: (state) => {
      state.currentAssignment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch by course
      .addCase(fetchAssignmentsByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentsByCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchAssignmentsByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch assignments.";
      })

      // Create assignment
      .addCase(createAssignment.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createAssignment.fulfilled, (state, _action) => {
        state.loading = false;
        state.success = true;
        // Do not push message into assignments array; re-fetch if needed
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create assignment.";
        state.success = false;
      })
      .addCase(unassignUserFromCourse.fulfilled, (state, action) => {
        state.assignments = state.assignments.filter(
          (a) => a.id !== action.payload
        );
        state.error = null;
      })
      .addCase(unassignUserFromCourse.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Fetch assignments by userId
      .addCase(fetchCoursesByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoursesByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.userCourses = action.payload;
      })
      .addCase(fetchCoursesByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAssignmentStatus, clearCurrentAssignment,clearAssignments } = assignmentSlice.actions;
export default assignmentSlice.reducer;
