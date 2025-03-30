
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getListById, saveList, deleteList } from "@/lib/storage";
import { ShoppingItem, ShoppingList, SortOption } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash, Save, ListChecks } from "lucide-react";
import Header from "@/components/Header";
import NewItemForm from "@/components/NewItemForm";
import ShoppingItemComponent from "@/components/ShoppingItem";
import ShareListButton from "@/components/ShareListButton";
import { sortItemsByStatus, sortItems, groupItemsByCategory } from "@/lib/utils";
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
  const [sortOption, setSortOption] = useState<SortOption>("checked");
  const [showByCategory, setShowByCategory] = useState<boolean>(false);
  const [groupedItems, setGroupedItems] = useState<Record<string, ShoppingItem[]>>({});

  // Load and prepare list data
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
    const sorted = sortItems(shoppingList.items, sortOption);
    setSortedItems(sorted);
    
    if (showByCategory) {
      setGroupedItems(groupItemsByCategory(sorted));
    }
  }, [listId, navigate, toast, sortOption, showByCategory]);

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

  const handleDeleteList = () => {
    if (!list) return;
    
    deleteList(list.id);
    toast({
      title: "List deleted",
      description: `"${list.name}" was deleted successfully`,
    });
    navigate("/");
  };

  const handleSaveAsRecurring = () => {
    if (!list) return;
    
    const updatedList = {
      ...list,
      isRecurring: true,
    };
    
    saveList(updatedList);
    setList(updatedList);
    
    toast({
      title: "List saved",
      description: `"${list.name}" saved as a recurring list`,
    });
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
              {list.isRecurring && (
                <span className={`inline-flex items-center px-2 py-1 text-xs rounded bg-palette-${currentPalette}-primary/20 text-gray-700`}>
                  <ListChecks size={12} className="mr-1" />
                  Recurring
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <ShareListButton listId={list.id} shareId={list.shareId} />
              
              {!list.isRecurring && (
                <Button 
                  variant="outline" 
                  className={`bg-palette-${currentPalette}-secondary/20 border-palette-${currentPalette}-secondary/30`}
                  onClick={handleSaveAsRecurring}
                >
                  <Save size={16} className="mr-1" />
                  Save as Recurring
                </Button>
              )}
              
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
      </main>
    </div>
  );
};

export default ListDetail;
