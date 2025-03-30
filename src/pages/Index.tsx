
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import NewListForm from "@/components/NewListForm";
import ListGrid from "@/components/ListGrid";
import { ShoppingList } from "@/types";
import { getStoredLists } from "@/lib/storage";

const Index = () => {
  const [lists, setLists] = useState<ShoppingList[]>([]);

  const loadLists = () => {
    const storedLists = getStoredLists();
    // Sort lists by creation date (newest first)
    storedLists.sort((a, b) => b.createdAt - a.createdAt);
    setLists(storedLists);
  };

  useEffect(() => {
    loadLists();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">My Shopping Lists</h2>
            <NewListForm onListCreated={loadLists} />
          </div>
          
          <div className="mt-8">
            <ListGrid lists={lists} />
          </div>
        </div>
      </main>
      <footer className="py-4 text-center text-gray-500 text-sm border-t">
        <p>Shopping Buddy - Share your shopping lists with friends & family</p>
      </footer>
    </div>
  );
};

export default Index;
