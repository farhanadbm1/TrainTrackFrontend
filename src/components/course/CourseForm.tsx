"use client"

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CourseFormProps {
  initialData?: {
    title: string
    description: string
    startDate: string
    endDate: string
  }
  loading?: boolean
  error?: string | null
  formType?: "create" | "edit"
  onSubmit: (form: {
    title: string
    description: string
    startDate: string
    endDate: string
  }) => void
  onSuccess: () => void
}

const CourseForm = ({
  initialData,
  loading = false,
  error,
  formType = "create",
  onSubmit,
  onSuccess,
}: CourseFormProps) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      const formattedStartDate = initialData.startDate.split("T")[0]
      const formattedEndDate = initialData.endDate.split("T")[0]

      setForm({
        title: initialData.title,
        description: initialData.description,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      })
    }
  }, [initialData])

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!form.title.trim()) errors.title = "Title is required."
    if (!form.description.trim()) errors.description = "Description is required."
    if (!form.startDate) errors.startDate = "Start date is required."
    if (!form.endDate) errors.endDate = "End date is required."

    // Check if end date is after start date
    if (form.startDate && form.endDate && new Date(form.startDate) > new Date(form.endDate)) {
      errors.endDate = "End date must be after start date."
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd")
      setForm((prev) => ({ ...prev, startDate: formattedDate }))

      // Clear error
      if (formErrors.startDate) {
        setFormErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.startDate
          return newErrors
        })
      }
    }
  }

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd")
      setForm((prev) => ({ ...prev, endDate: formattedDate }))

      // Clear error
      if (formErrors.endDate) {
        setFormErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.endDate
          return newErrors
        })
      }
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    onSubmit(form)
    onSuccess()
  }

  return (
    <Card className="border-none shadow-none p-4">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-base">
                Course Title
              </Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                className={cn("mt-1.5", formErrors.title && "border-red-500")}
                placeholder="Enter course title"
              />
              {formErrors.title && <p className="text-sm text-red-500 mt-1.5">{formErrors.title}</p>}
            </div>

            <div>
              <Label htmlFor="description" className="text-base">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                className={cn("mt-1.5 min-h-[120px]", formErrors.description && "border-red-500")}
                placeholder="Enter course description"
              />
              {formErrors.description && <p className="text-sm text-red-500 mt-1.5">{formErrors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate" className="text-base">
                  Start Date
                </Label>
                <div className="mt-1.5">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !form.startDate && "text-muted-foreground",
                          formErrors.startDate && "border-red-500",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.startDate ? format(new Date(form.startDate), "PPP") : <span>Select start date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.startDate ? new Date(form.startDate) : undefined}
                        onSelect={handleStartDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {formErrors.startDate && <p className="text-sm text-red-500 mt-1.5">{formErrors.startDate}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="endDate" className="text-base">
                  End Date
                </Label>
                <div className="mt-1.5">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !form.endDate && "text-muted-foreground",
                          formErrors.endDate && "border-red-500",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.endDate ? format(new Date(form.endDate), "PPP") : <span>Select end date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.endDate ? new Date(form.endDate) : undefined}
                        onSelect={handleEndDateChange}
                        initialFocus
                        disabled={(date) => (form.startDate ? date < new Date(form.startDate) : false)}
                      />
                    </PopoverContent>
                  </Popover>
                  {formErrors.endDate && <p className="text-sm text-red-500 mt-1.5">{formErrors.endDate}</p>}
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 mt-8" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {formType === "edit" ? "Updating..." : "Registering..."}
              </>
            ) : formType === "edit" ? (
              "Update Course"
            ) : (
              "Register Course"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default CourseForm
