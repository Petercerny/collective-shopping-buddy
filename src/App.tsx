
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ListDetail from "./pages/ListDetail";
import SharedList from "./pages/SharedList";
import NotFound from "./pages/NotFound";
import { PaletteProvider } from "./lib/PaletteContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PaletteProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/list/:listId" element={<ListDetail />} />
            <Route path="/shared/:shareId" element={<SharedList />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </PaletteProvider>
  </QueryClientProvider>
);

export default App;
