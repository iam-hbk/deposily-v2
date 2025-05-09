"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";

export function Breadcrumbs() {
  const pathname = usePathname();

  // Split the pathname into segments and remove empty strings
  const segments = pathname.split("/").filter((segment) => segment);

  // Format segment for display
  const formatSegment = (segment: string) => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // If we have more than 2 segments (after dashboard), show ellipsis
  const shouldShowEllipsis = segments.length > 2;

  return (
    <Breadcrumb className="hidden min-[870px]:block">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">/</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.length > 1 && (
          <>
            <BreadcrumbSeparator />
            {shouldShowEllipsis && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbEllipsis />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {/* Second to last item */}
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/${segments.slice(0, -1).join("/")}`}>
                  {formatSegment(segments[segments.length - 2])}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {/* Last item */}
            <BreadcrumbItem>
              <BreadcrumbPage>
                {formatSegment(segments[segments.length - 1])}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
} 