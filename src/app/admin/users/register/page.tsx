"use client"

import NavigationPanel from "@/components/NavigationPanel"
import RegisterForm from "@/components/user/RegisterForm"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const RegisterUser = () => {
  const router = useRouter()

  return (
        <main className="container mx-auto pb-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Users
              </Button>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Register New User</h1>
              <p className="text-muted-foreground mt-1">
                Create a new user account with appropriate role and permissions
              </p>
            </div>

            <RegisterForm />
          </div>
        </main>
  )
}

export default RegisterUser
