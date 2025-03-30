
export interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
  category?: string;
  addedBy?: string;
  quantity?: number;
  createdAt: number;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt: number;
  shareId?: string;
}
