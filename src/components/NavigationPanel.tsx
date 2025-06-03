"use client"

import { useState, useEffect, type JSX } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Book, Clipboard, FileText, Menu, X, ChevronLeft } from "lucide-react"
import { Button } from "./ui/button"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { cn } from "@/lib/utils"

const roleMenus: Record<string, { label: string; href: string; icon: JSX.Element }[]> = {
  Admin: [
    { label: "Dashboard", href: "/dashboard", icon: <Home className="w-4 h-4" /> },
    { label: "Users", href: "/admin/users", icon: <Users className="w-4 h-4" /> },
    { label: "Courses", href: "/admin/course", icon: <Book className="w-4 h-4" /> },
    { label: "My Courses", href: "/admin/mycourses", icon: <Book className="w-4 h-4" /> },
    { label: "Reports", href: "/admin/reports", icon: <FileText className="w-4 h-4" /> },
  ],
  Trainer: [
    { label: "Dashboard", href: "/dashboard", icon: <Home className="w-4 h-4" /> },
    { label: "My Courses", href: "/trainer/mycourses", icon: <Book className="w-4 h-4" /> },
    // { label: "Attendance", href: "/trainer/attendance", icon: <Users className="w-4 h-4" /> },
    // { label: "Evaluate", href: "/trainer/evaluate", icon: <FileText className="w-4 h-4" /> },
  ],
  Trainee: [
    { label: "Dashboard", href: "/dashboard", icon: <Home className="w-4 h-4" /> },
    { label: "My Courses", href: "/trainee/mycourses", icon: <Book className="w-4 h-4" /> },
    // { label: "Materials", href: "/trainee/materials", icon: <Clipboard className="w-4 h-4" /> },
    // { label: "Schedule", href: "/trainee/schedule", icon: <Users className="w-4 h-4" /> },
    // { label: "Tasks", href: "/trainee/tasks", icon: <FileText className="w-4 h-4" /> },
  ],
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

    const user = useSelector((state: RootState) => state.user.authUser);
  const userRole = user?.role

  const menuItems = userRole && roleMenus[userRole] ? roleMenus[userRole] : []

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Close mobile sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Toggle sidebar collapse state
  const toggleCollapse = () => {
    setCollapsed(!collapsed)
  }

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50" onClick={toggleMobileSidebar}>
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-background border-r transition-all duration-300 ease-in-out",
          collapsed ? "w-[70px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
            <div className="flex-shrink-0 flex items-center">
              {!collapsed && <h1 className="text-xl font-bold">Training App</h1>}
              {collapsed && <span className="text-xl font-bold">TA</span>}
            </div>
          </div>

          {/* Collapse Button (Desktop only) */}
          <Button variant="ghost" size="icon" onClick={toggleCollapse} className="hidden md:flex">
            <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
            <span className="sr-only">{collapsed ? "Expand Sidebar" : "Collapse Sidebar"}</span>
          </Button>
        </div>

        {/* Sidebar Content */}
        <div className="py-4 overflow-y-auto">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center p-2 rounded-lg hover:bg-accent group transition-all",
                      isActive ? "bg-accent text-accent-foreground font-medium" : "text-foreground/70",
                      collapsed ? "justify-center" : "justify-start",
                    )}
                  >
                    <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-start")}>
                      <span className={cn("flex-shrink-0", isActive && "text-accent-foreground")}>{item.icon}</span>

                      {!collapsed && <span className="ml-3 whitespace-nowrap">{item.label}</span>}
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>

      {/* Main Content Wrapper - Add this to your layout */}
      <div className={cn("transition-all duration-300 ease-in-out", collapsed ? "md:ml-[70px]" : "md:ml-64")}>
        {/* Your page content goes here */}
      </div>
    </>
  )
}
