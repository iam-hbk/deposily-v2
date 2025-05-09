import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a more readable format using date-fns
 * @param dateString - The date string to format
 * @returns A formatted date string
 */
export function formatDate(dateString: string | Date): string {
  if (!dateString) return "";

  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  return format(date, "MMMM d, yyyy");
}
