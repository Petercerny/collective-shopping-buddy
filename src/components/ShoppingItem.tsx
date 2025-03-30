
import { useState } from "react";
import { ShoppingItem as ShoppingItemType } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Trash2, Edit, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePalette } from "@/lib/PaletteContext";
import { Badge } from "@/components/ui/badge";
import { UNIT_OPTIONS, CATEGORY_OPTIONS } from "@/types";

interface ShoppingItemProps {
  item: ShoppingItemType;
  onCheck: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<ShoppingItemType>) => void;
}

const ShoppingItem = ({ item, onCheck, onDelete, onUpdate }: ShoppingItemProps) => {
  const { currentPalette } = usePalette();
  const [isEditing, setIsEditing] = useState(false);
  const [editQuantity, setEditQuantity] = useState<number>(item.quantity || 1);
  const [editUnit, setEditUnit] = useState<string>(item.unit || "");
  const [editCategory, setEditCategory] = useState<string>(item.category || "Other");
  
  const handleCheckChange = (checked: boolean) => {
    onCheck(item.id, checked);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (!onUpdate) return;
    
    if (newQuantity < 1) newQuantity = 1;
    onUpdate(item.id, { quantity: newQuantity });
  };

  const handleEditSave = () => {
    if (!onUpdate) return;
    
    onUpdate(item.id, {
      quantity: editQuantity,
      unit: editUnit,
      category: editCategory,
    });
    
    setIsEditing(false);
  };

  const getPaletteCheckboxClass = () => {
    switch(currentPalette) {
      case 'sunset':
        return "border-gray-400 data-[state=checked]:bg-palette-sunset-primary data-[state=checked]:border-palette-sunset-primary";
      case 'ocean':
        return "border-gray-400 data-[state=checked]:bg-palette-ocean-primary data-[state=checked]:border-palette-ocean-primary";
      case 'forest':
        return "border-gray-400 data-[state=checked]:bg-palette-forest-primary data-[state=checked]:border-palette-forest-primary";
      case 'lavender':
        return "border-gray-400 data-[state=checked]:bg-palette-lavender-primary data-[state=checked]:border-palette-lavender-primary";
      case 'candy':
      default:
        return "border-gray-400 data-[state=checked]:bg-palette-candy-primary data-[state=checked]:border-palette-candy-primary";
    }
  };

  const getCategoryColorClass = () => {
    switch(item.category?.toLowerCase()) {
      case "produce": return `bg-palette-${currentPalette}-secondary/30`;
      case "dairy": return `bg-palette-${currentPalette}-accent/30`;
      case "meat": return `bg-blue-100`;
      case "bakery": return `bg-yellow-100`;
      case "pantry": return `bg-orange-100`;
      case "frozen": return `bg-cyan-100`;
      case "beverages": return `bg-indigo-100`;
      case "household": return `bg-gray-100`;
      default: return `bg-palette-${currentPalette}-neutral/30`;
    }
  };

  return (
    <div className={cn(
      "shopping-item p-2 rounded-md transition-all",
      item.checked && "bg-gray-50 opacity-60",
      !item.checked && `hover:bg-palette-${currentPalette}-background/80`
    )}>
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Checkbox 
            checked={item.checked} 
            onCheckedChange={handleCheckChange}
            className={getPaletteCheckboxClass()}
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="shopping-item-text truncate">{item.name}</div>
              {item.category && (
                <Badge variant="secondary" className={cn("text-xs", getCategoryColorClass())}>
                  {item.category}
                </Badge>
              )}
            </div>
            
            <div className="flex text-xs text-gray-500 items-center">
              {item.quantity && (
                <div className="flex items-center mr-2">
                  {!isEditing && onUpdate && (
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-5 w-5 p-0" 
                        onClick={() => handleQuantityChange(Math.max(1, (item.quantity || 1) - 1))}
                      >
                        <Minus size={12} />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-5 w-5 p-0" 
                        onClick={() => handleQuantityChange((item.quantity || 1) + 1)}
                      >
                        <Plus size={12} />
                      </Button>
                      {item.unit && <span className="ml-1">{item.unit}</span>}
                    </div>
                  )}
                </div>
              )}
              
              {item.addedBy && (
                <div className="text-xs text-gray-500 ml-auto">
                  Added by {item.addedBy}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {onUpdate && (
            <Popover open={isEditing} onOpenChange={setIsEditing}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Edit size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72">
                <div className="space-y-3">
                  <h4 className="font-medium">Edit Item</h4>
                  
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm">Quantity:</label>
                      <Input
                        type="number"
                        min="1"
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(Number(e.target.value))}
                        className="h-8"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <label className="text-sm">Unit:</label>
                      <Select value={editUnit} onValueChange={setEditUnit}>
                        <SelectTrigger className="h-8">
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
                    
                    <div className="flex items-center gap-2">
                      <label className="text-sm">Category:</label>
                      <Select value={editCategory} onValueChange={setEditCategory}>
                        <SelectTrigger className="h-8">
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
                  
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={handleEditSave}
                      className={getPaletteCheckboxClass()}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDelete(item.id)}
            className="text-gray-500 hover:text-red-500"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingItem;
