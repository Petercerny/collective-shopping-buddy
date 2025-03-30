
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateId } from "@/lib/utils";
import { ShoppingItem } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { usePalette } from "@/lib/PaletteContext";

interface NewItemFormProps {
  onItemAdd: (item: ShoppingItem) => void;
}

const NewItemForm = ({ onItemAdd }: NewItemFormProps) => {
  const [itemName, setItemName] = useState("");
  const { toast } = useToast();
  const { currentPalette } = usePalette();

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

  const getButtonClass = () => {
    switch(currentPalette) {
      case 'sunset':
        return "bg-palette-sunset-primary hover:bg-palette-sunset-primary/90 text-primary-foreground";
      case 'ocean':
        return "bg-palette-ocean-primary hover:bg-palette-ocean-primary/90 text-primary-foreground";
      case 'candy':
      default:
        return "bg-palette-candy-primary hover:bg-palette-candy-primary/90 text-primary-foreground";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full mb-4">
      <Input
        type="text"
        placeholder="Add new item..."
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        className={`flex-1 bg-white/80 border-${currentPalette === 'candy' ? 'palette-candy-primary' : currentPalette === 'sunset' ? 'palette-sunset-primary' : 'palette-ocean-primary'}/30`}
      />
      <Button type="submit" className={getButtonClass()}>
        Add
      </Button>
    </form>
  );
};

export default NewItemForm;
