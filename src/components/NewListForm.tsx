
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateId } from "@/lib/utils";
import { saveList } from "@/lib/storage";
import { ShoppingList } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface NewListFormProps {
  onListCreated: () => void;
}

const NewListForm = ({ onListCreated }: NewListFormProps) => {
  const [listName, setListName] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!listName.trim()) {
      toast({
        variant: "destructive",
        title: "List name required",
        description: "Please enter a name for your shopping list",
      });
      return;
    }
    
    const newList: ShoppingList = {
      id: generateId(),
      name: listName,
      items: [],
      createdAt: Date.now(),
    };
    
    saveList(newList);
    setListName("");
    onListCreated();
    
    toast({
      title: "List created!",
      description: `"${listName}" has been created successfully`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
      <div>
        <Input
          type="text"
          placeholder="Enter list name..."
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          className="w-full"
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-brand hover:bg-brand-dark"
      >
        Create New List
      </Button>
    </form>
  );
};

export default NewListForm;
