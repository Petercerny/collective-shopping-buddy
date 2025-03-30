
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
    },
    'forest': {
      "produce": "bg-palette-forest-secondary", 
      "dairy": "bg-palette-forest-accent",
      "meat": "bg-palette-forest-primary",
      "bakery": "bg-palette-forest-highlight",
      "drinks": "bg-pastel-blue",
      "household": "bg-palette-forest-accent",
      "other": "bg-palette-forest-neutral"
    },
    'lavender': {
      "produce": "bg-palette-lavender-secondary", 
      "dairy": "bg-palette-lavender-accent",
      "meat": "bg-palette-lavender-primary",
      "bakery": "bg-palette-lavender-highlight",
      "drinks": "bg-pastel-blue",
      "household": "bg-palette-lavender-accent",
      "other": "bg-palette-lavender-neutral"
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
    case 'forest':
      return 'bg-palette-forest-primary';
    case 'lavender':
      return 'bg-palette-lavender-primary';
    case 'candy':
    default:
      return 'bg-palette-candy-primary';
  }
}

// Helper function to get button classes based on palette
export function getPaletteButtonClass(palette: string, isOutline: boolean = false): string {
  if (isOutline) {
    switch(palette) {
      case 'sunset':
        return "border-palette-sunset-primary/30 bg-palette-sunset-primary/20 hover:bg-palette-sunset-primary/30 text-primary-foreground";
      case 'ocean':
        return "border-palette-ocean-primary/30 bg-palette-ocean-primary/20 hover:bg-palette-ocean-primary/30 text-primary-foreground";
      case 'forest':
        return "border-palette-forest-primary/30 bg-palette-forest-primary/20 hover:bg-palette-forest-primary/30 text-primary-foreground";
      case 'lavender':
        return "border-palette-lavender-primary/30 bg-palette-lavender-primary/20 hover:bg-palette-lavender-primary/30 text-primary-foreground";
      case 'candy':
      default:
        return "border-palette-candy-primary/30 bg-palette-candy-primary/20 hover:bg-palette-candy-primary/30 text-primary-foreground";
    }
  } else {
    switch(palette) {
      case 'sunset':
        return "bg-palette-sunset-primary hover:bg-palette-sunset-primary/90 text-primary-foreground";
      case 'ocean':
        return "bg-palette-ocean-primary hover:bg-palette-ocean-primary/90 text-primary-foreground";
      case 'forest':
        return "bg-palette-forest-primary hover:bg-palette-forest-primary/90 text-primary-foreground";
      case 'lavender':
        return "bg-palette-lavender-primary hover:bg-palette-lavender-primary/90 text-primary-foreground";
      case 'candy':
      default:
        return "bg-palette-candy-primary hover:bg-palette-candy-primary/90 text-primary-foreground";
    }
  }
}
