"use client";

import { useSession } from "@clerk/nextjs";
import { Skeleton } from "../ui/skeleton";
import { ReactNode } from "react";

const UserHeader = ({children} : {children: ReactNode}) => {
      const { isLoaded } = useSession();
  if (!isLoaded) 
    return <Skeleton className="fixed h-16 w-full flex items-center justify-between px-6 z-10 top-0 drop-shadow-sm"></Skeleton>;
    
  return (
    <div className="bg-white fixed h-16 w-full flex items-center justify-between px-6 z-10 top-0 drop-shadow-sm">
      {children}
    </div>
  )
}

export default UserHeader
