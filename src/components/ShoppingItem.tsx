
import { useState, useEffect } from "react";
import { ShoppingItem as ShoppingItemType } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Check, X } from "lucide-react";
import { cn, getPaletteButtonClass } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { usePalette } from "@/lib/PaletteContext";
import { CATEGORY_OPTIONS, UNIT_OPTIONS } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ShoppingItemProps {
  item: ShoppingItemType;
  onCheck: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<ShoppingItemType>) => void;
}

const ShoppingItem = ({ item, onCheck, onDelete, onUpdate }: ShoppingItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editQuantity, setEditQuantity] = useState<number>(item.quantity || 1);
  const [editUnit, setEditUnit] = useState<string>(item.unit || "");
  const [editCategory, setEditCategory] = useState<string>(item.category || "Other");
  const { currentPalette } = usePalette();
  
  // Reset edit states whenever the item changes or editing mode is entered
  useEffect(() => {
    if (isEditing) {
      setEditName(item.name);
      setEditQuantity(item.quantity || 1);
      setEditUnit(item.unit || "");
      setEditCategory(item.category || "Other");
    }
  }, [item, isEditing]);
  
  const handleCheckChange = (checked: boolean) => {
    onCheck(item.id, checked);
  };
  
  const toggleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(!isEditing);
  };
  
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!onUpdate) return;
    
    onUpdate(item.id, {
      name: editName.trim(),
      quantity: editQuantity,
      unit: editUnit || undefined,
      category: editCategory || "Other",
    });
    
    setIsEditing(false);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(item.id);
  };

  return (
    <div 
      className={cn(
        "group flex items-center gap-2 p-2 rounded-md hover:bg-gray-100",
        item.checked && "bg-gray-50 text-gray-500"
      )}
    >
      <Checkbox 
        checked={item.checked} 
        onCheckedChange={handleCheckChange}
        className="ml-1"
      />
      
      <div className="flex-grow">
        <div className="flex items-center">
          <span className={cn("font-medium text-sm", item.checked && "line-through text-gray-400")}>
            {item.name}
          </span>
          
          {(item.quantity || item.unit) && (
            <span className="ml-2 text-xs text-gray-500">
              {item.quantity && item.quantity} {item.unit}
            </span>
          )}
          
          {item.category && item.category !== "Other" && (
            <Badge variant="outline" className="ml-2 text-xs bg-gray-50">
              {item.category}
            </Badge>
          )}
        </div>
        
        {item.addedBy && (
          <p className="text-xs text-gray-400">
            Added by {item.addedBy}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Popover open={isEditing} onOpenChange={setIsEditing}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={toggleEdit}
            >
              <Pencil size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-3">
              <h4 className="font-medium">Edit Item</h4>
              
              <div>
                <label htmlFor="edit-name" className="text-xs text-gray-500 mb-1 block">Name</label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-8"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="edit-quantity" className="text-xs text-gray-500 mb-1 block">Quantity</label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    min="1"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(Number(e.target.value))}
                    className="h-8"
                  />
                </div>
                <div>
                  <label htmlFor="edit-unit" className="text-xs text-gray-500 mb-1 block">Unit</label>
                  <Select value={editUnit} onValueChange={setEditUnit}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNIT_OPTIONS.map((unit) => (
                        <SelectItem key={unit} value={unit || " "}>
                          {unit || "None"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label htmlFor="edit-category" className="text-xs text-gray-500 mb-1 block">Category</label>
                <Select value={editCategory} onValueChange={setEditCategory}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  className={getPaletteButtonClass(currentPalette)}
                  onClick={handleSave}
                >
                  Save
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={handleDelete}
        >
          <Trash size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ShoppingItem;
