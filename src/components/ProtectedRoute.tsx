"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { hasRole, isAuthenticated } from "@/lib/auth";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole: string | string[];
}) => {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!isAuthenticated()) {
        router.push("/");
      } else {
        const hasRequiredRole = await hasRole(requiredRole);
        if (!hasRequiredRole) {
          router.push("/unauthorized");
        } else {
          setIsAllowed(true);
        }
      }
      setIsChecking(false);
    };
    checkAuthentication();
  }, [router, requiredRole]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-fit">
        {/* <Loader2 className="animate-spin w-8 h-8 text-blue-600" /> */}
      </div>
    );
  }

  return <>{isAllowed ? children : null}</>;
};

export default ProtectedRoute;
