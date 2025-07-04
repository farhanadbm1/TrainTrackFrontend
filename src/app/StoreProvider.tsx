"use client";

import { store } from "@/lib/store";
import { Provider } from "react-redux";

import { ReactNode } from "react";

export default function ReduxProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
