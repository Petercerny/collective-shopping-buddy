
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getListByShareId, saveList } from "@/lib/storage";
import { ShoppingItem, ShoppingList } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import Header from "@/components/Header";
import NewItemForm from "@/components/NewItemForm";
import ShoppingItemComponent from "@/components/ShoppingItem";
import { sortItemsByStatus } from "@/lib/utils";

const SharedList = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [list, setList] = useState<ShoppingList | null>(null);
  const [sortedItems, setSortedItems] = useState<ShoppingItem[]>([]);

  useEffect(() => {
    if (!shareId) return;
    
    const shoppingList = getListByShareId(shareId);
    
    if (!shoppingList) {
      toast({
        variant: "destructive",
        title: "List not found",
        description: "The shared shopping list you're looking for doesn't exist or has expired",
      });
      navigate("/");
      return;
    }
    
    setList(shoppingList);
    setSortedItems(sortItemsByStatus(shoppingList.items));
  }, [shareId, navigate, toast]);

  const handleAddItem = (item: ShoppingItem) => {
    if (!list) return;
    
    const updatedList = {
      ...list,
      items: [...list.items, item],
    };
    
    saveList(updatedList);
    setList(updatedList);
    setSortedItems(sortItemsByStatus(updatedList.items));
    
    toast({
      title: "Item added",
      description: `"${item.name}" was added to the list`,
    });
  };

  const handleCheckItem = (itemId: string, checked: boolean) => {
    if (!list) return;
    
    const updatedItems = list.items.map(item =>
      item.id === itemId ? { ...item, checked } : item
    );
    
    const updatedList = {
      ...list,
      items: updatedItems,
    };
    
    saveList(updatedList);
    setList(updatedList);
    setSortedItems(sortItemsByStatus(updatedItems));
  };

  const handleDeleteItem = (itemId: string) => {
    if (!list) return;
    
    const itemToDelete = list.items.find(item => item.id === itemId);
    const updatedItems = list.items.filter(item => item.id !== itemId);
    
    const updatedList = {
      ...list,
      items: updatedItems,
    };
    
    saveList(updatedList);
    setList(updatedList);
    setSortedItems(sortItemsByStatus(updatedItems));
    
    if (itemToDelete) {
      toast({
        title: "Item removed",
        description: `"${itemToDelete.name}" was removed from the list`,
      });
    }
  };

  if (!list) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading shared list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate("/")} className="p-2">
                <ArrowLeft size={20} />
              </Button>
              <h2 className="text-2xl font-bold flex items-center">
                {list.name}
                <span className="inline-flex items-center ml-2 px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                  <Users size={12} className="mr-1" />
                  Shared
                </span>
              </h2>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
            <div className="mb-4 pb-4 border-b">
              <p className="text-sm text-gray-500">
                You are viewing a shared shopping list. Any changes you make will be visible to everyone with the link.
              </p>
            </div>
            
            <NewItemForm onItemAdd={handleAddItem} />
          
            <div className="mt-4">
              {sortedItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>This list is empty. Add some items to get started!</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {sortedItems.map(item => (
                    <ShoppingItemComponent
                      key={item.id}
                      item={item}
                      onCheck={handleCheckItem}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SharedList;
