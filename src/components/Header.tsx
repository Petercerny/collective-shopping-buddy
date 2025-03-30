
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import PaletteSelector from "@/components/PaletteSelector";
import { usePalette } from "@/lib/PaletteContext";
import { getPaletteButtonClass } from "@/lib/utils";

const Header = () => {
  const [username, setUsername] = useState<string>(localStorage.getItem("username") || "");
  const { currentPalette } = usePalette();

  const handleSetUsername = (name: string) => {
    localStorage.setItem("username", name);
    setUsername(name);
  };

  return (
    <header className={`sticky top-0 z-10 w-full bg-white/70 backdrop-blur-md border-b border-palette-${currentPalette}-primary/10 shadow-sm`}>
      <div className="container mx-auto px-4">
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className={`bg-palette-${currentPalette}-primary/20 p-2 rounded-full`}>
              <ShoppingCart size={24} className="text-primary-foreground" />
            </div>
            <h1 className="ml-2 text-xl font-medium">Cartly</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <PaletteSelector />
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`text-gray-600 hover:text-gray-900 bg-palette-${currentPalette}-accent/30 hover:bg-palette-${currentPalette}-accent/50 rounded-full`}
                >
                  <User size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent className={`bg-white/95 backdrop-blur-md border-palette-${currentPalette}-primary/20`}>
                <div className="py-4">
                  <h3 className="text-lg font-medium mb-4">Your Profile</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="username" className="text-sm font-medium block mb-1">
                        Your Name
                      </label>
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => handleSetUsername(e.target.value)}
                        placeholder="Enter your name"
                        className={`w-full px-3 py-2 border border-palette-${currentPalette}-primary/30 rounded-md bg-white/80`}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        This name will appear when you add items to shared lists
                      </p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
