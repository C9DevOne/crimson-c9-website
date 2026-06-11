"use client";

import * as React from "react";
import Link from "next/link";
import { Music, Calendar, Users, Home, Heart, BookOpen } from "lucide-react";
import { DragonLogo } from "@/components/ui/dragon-logo";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Artists", href: "/artists", icon: Users },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Music", href: "/music", icon: Music },
  { name: "Connect", href: "/connect", icon: Heart },
  { name: "About us", href: "/about", icon: BookOpen },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="CrimsonC9">
              <Link href="/" className="flex items-center gap-2">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <DragonLogo className="size-7" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                  <span className="text-xs font-bold tracking-widest uppercase">CrimsonC9</span>
                  <span className="text-[8px] tracking-widest text-zinc-500 uppercase">
                    Change Through Music
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild tooltip={item.name}>
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className="size-4" />
                      <span className="text-[10px] font-bold tracking-widest uppercase">
                        {item.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
