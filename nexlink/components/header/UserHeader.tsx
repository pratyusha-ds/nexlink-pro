"use client";

import { useSession } from "@clerk/nextjs";
import { Skeleton } from "../ui/skeleton";
import { ReactNode } from "react";

const UserHeader = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-white fixed h-16 w-full flex items-center justify-between px-6 z-10 top-0 drop-shadow-sm md:hidden">
      {children}
    </div>
  );
};

export default UserHeader;
