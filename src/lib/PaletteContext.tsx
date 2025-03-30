
import React, { createContext, useContext, useState, useEffect } from 'react';

type PaletteType = 'candy' | 'sunset' | 'ocean' | 'forest' | 'lavender';

interface PaletteContextType {
  currentPalette: PaletteType;
  setPalette: (palette: PaletteType) => void;
}

const PaletteContext = createContext<PaletteContextType>({
  currentPalette: 'candy',
  setPalette: () => {},
});

export function usePalette() {
  return useContext(PaletteContext);
}

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [currentPalette, setCurrentPalette] = useState<PaletteType>(() => {
    // Try to get saved palette from localStorage or default to 'candy'
    const savedPalette = localStorage.getItem('cartly-palette');
    return (savedPalette as PaletteType) || 'candy';
  });

  const setPalette = (palette: PaletteType) => {
    setCurrentPalette(palette);
    localStorage.setItem('cartly-palette', palette);
    
    // Apply body background based on palette
    document.body.className = `bg-palette-${palette}-background`;
  };
  
  // Set initial body class when component mounts
  useEffect(() => {
    document.body.className = `bg-palette-${currentPalette}-background`;
  }, []);

  return (
    <PaletteContext.Provider value={{ currentPalette, setPalette }}>
      {children}
    </PaletteContext.Provider>
  );
}
