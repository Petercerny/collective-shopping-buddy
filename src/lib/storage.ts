
import { ShoppingList } from "../types";
import { generateId } from "./utils";

const STORAGE_KEY = "shopping-lists";

export const getStoredLists = (): ShoppingList[] => {
  if (typeof window === 'undefined') return [];
  
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) return [];
  
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error("Failed to parse stored lists:", error);
    return [];
  }
};

export const saveList = (list: ShoppingList): void => {
  const lists = getStoredLists();
  const existingIndex = lists.findIndex(l => l.id === list.id);
  
  if (existingIndex >= 0) {
    lists[existingIndex] = list;
  } else {
    lists.push(list);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
};

export const deleteList = (listId: string): void => {
  const lists = getStoredLists();
  const updatedLists = lists.filter(list => list.id !== listId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLists));
};

export const getListById = (id: string): ShoppingList | undefined => {
  const lists = getStoredLists();
  return lists.find(list => list.id === id);
};

export const getListByShareId = (shareId: string): ShoppingList | undefined => {
  const lists = getStoredLists();
  return lists.find(list => list.shareId === shareId);
};

export const generateShareId = (listId: string): string => {
  const lists = getStoredLists();
  const list = lists.find(l => l.id === listId);
  
  if (!list) {
    throw new Error("List not found");
  }
  
  const shareId = generateId();
  list.shareId = shareId;
  saveList(list);
  
  return shareId;
};
