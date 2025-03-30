
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { usePalette } from "@/lib/PaletteContext";

const PaletteSelector = () => {
  const { currentPalette, setPalette } = usePalette();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-600 hover:text-gray-900 bg-pastel-blue/30 hover:bg-pastel-blue/50 rounded-full"
        >
          <Palette size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          className={`flex items-center gap-2 ${currentPalette === 'candy' ? 'bg-palette-candy-primary/20' : ''}`}
          onClick={() => setPalette('candy')}
        >
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-palette-candy-primary"></div>
            <div className="w-3 h-3 rounded-full bg-palette-candy-secondary"></div>
            <div className="w-3 h-3 rounded-full bg-palette-candy-accent"></div>
          </div>
          Candy
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className={`flex items-center gap-2 ${currentPalette === 'sunset' ? 'bg-palette-sunset-primary/20' : ''}`}
          onClick={() => setPalette('sunset')}
        >
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-palette-sunset-primary"></div>
            <div className="w-3 h-3 rounded-full bg-palette-sunset-secondary"></div>
            <div className="w-3 h-3 rounded-full bg-palette-sunset-accent"></div>
          </div>
          Sunset
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className={`flex items-center gap-2 ${currentPalette === 'ocean' ? 'bg-palette-ocean-primary/20' : ''}`}
          onClick={() => setPalette('ocean')}
        >
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-palette-ocean-primary"></div>
            <div className="w-3 h-3 rounded-full bg-palette-ocean-secondary"></div>
            <div className="w-3 h-3 rounded-full bg-palette-ocean-accent"></div>
          </div>
          Ocean
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className={`flex items-center gap-2 ${currentPalette === 'forest' ? 'bg-palette-forest-primary/20' : ''}`}
          onClick={() => setPalette('forest')}
        >
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-palette-forest-primary"></div>
            <div className="w-3 h-3 rounded-full bg-palette-forest-secondary"></div>
            <div className="w-3 h-3 rounded-full bg-palette-forest-accent"></div>
          </div>
          Forest
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className={`flex items-center gap-2 ${currentPalette === 'lavender' ? 'bg-palette-lavender-primary/20' : ''}`}
          onClick={() => setPalette('lavender')}
        >
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-palette-lavender-primary"></div>
            <div className="w-3 h-3 rounded-full bg-palette-lavender-secondary"></div>
            <div className="w-3 h-3 rounded-full bg-palette-lavender-accent"></div>
          </div>
          Lavender
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PaletteSelector;
