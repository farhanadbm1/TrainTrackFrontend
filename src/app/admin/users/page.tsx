"use client";

import UserTable from "@/components/user/UserTable";
import NavigationPanel from "@/components/NavigationPanel";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchUsers } from "@/lib/features/userSlice";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, token } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (token) {
      dispatch(fetchUsers());
    }
  }, [dispatch, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-600 mb-2">{error}</p>
        <button
          onClick={() => location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <main>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">User List</h1>
        <Button onClick={() => (location.href = "/admin/users/register")}>
          Create User
        </Button>
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-140px)] pr-2">
        <UserTable users={users} />
      </div>
    </main>
  );
}
