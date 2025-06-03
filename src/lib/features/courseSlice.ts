/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

export interface Course {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  status: string;
  createdBy: number;
  createdByUserName: string;
}

interface CourseState {
  courses: Course[];
  courseDetails: Course | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: CourseState = {
  courses: [],
  courseDetails: null,
  loading: false,
  error: null,
  success: false,
};

// FETCH ALL COURSES
export const fetchCourses = createAsyncThunk<Course[], void, { rejectValue: string }>(
  "course/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/course");
      return response.data;
    } catch (error: any) {
      return rejectWithValue("Failed to load courses.");
    }
  }
);

// REGISTER COURSE
export const registerCourse = createAsyncThunk<
  Course,
  Partial<Course>,
  { rejectValue: string }
>("course/registerCourse", async (form, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/course/register", form);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Course registration failed.");
  }
});

// FETCH COURSE BY ID
export const fetchCourseById = createAsyncThunk<
  Course,
  number,
  { rejectValue: string }
>("course/fetchCourseById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/course/${id}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to load course details.");
  }
});

// UPDATE COURSE
export const updateCourse = createAsyncThunk<
  Course,
  { id: number; form: Partial<Course> },
  { rejectValue: string }
>("course/updateCourse", async ({ id, form }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/course/${id}`, form);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update course.");
  }
});

// TOGGLE COURSE STATUS
export const toggleCourseStatus = createAsyncThunk<
  { id: number; newStatus: string },
  number,
  { rejectValue: string }
>("course/toggleCourseStatus", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/course/${id}/toggle-status`);
    return { id, newStatus: response.data.newStatus };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to toggle course status.");
  }
});

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load courses.";
      })

      // Register
      .addCase(registerCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.courses.push(action.payload);
      })
      .addCase(registerCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Course registration failed.";
        state.success = false;
      })

      // Fetch by ID
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.courseDetails = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load course details.";
      })

      // Update course
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        // Update course in list
        const index = state.courses.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }

        // Update course details if matched
        if (state.courseDetails?.id === action.payload.id) {
          state.courseDetails = action.payload;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update course.";
        state.success = false;
      })

      // Toggle status
      .addCase(toggleCourseStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(toggleCourseStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const course = state.courses.find(c => c.id === action.payload.id);
        if (course) course.status = action.payload.newStatus;

        if (state.courseDetails?.id === action.payload.id) {
          state.courseDetails.status = action.payload.newStatus;
        }
      })
      .addCase(toggleCourseStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to toggle course status.";
        state.success = false;
      });
  },
});

export const { resetStatus } = courseSlice.actions;
export default courseSlice.reducer;
