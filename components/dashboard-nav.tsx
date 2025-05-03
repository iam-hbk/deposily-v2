"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, Upload, Settings, User, LogOut } from "lucide-react"

export function DashboardNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-text-only.svg" alt="deposily" width={100} height={30} className="h-6 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard">
              <Button variant={isActive("/dashboard") ? "default" : "ghost"} className="gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/statements">
              <Button variant={isActive("/dashboard/statements") ? "default" : "ghost"} className="gap-2">
                <Image src="/logo-no-text.svg" alt="Statements" width={16} height={16} className="h-4 w-4" />
                Statements
              </Button>
            </Link>
            <Link href="/dashboard/statements/upload">
              <Button variant={isActive("/dashboard/statements/upload") ? "default" : "ghost"} className="gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant={isActive("/dashboard/settings") ? "default" : "ghost"} className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/dashboard/settings">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link href="/">
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
