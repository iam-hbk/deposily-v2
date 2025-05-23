"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

import { useSession } from "@/lib/auth-client";
import { Skeleton } from "./ui/skeleton";
import LoadingIndicator from "./loading-indicator";
export function LandingPageHeader() {
  const { data: session, isPending, error, refetch } = useSession();
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex w-full items-center justify-center border-b backdrop-blur">
      <div className="container flex h-14 items-center">
        {/* Logo and potentially main nav links */}
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent hover:bg-transparent focus:bg-transparent",
                  )}
                >
                  <Image
                    src="/logo-text-only.svg"
                    alt="deposily"
                    width={100}
                    height={30}
                    className="h-6 w-auto"
                  />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {/* Add more NavigationMenuItem components here for other links if needed */}
            {/* Example:
            <NavigationMenuItem>
              <Link href="/features" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Features
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            */}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Auth links */}
        {isPending ? (
          <div className="ml-auto flex items-center gap-2">
            <Skeleton className="h-10 w-20" />
          </div>
        ) : error ? (
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" onClick={refetch}>
              Try again
            </Button>
          </div>
        ) : !!session ? (
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                Dashboard <LoadingIndicator />
              </Link>
            </Button>
          </div>
        ) : (
          <nav className="ml-auto flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
