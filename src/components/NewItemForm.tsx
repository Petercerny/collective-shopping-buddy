
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateId } from "@/lib/utils";
import { ShoppingItem } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface NewItemFormProps {
  onItemAdd: (item: ShoppingItem) => void;
}

const NewItemForm = ({ onItemAdd }: NewItemFormProps) => {
  const [itemName, setItemName] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itemName.trim()) {
      toast({
        variant: "destructive",
        title: "Item name required",
        description: "Please enter a name for your item",
      });
      return;
    }
    
    const username = localStorage.getItem("username") || "Anonymous";
    
    const newItem: ShoppingItem = {
      id: generateId(),
      name: itemName,
      checked: false,
      addedBy: username,
      createdAt: Date.now(),
    };
    
    onItemAdd(newItem);
    setItemName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full mb-4">
      <Input
        type="text"
        placeholder="Add new item..."
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        className="flex-1 bg-white/80 border-pastel-purple/30"
      />
      <Button type="submit" className="bg-pastel-purple hover:bg-pastel-purple/90 text-primary-foreground">
        Add
      </Button>
    </form>
  );
};

export default NewItemForm;
