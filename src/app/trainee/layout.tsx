"use client";

import NavigationPanel from "@/components/NavigationPanel";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function CourseLayout({ children }: { children: React.ReactNode }) {
 

  return (
    <ProtectedRoute requiredRole={["Trainee"]}>
      <div className="flex flex-col sm:flex-row h-fit">
        <NavigationPanel />
        <main className="flex-1 px-4 pt-8 sm:ml-4 sm:pt-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
