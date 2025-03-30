import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getListById, saveList, deleteList } from "@/lib/storage";
import { ShoppingItem, ShoppingList } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash } from "lucide-react";
import Header from "@/components/Header";
import NewItemForm from "@/components/NewItemForm";
import ShoppingItemComponent from "@/components/ShoppingItem";
import ShareListButton from "@/components/ShareListButton";
import { sortItemsByStatus } from "@/lib/utils";
import { usePalette } from "@/lib/PaletteContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ListDetail = () => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentPalette } = usePalette();
  
  const [list, setList] = useState<ShoppingList | null>(null);
  const [sortedItems, setSortedItems] = useState<ShoppingItem[]>([]);

  useEffect(() => {
    if (!listId) return;
    
    const shoppingList = getListById(listId);
    
    if (!shoppingList) {
      toast({
        variant: "destructive",
        title: "List not found",
        description: "The shopping list you're looking for doesn't exist",
      });
      navigate("/");
      return;
    }
    
    setList(shoppingList);
    setSortedItems(sortItemsByStatus(shoppingList.items));
  }, [listId, navigate, toast]);

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

  const handleDeleteList = () => {
    if (!list) return;
    
    deleteList(list.id);
    toast({
      title: "List deleted",
      description: `"${list.name}" was deleted successfully`,
    });
    navigate("/");
  };

  if (!list) {
    return (
      <div className={`min-h-screen flex flex-col bg-palette-${currentPalette}-background`}>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col bg-palette-${currentPalette}-background`}>
      <Header />
      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate("/")} className="p-2">
                <ArrowLeft size={20} />
              </Button>
              <h2 className="text-2xl font-bold">{list.name}</h2>
            </div>
            <div className="flex gap-2">
              <ShareListButton listId={list.id} shareId={list.shareId} />
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-red-500 hover:text-red-700">
                    <Trash size={16} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this list?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete "{list.name}" and all its items. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteList} className="bg-red-500 hover:bg-red-600">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
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

export default ListDetail;
