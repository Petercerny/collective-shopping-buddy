
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

// Add a function to generate pastel colors for categories
export function getCategoryColor(category: string | undefined): string {
  if (!category) return "bg-pastel-gray";
  
  const colors = {
    "produce": "bg-pastel-green", 
    "dairy": "bg-pastel-blue",
    "meat": "bg-pastel-pink",
    "bakery": "bg-pastel-yellow",
    "drinks": "bg-pastel-peach",
    "household": "bg-pastel-purple",
    "other": "bg-pastel-gray"
  };
  
  const lowerCategory = category.toLowerCase();
  for (const [key, value] of Object.entries(colors)) {
    if (lowerCategory.includes(key)) {
      return value;
    }
  }
  
  // Use hash of string to generate consistent color for any category
  const hash = category.split("").reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  const colorKeys = Object.keys(colors);
  const colorIndex = hash % colorKeys.length;
  
  return colors[colorKeys[colorIndex] as keyof typeof colors];
}
