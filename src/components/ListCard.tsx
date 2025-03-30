
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingList } from "@/types";
import { Check, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

interface ListCardProps {
  list: ShoppingList;
}

const ListCard = ({ list }: ListCardProps) => {
  const totalItems = list.items.length;
  const completedItems = list.items.filter(item => item.checked).length;
  
  return (
    <Link to={`/list/${list.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag size={18} className="text-brand" />
            {list.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
            {totalItems > 0 && (
              <span className="flex items-center">
                <Check size={16} className="mr-1 text-brand" />
                {completedItems}/{totalItems} completed
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ListCard;
