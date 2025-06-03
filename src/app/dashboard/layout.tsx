"use client";

import NavigationPanel from "@/components/NavigationPanel";
import ProtectedRoute from "@/components/ProtectedRoute";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
 

  return (
    <ProtectedRoute requiredRole={["Admin", "Trainer", "Trainee"]}>
      <div className="flex flex-col sm:flex-row h-fit">
        <NavigationPanel />
        <main className="flex-1 px-4 pt-16 sm:ml-4 sm:pt-16 overflow-y-auto">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
