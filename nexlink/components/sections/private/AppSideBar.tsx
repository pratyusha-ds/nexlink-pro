"use client";

import UserAvatar from "@/components/miscellaneous/UserAvatar";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils";
import { useClerk, useSession } from "@clerk/nextjs";
import { Home, Briefcase, Search, Settings, LogOut } from "lucide-react";
import Logo from "@/public/Logo";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";

const items = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Apply",
        url: "/create",
        icon: Briefcase,
    },
    {
        title: "Search",
        url: "/search",
        icon: Search,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
]

export function HeaderAvatar(){
    const { openUserProfile } = useClerk();
    const { isLoaded, session } = useSession();
    const fullname = `${session?.user?.firstName} ${session?.user?.lastName}`;
    const email = `${session?.user?.primaryEmailAddress}`
    

    if(!isLoaded)
        return(
    <SidebarMenuItem className="p-4 rounded-2xl flex justify-center">
        <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
            </div>
        </div>
    </SidebarMenuItem>
    );

    return(
        <SidebarMenuItem className="p-4 rounded-2xl flex justify-center">
            <Button variant={"secondary"} className="w-full h-full cursor-pointer p-4" onClick={()=>openUserProfile()}>
                <UserAvatar name={fullname}></UserAvatar>
                <div className="flex flex-col justify-start">
                    <span className="text-start">{fullname}</span>
                    <span className="text-start text-[0.6rem]">{email}</span>
                </div>
            </Button>
        </SidebarMenuItem>
    );
}

export function AppSidebar() {
    const pathname = usePathname();
    const { signOut } = useClerk();
    const [open, setOpen] = useState(false);
    const { setTheme } = useTheme();

  return (
    <Sidebar className="border-malachite">
      <SidebarHeader>
        <SidebarMenu className="flex ">
            <div className="p-4 flex items-center gap-4">
                <Logo />
                <span className="calistoga tracking-widest">
                    <p><span className="text-primary">Nex</span><span className="text-malachite">Link</span></p> 
                    Dashboard
                </span>
            </div>
        </SidebarMenu>
        <SidebarSeparator />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
            <SidebarGroupLabel className="text-primary">Application</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item)=>(
                        <SidebarMenuItem key={item.title} 
                        className={cn(
                            pathname.includes(item.url)
                            ? "bg-muted"
                            : ""
                        )}>
                            <SidebarMenuButton asChild>
                                <Link href={item.url}>
                                    <item.icon className="text-primary" />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <SidebarMenuItem key={"Logout"}>
                                <SidebarMenuButton className="cursor-pointer" asChild>
                                    <div>
                                        <LogOut className="text-red-500" />
                                        <span className=" text-red-500">Log Out</span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirm Logout</DialogTitle>
                            </DialogHeader>
                            <p>Are you sure you want to log out?</p>
                            <DialogFooter className="flex justify-center gap-2">
                                <Button 
                                onClick={()=>setOpen(false)}
                                className="cursor-pointer">
                                    Cancel
                                </Button>
                                <Button 
                                className="cursor-pointer"
                                variant={"destructive"}
                                onClick={()=> {
                                    setTheme("light");
                                    signOut({redirectUrl: "/"});

                                }}
                                >
                                    LogOut
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <HeaderAvatar />
      </SidebarFooter>
    </Sidebar>
  )
}
