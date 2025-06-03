// store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import courseReducer from "./features/courseSlice";
import courseAssignmentReducer from "./features/courseAssignmentSlice";

import taskAssignmentReducer from "./features/taskAssignmentSlice";

import trainingMaterialReducer from "./features/trainingMaterialSlice";
import taskSubmissionReducer from './features/taskSubmissionSlice';
import taskEvaluationReducer from './features/taskEvaluationSlice';


const persistedToken = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
const persistedUser = typeof window !== 'undefined' ? localStorage.getItem("user") : null;

const preloadedState = {
  user: {
    authUser: persistedUser ? JSON.parse(persistedUser) : null,
    profile: null,
    token: persistedToken,
    users: [],
    loading: false,
    error: null,
    success: false,
  }
};

export const store = configureStore({
  reducer: {
    user: userReducer,
    course: courseReducer,
    courseAssignment: courseAssignmentReducer,
    taskAssignment: taskAssignmentReducer,
    trainingMaterial: trainingMaterialReducer,
    taskSubmission: taskSubmissionReducer,
    taskEvaluation: taskEvaluationReducer,
  },
  preloadedState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
