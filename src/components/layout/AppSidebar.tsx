"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { LucideIcon, Home } from "lucide-react";
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
  useSidebar,
} from "@/components/ui/sidebar";

// Only routes that actually exist may be listed here — Next's typed routes reject the
// rest at build time, which is deliberate: a dead link can't ship unnoticed.
//
// The interior routes are disabled during the placeholder phase (`_`-prefixed, see
// docs/concepts/CONCEPT_site-structure.md §5). Re-add each entry below as its prototype
// page ships, along with its icon import from lucide-react:
//   Artists (Users) · Events (Calendar) · Music (Music) · Connect (Heart) · About us (BookOpen)
const navItems: { name: string; href: Route; icon: LucideIcon }[] = [
  { name: "Home", href: "/", icon: Home },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="CrimsonC9">
              <Link href="/" className="flex items-center gap-1.5" onClick={handleLinkClick}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <DragonLogo className="size-7" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                  <span className="text-xs font-bold tracking-widest uppercase">CrimsonC9</span>
                  <span className="text-[8px] tracking-wider text-zinc-500 uppercase">
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
                    <Link
                      href={item.href}
                      className="flex items-center gap-3"
                      onClick={handleLinkClick}
                    >
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
