"use client";

import { Loader } from "lucide-react";
import { useLinkStatus } from "next/link";

export default function LoadingIndicator() {
  const { pending } = useLinkStatus();
  return pending ? (
    <Loader
      className="h-4 w-4 animate-spin opacity-0 transition-opacity duration-200"
      style={{ opacity: pending ? 1 : 0 }}
    />
  ) : (
    <div className="h-4 w-4" />
  );
}
