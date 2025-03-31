
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getListByShareId, saveList } from "@/lib/storage";
import { ShoppingItem, ShoppingList, SortOption } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import Header from "@/components/Header";
import NewItemForm from "@/components/NewItemForm";
import ShoppingItemComponent from "@/components/ShoppingItem";
import { sortItems, groupItemsByCategory, getPaletteButtonClass } from "@/lib/utils";
import { usePalette } from "@/lib/PaletteContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const SharedList = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentPalette } = usePalette();
  
  const [list, setList] = useState<ShoppingList | null>(null);
  const [sortedItems, setSortedItems] = useState<ShoppingItem[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("checked");
  const [showByCategory, setShowByCategory] = useState<boolean>(false);
  const [groupedItems, setGroupedItems] = useState<Record<string, ShoppingItem[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);

  useEffect(() => {
    if (!shareId) {
      setError("No share ID provided");
      setIsLoading(false);
      setShowErrorDialog(true);
      return;
    }
    
    try {
      console.log("Attempting to fetch shared list with ID:", shareId);
      const shoppingList = getListByShareId(shareId);
      console.log("Result of getListByShareId:", shoppingList);
      
      if (!shoppingList) {
        console.error(`Shared list with ID ${shareId} not found`);
        setError("The shared shopping list you're looking for doesn't exist or has expired");
        setShowErrorDialog(true);
        setIsLoading(false);
        return;
      }
      
      console.log("Found shared list:", shoppingList.name);
      setList(shoppingList);
      const sorted = sortItems(shoppingList.items, sortOption);
      setSortedItems(sorted);
      
      if (showByCategory) {
        setGroupedItems(groupItemsByCategory(sorted));
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading shared list:", error);
      setError("Error loading the shared list");
      setShowErrorDialog(true);
      setIsLoading(false);
    }
  }, [shareId, sortOption, showByCategory]);

  const handleAddItem = (item: ShoppingItem) => {
    if (!list) return;
    
    const updatedList = {
      ...list,
      items: [...list.items, item],
    };
    
    saveList(updatedList);
    setList(updatedList);
    
    const sorted = sortItems(updatedList.items, sortOption);
    setSortedItems(sorted);
    
    if (showByCategory) {
      setGroupedItems(groupItemsByCategory(sorted));
    }
    
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
    
    const sorted = sortItems(updatedItems, sortOption);
    setSortedItems(sorted);
    
    if (showByCategory) {
      setGroupedItems(groupItemsByCategory(sorted));
    }
  };

  const handleUpdateItem = (itemId: string, updates: Partial<ShoppingItem>) => {
    if (!list) return;
    
    const updatedItems = list.items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    
    const updatedList = {
      ...list,
      items: updatedItems,
    };
    
    saveList(updatedList);
    setList(updatedList);
    
    const sorted = sortItems(updatedItems, sortOption);
    setSortedItems(sorted);
    
    if (showByCategory) {
      setGroupedItems(groupItemsByCategory(sorted));
    }
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
    
    const sorted = sortItems(updatedItems, sortOption);
    setSortedItems(sorted);
    
    if (showByCategory) {
      setGroupedItems(groupItemsByCategory(sorted));
    }
    
    if (itemToDelete) {
      toast({
        title: "Item removed",
        description: `"${itemToDelete.name}" was removed from the list`,
      });
    }
  };

  // Go to home page and close error dialog
  const handleGoToHome = () => {
    navigate("/");
    setShowErrorDialog(false);
  };

  const renderItems = () => {
    if (sortedItems.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>This list is empty. Add some items to get started!</p>
        </div>
      );
    }

    if (showByCategory) {
      return Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="mb-6">
          <h3 className="font-medium text-sm uppercase tracking-wider text-gray-500 mb-2">{category}</h3>
          <div className="space-y-1">
            {items.map(item => (
              <ShoppingItemComponent
                key={item.id}
                item={item}
                onCheck={handleCheckItem}
                onDelete={handleDeleteItem}
                onUpdate={handleUpdateItem}
              />
            ))}
          </div>
        </div>
      ));
    }

    return (
      <div className="space-y-1">
        {sortedItems.map(item => (
          <ShoppingItemComponent
            key={item.id}
            item={item}
            onCheck={handleCheckItem}
            onDelete={handleDeleteItem}
            onUpdate={handleUpdateItem}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex flex-col bg-palette-${currentPalette}-background`}>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4 p-6">
            <div className="animate-spin w-8 h-8 border-4 border-primary rounded-full border-t-transparent"></div>
            <p>Loading shared list...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error dialog
  return (
    <>
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">List not found</AlertDialogTitle>
            <AlertDialogDescription>
              {error || "The shared shopping list you're looking for doesn't exist or has expired."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={handleGoToHome} className={getPaletteButtonClass(currentPalette)}>
            Go to Home
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      <div className={`min-h-screen flex flex-col bg-palette-${currentPalette}-background`}>
        <Header />
        <main className="container mx-auto px-4 py-6 flex-1">
          {!list ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="bg-white p-5 rounded-lg shadow-sm mb-6 max-w-md">
                <h2 className="text-xl font-bold mb-4 text-red-600">List not found</h2>
                <p className="mb-4">{error || "The shared shopping list you're looking for doesn't exist or has expired."}</p>
                <Button onClick={() => navigate("/")} className={getPaletteButtonClass(currentPalette)}>
                  Go back to Home
                </Button>
              </div>
            </div>
          ) : (
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
                
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                  <div className="flex items-center">
                    <label className="mr-2 text-sm text-gray-600">Sort by:</label>
                    <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                      <SelectTrigger className="w-[150px] h-8 text-xs">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="category">Category</SelectItem>
                        <SelectItem value="added">Recently Added</SelectItem>
                        <SelectItem value="checked">Unchecked First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center">
                    <label className="mr-2 text-sm text-gray-600">View:</label>
                    <Select 
                      value={showByCategory ? "category" : "list"} 
                      onValueChange={(value) => setShowByCategory(value === "category")}
                    >
                      <SelectTrigger className="w-[150px] h-8 text-xs">
                        <SelectValue placeholder="View" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="list">List View</SelectItem>
                        <SelectItem value="category">Category View</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              
                <div className="mt-4">
                  {renderItems()}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default SharedList;
