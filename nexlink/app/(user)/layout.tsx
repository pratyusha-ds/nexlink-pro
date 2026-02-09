"use server";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sections/private/AppSideBar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import UserHeader from "@/components/header/UserHeader";

const Layout = async ({ children }: { children: ReactNode }) => {
  const { userId } = await auth();
  if (!userId) redirect("/");

  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="light">
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 w-full">
            <UserHeader>
              <SidebarTrigger className="sm:hidden m-0 p-0" />
            </UserHeader>

            {children}
          </main>
        </SidebarProvider>
      </ThemeProvider>
    </>
  );
};

export default Layout;
