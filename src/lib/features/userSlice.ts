import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";
import type { AxiosError } from "axios";
import axios from "axios";

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profilePicture?: string;
  role: string;
  isDeleted?: boolean;
}

interface UserState {
  authUser: User | null;  // renamed
  profile: User | null;   // new
  token: string | null;
  users: User[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: UserState = {
  authUser: null,
  profile: null,
  token: null,
  users: [],
  loading: false,
  error: null,
  success: false,
};

// LOGIN
export const loginUser = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string },
  { rejectValue: string }
>("user/loginUser", async (loginData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data;
  } catch (error: unknown) {
    let message = "Login failed";
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response?: unknown }).response === "object" &&
      (error as { response?: unknown }).response !== null
    ) {
      const response = (error as { response: any }).response;
      if (response.status === 401) {
        message = response.data?.message || "Unauthorized";
      }
    }
    return rejectWithValue(message);
  }
});

// FETCH USERS
export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user");
      return response.data;
    } catch {
      return rejectWithValue("Failed to load users.");
    }
  }
);

// REGISTER USER
export const registerUser = createAsyncThunk<
  User,
  { form: Partial<User> },
  { rejectValue: string }
>("user/registerUser", async ({ form }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/user/register", form);
    return response.data;
  } catch (error: unknown) {
    let message = "Registration failed";
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        message = error.response.data?.message || "Unauthorized";
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
    }
    return rejectWithValue(message);
  }
});

// FETCH USER BY ID
export const fetchUserById = createAsyncThunk<
  User,
  { id: number },
  { rejectValue: string }
>("user/fetchUserById", async ({ id }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/user/profile/${id}`);
    return response.data;
  } catch (error: unknown) {
    let message = "Failed to load profile.";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message;
    }
    return rejectWithValue(message);
  }
});

// UPDATE USER
export const updateUser = createAsyncThunk<
  User,
  { id: number; form: Partial<User> },
  { rejectValue: string }
>("user/updateUser", async ({ id, form }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/user/${id}`, form);
    return response.data;
  } catch (error: unknown) {
    let message = "Update failed.";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message;
    }
    return rejectWithValue(message);
  }
});

// DELETE USER (soft delete)
export const toggleUserDeleted = createAsyncThunk<
  number,
  { id: number },
  { rejectValue: string }
>("user/deleteUser", async ({ id }, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/user/${id}`);
    return id;
  } catch (error: unknown) {
    let message = "Delete failed.";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message;
    }
    return rejectWithValue(message);
  }
});

// CHANGE PASSWORD
export const changePassword = createAsyncThunk<
  string,
  { id: number; form: { currentPassword: string; newPassword: string; confirmPassword: string } },
  { rejectValue: string }
>("user/changePassword", async ({ id, form }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/user/change-password/${id}`, form);
    return response.data.message;
  } catch (error: unknown) {
    let message = "Password change failed.";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message;
    }
    return rejectWithValue(message);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.authUser = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.authUser = action.payload;
    },
    resetStatus: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.authUser = action.payload.user;
        state.token = action.payload.token;
        state.success = true;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });

    // Fetch all users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load users.";
      });

    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.users.push(action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed.";
        state.success = false;
      });

    // Fetch user by ID
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load profile.";
      });

    // Update user
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );

        if (state.profile?.id === updatedUser.id) {
          state.profile = updatedUser;
        }

        if (state.authUser?.id === updatedUser.id) {
          state.authUser = updatedUser;
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Update failed.";
        state.success = false;
      });

    // Delete user
    builder
      .addCase(toggleUserDeleted.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(toggleUserDeleted.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.users = state.users.map((user) =>
          user.id === action.payload ? { ...user, isDeleted: !user.isDeleted } : user
        );
      })
      .addCase(toggleUserDeleted.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Delete failed.";
        state.success = false;
      });
    // Change password
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Password change failed.";
        state.success = false;
      });
  },
});

export const { logout, setUser, resetStatus } = userSlice.actions;
export default userSlice.reducer;