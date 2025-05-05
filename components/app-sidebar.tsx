"use client";

import * as React from "react";
import {
  IconDashboard,
  IconFileUpload,
  IconUsers,
  IconSettings,
  IconHelp,
  IconSearch,
  IconCreditCard,
  IconBuildingBank,
  IconReportMoney,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

const data = {
  user: {
    name: "heritier",
    email: "heritierkaumbu@gmail.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ben",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Bank Statements",
      url: "/dashboard/statements",
      icon: IconBuildingBank,
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: IconCreditCard,
    },
    {
      title: "Clients",
      url: "/dashboard/clients",
      icon: IconUsers,
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: IconReportMoney,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Help",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <div className="flex items-center gap-2">
                  <Image
                    src="/logo-no-text.svg"
                    alt="Deposily Logo"
                    width={42}
                    height={42}
                  />
                  <Image
                    src="/logo-text-only.svg"
                    alt="Deposily Logo"
                    width={80}
                    height={80}
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
