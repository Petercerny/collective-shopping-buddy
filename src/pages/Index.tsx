
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import NewListForm from "@/components/NewListForm";
import ListGrid from "@/components/ListGrid";
import { ShoppingList } from "@/types";
import { getStoredLists } from "@/lib/storage";
import { usePalette } from "@/lib/PaletteContext";
import { ListChecks } from "lucide-react";

const Index = () => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [recurringLists, setRecurringLists] = useState<ShoppingList[]>([]);
  const { currentPalette } = usePalette();

  const loadLists = () => {
    const storedLists = getStoredLists();
    
    // Separate recurring and regular lists
    const recurring = storedLists.filter(list => list.isRecurring);
    const regular = storedLists.filter(list => !list.isRecurring);
    
    // Sort lists by creation date (newest first)
    recurring.sort((a, b) => b.createdAt - a.createdAt);
    regular.sort((a, b) => b.createdAt - a.createdAt);
    
    setRecurringLists(recurring);
    setLists(regular);
  };

  useEffect(() => {
    loadLists();
  }, []);

  return (
    <div className={`min-h-screen flex flex-col bg-palette-${currentPalette}-background`}>
      <Header />
      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">My Shopping Lists</h2>
            <NewListForm onListCreated={loadLists} />
          </div>
          
          {recurringLists.length > 0 && (
            <div className="mt-8 mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ListChecks className={`text-palette-${currentPalette}-primary`} size={20} /> 
                Recurring Lists
              </h3>
              <ListGrid lists={recurringLists} />
            </div>
          )}
          
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Recent Lists</h3>
            <ListGrid lists={lists} />
            {lists.length === 0 && recurringLists.length === 0 && (
              <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-sm">
                <p>You don't have any shopping lists yet. Create one to get started!</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className={`py-4 text-center text-gray-500 text-sm border-t border-palette-${currentPalette}-primary/10`}>
        <p>Cartly - Share your shopping lists with friends & family</p>
      </footer>
    </div>
  );
};

export default Index;
