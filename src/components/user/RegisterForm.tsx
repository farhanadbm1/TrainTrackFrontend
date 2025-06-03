"use client"

import { useState, type FormEvent, type ChangeEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { AppDispatch, RootState } from "@/lib/store"
import { useDispatch, useSelector } from "react-redux"
import { registerUser, resetStatus } from "@/lib/features/userSlice"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2, User, Mail, Phone, Lock, UserPlus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

const RegisterForm = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, success, token } = useSelector((state: RootState) => state.user)

  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "Trainee",
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)

  const validateForm = () => {
    const errors: Record<string, string> = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^[0-9]{11}$/

    if (!form.username.trim()) errors.username = "Username is required."
    if (!form.name.trim()) errors.name = "Full Name is required."
    if (!form.email.trim()) {
      errors.email = "Email is required."
    } else if (!emailRegex.test(form.email)) {
      errors.email = "Please enter a valid email address."
    }
    if (!form.phoneNumber.trim()) {
      errors.phoneNumber = "Phone Number is required."
    } else if (!phoneRegex.test(form.phoneNumber)) {
      errors.phoneNumber = "Phone Number must be 11 digits."
    }
    if (!form.password) errors.password = "Password is required."
    if (form.password && form.password.length < 6) {
      errors.password = "Password must be at least 6 characters long."
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleRoleChange = (value: string) => {
    setForm((prev) => ({ ...prev, role: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!token) return

    const isValid = validateForm()
    if (!isValid) return

    dispatch(registerUser({ form }))
  }

  useEffect(() => {
    if (success) {
      router.push("/admin/users")
      dispatch(resetStatus())
      toast.success("User registered successfully!")
    }
    if (error) {
      toast.error(`Registration failed: ${error}`)
    }
  }, [success, error, router, dispatch])

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="username" className="text-base">
                Username
              </Label>
              <div className="relative mt-1.5">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className={cn("pl-10", formErrors.username && "border-red-500")}
                  placeholder="Enter username"
                />
              </div>
              {formErrors.username && <p className="text-sm text-red-500 mt-1.5">{formErrors.username}</p>}
            </div>

            <div>
              <Label htmlFor="name" className="text-base">
                Full Name
              </Label>
              <div className="relative mt-1.5">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={cn("pl-10", formErrors.name && "border-red-500")}
                  placeholder="Enter full name"
                />
              </div>
              {formErrors.name && <p className="text-sm text-red-500 mt-1.5">{formErrors.name}</p>}
            </div>

            <div>
              <Label htmlFor="email" className="text-base">
                Email
              </Label>
              <div className="relative mt-1.5">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={cn("pl-10", formErrors.email && "border-red-500")}
                  placeholder="Enter email address"
                />
              </div>
              {formErrors.email && <p className="text-sm text-red-500 mt-1.5">{formErrors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phoneNumber" className="text-base">
                Phone Number
              </Label>
              <div className="relative mt-1.5">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className={cn("pl-10", formErrors.phoneNumber && "border-red-500")}
                  placeholder="Enter 11-digit phone number"
                />
              </div>
              {formErrors.phoneNumber && <p className="text-sm text-red-500 mt-1.5">{formErrors.phoneNumber}</p>}
            </div>

            <div>
              <Label htmlFor="password" className="text-base">
                Password
              </Label>
              <div className="relative mt-1.5">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={cn("pl-10 pr-10", formErrors.password && "border-red-500")}
                  placeholder="Enter password (min. 6 characters)"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {formErrors.password && <p className="text-sm text-red-500 mt-1.5">{formErrors.password}</p>}
            </div>

            <div>
              <Label htmlFor="role" className="text-base">
                Role
              </Label>
              <Select defaultValue={form.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Trainer">Trainer</SelectItem>
                  <SelectItem value="Trainee">Trainee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" className="w-full md:w-auto px-8" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register User"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default RegisterForm
