"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { changePassword, resetStatus } from "@/lib/features/userSlice";
import { toast } from "sonner";

const ChangePasswordDialog = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { authUser, token, loading, success, error } = useSelector(
    (state: RootState) => state.user
  );

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [open, setOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleVisibility = (field: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser || !token) return;

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    await dispatch(
      changePassword({
        id: authUser.id,
        form: formData
      })
    );
  };

  useEffect(() => {
    if (success) {
      toast.success("Password changed successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      dispatch(resetStatus());
      setOpen(false);
    } else if (error) {
      toast.error(error);
      dispatch(resetStatus());
    }
  }, [success, error, dispatch]);

  const renderPasswordField = (
    id: string,
    label: string,
    value: string,
    show: boolean,
    toggle: () => void
  ) => (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={handleChange}
          required
          className="h-12 pr-10"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
          tabIndex={-1}
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4">
          <Lock className="w-4 h-4 mr-2" />
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderPasswordField(
            "currentPassword",
            "Current Password",
            formData.currentPassword,
            showPassword.current,
            () => toggleVisibility("current")
          )}
          {renderPasswordField(
            "newPassword",
            "New Password",
            formData.newPassword,
            showPassword.new,
            () => toggleVisibility("new")
          )}
          {renderPasswordField(
            "confirmPassword",
            "Confirm Password",
            formData.confirmPassword,
            showPassword.confirm,
            () => toggleVisibility("confirm")
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Changing...
              </>
            ) : (
              "Change Password"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
