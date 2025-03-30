
import { ShoppingItem as ShoppingItemType } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShoppingItemProps {
  item: ShoppingItemType;
  onCheck: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
}

const ShoppingItem = ({ item, onCheck, onDelete }: ShoppingItemProps) => {
  const handleCheckChange = (checked: boolean) => {
    onCheck(item.id, checked);
  };

  return (
    <div className={cn(
      "shopping-item",
      item.checked && "shopping-item-checked"
    )}>
      <div className="flex items-center gap-3">
        <Checkbox 
          checked={item.checked} 
          onCheckedChange={handleCheckChange}
          className="border-gray-400 data-[state=checked]:bg-brand data-[state=checked]:border-brand"
        />
        <div>
          <div className="shopping-item-text">{item.name}</div>
          {item.addedBy && (
            <div className="text-xs text-gray-500">
              Added by {item.addedBy}
            </div>
          )}
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onDelete(item.id)}
        className="text-gray-500 hover:text-red-500"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
};

export default ShoppingItem;
