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
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils";
import { useClerk, useSession } from "@clerk/nextjs";
import { Home, Briefcase, Search, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const items = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Apply",
        url: "#",
        icon: Briefcase,
    },
    {
        title: "Search",
        url: "#",
        icon: Search,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
]

export function AppSidebar() {
    const pathname = usePathname();
    const { openUserProfile, signOut } = useClerk();
    const { session } = useSession();
    const [open, setOpen] = useState(false);
    const fullname = `${session?.user?.firstName} ${session?.user?.lastName}`
  return (
    <Sidebar className="border-malachite">
      <SidebarHeader>
        <SidebarMenu>
            <SidebarMenuItem className="p-4 rounded-2xl">
                <SidebarMenuButton onClick={()=>openUserProfile()}>
                    <UserAvatar name={fullname}></UserAvatar>
                    <span>{fullname}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
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
                                <a href={item.url}>
                                    <item.icon className="text-primary" />
                                    <span>{item.title}</span>
                                </a>
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
                                onClick={()=>setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button 
                                variant={"destructive"}
                                onClick={()=> signOut({redirectUrl: "/"})}>
                                    LogOut
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </SidebarMenu>
            </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        {/* Insert Contet */}
      </SidebarFooter>
    </Sidebar>
  )
}
