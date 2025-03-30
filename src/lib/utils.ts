
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function sortItemsByStatus(items: any[]): any[] {
  return [...items].sort((a, b) => {
    // First sort by checked status (unchecked items first)
    if (a.checked !== b.checked) {
      return a.checked ? 1 : -1;
    }
    // Then sort by creation date (newest first)
    return b.createdAt - a.createdAt;
  });
}
