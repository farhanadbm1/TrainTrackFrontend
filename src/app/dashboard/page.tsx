// app/dashboard/page.tsx
"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import AdminDashboard from "@/components/AdminDashboard";
import { Loader2, Train } from "lucide-react";
import TrainerDashboard from "@/components/TrainerDashboard";

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.user.authUser);

  const renderDashboard = () => {
    switch (user?.role) {
      case "Admin":
        return <AdminDashboard/>;
      case "Trainer":
        return <TrainerDashboard />;
      case "Trainee":
        return <TrainerDashboard />;
      default:
        return <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>;
    }
  };

  return (
   
        <main>
          {renderDashboard()}
        </main>
  );
};

export default Dashboard;
