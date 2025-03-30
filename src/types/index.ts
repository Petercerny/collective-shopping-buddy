
export interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
  category?: string;
  addedBy?: string;
  quantity?: number;
  unit?: string;
  createdAt: number;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt: number;
  shareId?: string;
  isRecurring?: boolean;
}

export type SortOption = "category" | "name" | "added" | "checked";

export const CATEGORY_OPTIONS = [
  "Produce",
  "Dairy",
  "Meat",
  "Bakery",
  "Pantry",
  "Frozen",
  "Beverages",
  "Household",
  "Other"
] as const;

export const UNIT_OPTIONS = [
  "",
  "pc",
  "lb",
  "kg",
  "oz",
  "g",
  "L",
  "ml",
  "dozen",
  "pack",
  "box",
  "bottle",
  "can"
] as const;

export type Category = typeof CATEGORY_OPTIONS[number];
export type Unit = typeof UNIT_OPTIONS[number];
