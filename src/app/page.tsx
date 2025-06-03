"use client";

import LoginForm from "@/components/user/LoginForm";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { resetStatus } from "@/lib/features/userSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (token) {
      router.push("/dashboard");
      dispatch(resetStatus());
    }
  }, [token, router]);

  return (
    <div className="flex min-h-fit mt-4">
      {/* Left column */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-8 md:px-16 lg:px-24">
        <div className="mb-12">
          <div className="flex items-center">
            <div className="mr-2 h-8 w-8 bg-blue-800 flex items-center justify-center">
              <div className="h-4 w-4 bg-blue-300" />
            </div>
            <h1 className="text-xl font-serif font-medium">TrainTrack</h1>
          </div>
        </div>

        <div className="max-w-md">
          <h2 className="text-4xl font-bold mb-2">Welcome back</h2>
          <p className="text-gray-500 mb-8">Please enter your details</p>
        </div>
        <LoginForm />
      </div>

      {/* Right column */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="flex h-full items-center justify-center p-12">
          <Image
            src="/Assets/hero.png"
            alt="Hero illustration"
            width={600}
            height={600}
            className="w-full"
            priority
          />
        </div>
      </div>
    </div>
  );
}
