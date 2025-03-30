
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

// Add a function to generate pastel colors for categories based on current palette
export function getCategoryColor(category: string | undefined, palette: string = 'candy'): string {
  if (!category) return "bg-pastel-gray";
  
  // Define colors based on palette
  const colorMappings = {
    'candy': {
      "produce": "bg-palette-candy-secondary", 
      "dairy": "bg-palette-candy-accent",
      "meat": "bg-palette-candy-primary",
      "bakery": "bg-palette-candy-highlight",
      "drinks": "bg-pastel-blue",
      "household": "bg-palette-candy-accent",
      "other": "bg-palette-candy-neutral"
    },
    'sunset': {
      "produce": "bg-palette-sunset-secondary", 
      "dairy": "bg-palette-sunset-accent",
      "meat": "bg-palette-sunset-primary",
      "bakery": "bg-palette-sunset-highlight",
      "drinks": "bg-pastel-blue",
      "household": "bg-palette-sunset-accent",
      "other": "bg-palette-sunset-neutral"
    },
    'ocean': {
      "produce": "bg-palette-ocean-secondary", 
      "dairy": "bg-palette-ocean-accent",
      "meat": "bg-palette-ocean-primary",
      "bakery": "bg-palette-ocean-highlight",
      "drinks": "bg-pastel-blue",
      "household": "bg-palette-ocean-accent",
      "other": "bg-palette-ocean-neutral"
    }
  };
  
  const colors = colorMappings[palette as keyof typeof colorMappings] || colorMappings.candy;
  
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

// Get the primary color for the current palette
export function getPrimaryColor(palette: string): string {
  switch(palette) {
    case 'sunset':
      return 'bg-palette-sunset-primary';
    case 'ocean': 
      return 'bg-palette-ocean-primary';
    case 'candy':
    default:
      return 'bg-palette-candy-primary';
  }
}
