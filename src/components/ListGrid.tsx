
import { ShoppingList } from "@/types";
import ListCard from "./ListCard";

interface ListGridProps {
  lists: ShoppingList[];
}

const ListGrid = ({ lists }: ListGridProps) => {
  if (lists.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-gray-500 mb-2">No lists yet</h3>
        <p className="text-gray-400">Create your first shopping list to get started!</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {lists.map((list) => (
        <ListCard key={list.id} list={list} />
      ))}
    </div>
  );
};

export default ListGrid;
