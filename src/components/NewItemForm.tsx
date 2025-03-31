
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { generateId } from "@/lib/utils";
import { ShoppingItem, CATEGORY_OPTIONS, UNIT_OPTIONS } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { usePalette } from "@/lib/PaletteContext";
import { getPaletteButtonClass } from "@/lib/utils";

interface NewItemFormProps {
  onItemAdd: (item: ShoppingItem) => void;
}

const NewItemForm = ({ onItemAdd }: NewItemFormProps) => {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<string>("");
  const [category, setCategory] = useState<string>("Other");
  const [isExpanded, setIsExpanded] = useState(false);
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
      quantity: quantity > 0 ? quantity : undefined,
      unit: unit || undefined,
      category: category || "Other",
    };
    
    onItemAdd(newItem);
    setItemName("");
    setQuantity(1);
    setUnit("");
    if (!isExpanded) {
      setCategory("Other");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-4">
      <div className="flex gap-2 w-full">
        <Input
          type="text"
          placeholder="Add new item..."
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className={`flex-1 bg-white/80 border-palette-${currentPalette}-primary/30`}
        />
        <Button 
          type="submit" 
          className={getPaletteButtonClass(currentPalette)}
        >
          Add
        </Button>
      </div>
      
      <Button 
        type="button"
        variant="outline"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`mt-2 text-sm w-full justify-center ${getPaletteButtonClass(currentPalette, true)}`}
      >
        {isExpanded ? "Hide Options" : "Show Options"}
      </Button>
      
      {isExpanded && (
        <div className="mt-3 grid grid-cols-3 gap-3 animate-fade-in">
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className={`bg-white/80 border-palette-${currentPalette}-primary/30`}
            />
          </div>
          <div>
            <Label htmlFor="unit">Unit</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className={`bg-white/80 border-palette-${currentPalette}-primary/30`}>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {UNIT_OPTIONS.map((unitOption) => (
                  <SelectItem key={unitOption} value={unitOption}>
                    {unitOption || "None"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className={`bg-white/80 border-palette-${currentPalette}-primary/30`}>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((categoryOption) => (
                  <SelectItem key={categoryOption} value={categoryOption}>
                    {categoryOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </form>
  );
};

export default NewItemForm;
