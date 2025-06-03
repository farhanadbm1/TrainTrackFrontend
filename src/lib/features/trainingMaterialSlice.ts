import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";
import { RootState } from "../store";

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

interface TrainingMaterialState {
  materials: TrainingMaterial[];
  loading: boolean;
  error: string | null;
}

const initialState: TrainingMaterialState = {
  materials: [],
  loading: false,
  error: null,
};

// Fetch materials
export const fetchTrainingMaterials = createAsyncThunk<
  TrainingMaterial[],
  number,
  { state: RootState }
>("trainingMaterial/fetchAll", async (courseId, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/TrainingMaterial/${courseId}`);
    const data = res.data;
    return (Array.isArray(data) ? data : []).filter(
      (mat) => mat && typeof mat.id === "number" && mat.title
    );
  } catch (e: any) {
    // If 404, return empty array (no error)
    if (e.response && e.response.status === 404) {
      return [];
    }
    return rejectWithValue(e.message);
  }
});

// Upload material
export const uploadTrainingMaterial = createAsyncThunk<
  void,
  {
    courseId: number;
    title: string;
    description: string;
    file: File;
  },
  { state: RootState }
>(
  "trainingMaterial/upload",
  async ({ courseId, title, description, file }, { dispatch, rejectWithValue }) => {
    try {
      // Cloudinary upload still uses fetch!
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ml_default");
      const CLOUD_NAME = "dou4dg3ha";
      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        { method: "POST", body: formData }
      );
      const result = await uploadRes.json();

      // Save in backend
      const fileUrl = result.secure_url;
      const fileType = file.type;
      await axiosInstance.post(`/TrainingMaterial`, {
        courseId,
        title,
        description,
        filePath: fileUrl,
        fileType,
        uploadedAt: new Date().toISOString(),
        isAvailable: true,
        isDeleted: false,
      });
      dispatch(fetchTrainingMaterials(courseId));
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

// Delete material
export const deleteTrainingMaterial = createAsyncThunk<
  void,
  { courseId: number; materialId: number },
  { state: RootState }
>(
  "trainingMaterial/delete",
  async ({ courseId, materialId }, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/TrainingMaterial/${materialId}`);
      dispatch(fetchTrainingMaterials(courseId));
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

const trainingMaterialSlice = createSlice({
  name: "trainingMaterial",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainingMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainingMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.materials = action.payload;
      })
      .addCase(fetchTrainingMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadTrainingMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadTrainingMaterial.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadTrainingMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTrainingMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTrainingMaterial.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteTrainingMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default trainingMaterialSlice.reducer;