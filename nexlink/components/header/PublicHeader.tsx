"use client";

import Logo from "@/public/Logo";
import {
  SignInButton,
  useSession,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";

const PublicHeader = () => {
  const { isSignedIn, isLoaded } = useSession();
  if (!isLoaded) return <div>Loading session...</div>;
  return (
    <nav className="bg-white fixed h-16 w-full flex items-center justify-between px-6 z-10 top-0 drop-shadow-sm">
      {/* left */}
      <Logo />
      {/* right */}
        {!isSignedIn ? (
          <SignInButton mode="modal">
            <button className="font-bold text-white bg-malachite text-sm px-3 py-2 rounded-md">
              Sign In
            </button>
          </SignInButton>
        ) : (
          <div className="flex items-center gap-4">
            <UserButton />
            <Button variant={"secondary"} onClick={()=>redirect("/dashboard")} className="border cursor-pointer">
              Dashboard
            </Button>
          </div>
        )}
    </nav>
  );
};
export default PublicHeader;
