"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { logout } from "@/lib/features/userSlice";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut, Settings, User } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { authUser, loading } = useSelector((state: RootState) => state.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // Prevent hydration mismatch

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  useEffect(() => {
    if (authUser) {
      setIsMobileMenuOpen(false);
    }
  }, [authUser]);

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-zinc-900 shadow-sm p-4">
  <div className="flex items-center justify-between sm:justify-start gap-4">
    <Link
      href={authUser ? "/dashboard" : "/"}
      className="text-xl font-bold text-blue-600"
    >
      TrainTrack
    </Link>

    {/* Theme toggle always visible */}
    <div className="sm:ml-auto">
      <ThemeToggle />
    </div>

    {/* Mobile menu button */}
    {!loading && authUser && (
      <div className="sm:hidden">
        <Button
          variant="outline"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>
    )}

    {/* Desktop user menu */}
    {!loading && authUser && (
      <div className="hidden sm:flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2">
            <Avatar>
              {authUser.profilePicture ? (
                <img
                  src={authUser.profilePicture}
                  alt={authUser.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <AvatarFallback>{authUser.name?.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <span>{authUser.name}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href="/me" className="flex items-center gap-2">
                <User className="w-4 h-4" /> View Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/me/update" className="flex items-center gap-2">
                <Settings className="w-4 h-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )}
  </div>

  {/* Mobile dropdown menu */}
  {!loading && isMobileMenuOpen && authUser && (
    <div className="sm:hidden mt-4 bg-white dark:bg-zinc-900 shadow-lg rounded p-4 z-50">
      <div className="flex flex-col gap-2">
        <Link
          href="/me"
          className="flex items-center gap-2 p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded"
        >
          <User className="w-4 h-4" /> View Profile
        </Link>
        <Link
          href="/me/update"
          className="flex items-center gap-2 p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded"
        >
          <Settings className="w-4 h-4" /> Settings
        </Link>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="flex items-center gap-2 p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded"
        >
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </div>
    </div>
  )}
</nav>

  );
}
