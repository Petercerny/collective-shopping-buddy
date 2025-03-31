
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { generateShareId, getListById } from "@/lib/storage";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { usePalette } from "@/lib/PaletteContext";
import { getPaletteButtonClass } from "@/lib/utils";
import { ShoppingList } from "@/types";

interface ShareListButtonProps {
  listId: string;
  shareId?: string;
}

const ShareListButton = ({ listId, shareId: initialShareId }: ShareListButtonProps) => {
  const [shareId, setShareId] = useState<string | undefined>(initialShareId);
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<ShoppingList | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { currentPalette } = usePalette();
  
  // Verify list exists and get current shareId when dialog opens
  useEffect(() => {
    if (open) {
      try {
        const currentList = getListById(listId);
        if (!currentList) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "List not found. Unable to share.",
          });
          setOpen(false);
          return;
        }
        
        setList(currentList);
        
        // Update shareId from the list in case it was changed elsewhere
        if (currentList.shareId) {
          console.log("List already has shareId:", currentList.shareId);
          setShareId(currentList.shareId);
        }
      } catch (error) {
        console.error("Error checking list:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred while preparing to share the list.",
        });
      }
    }
  }, [open, listId, toast]);
  
  const generateShareLink = async () => {
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      
      if (!shareId) {
        console.log("Generating new shareId for listId:", listId);
        const newShareId = generateShareId(listId);
        setShareId(newShareId);
        
        // Re-fetch the list to confirm the shareId was saved
        const updatedList = getListById(listId);
        console.log("List after generating shareId:", updatedList);
        
        toast({
          title: "Share link generated",
          description: "You can now share your list with others",
        });
      }
    } catch (error) {
      console.error("Error generating share link:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate share link. Please check if the list exists.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyShareLink = () => {
    if (!shareId) return;
    
    const shareLink = `${window.location.origin}/shared/${shareId}`;
    navigator.clipboard.writeText(shareLink);
    
    toast({
      title: "Link copied!",
      description: "Share link copied to clipboard",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={getPaletteButtonClass(currentPalette, true)}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!shareId) {
              generateShareLink();
            }
          }}
        >
          <Share2 size={16} />
          Share List
        </Button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-md bg-white/95 backdrop-blur-md border-palette-${currentPalette}-primary/20`}>
        <DialogHeader>
          <DialogTitle>Share shopping list</DialogTitle>
          <DialogDescription>
            Share this link with friends or family members to collaborate on this shopping list
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <div className="grid flex-1 gap-2">
            {!shareId && !isGenerating && (
              <Button
                onClick={generateShareLink}
                className={getPaletteButtonClass(currentPalette)}
              >
                Generate Share Link
              </Button>
            )}
            
            {isGenerating && (
              <div className="flex items-center justify-center p-4">
                <p>Generating share link...</p>
              </div>
            )}
            
            {shareId && (
              <>
                <p className="text-xs text-gray-500 mb-1">Anyone with this link can view and edit this list:</p>
                <input
                  className={`flex h-10 w-full rounded-md border border-palette-${currentPalette}-primary/30 bg-white/80 px-3 py-2 text-sm`}
                  value={`${window.location.origin}/shared/${shareId}`}
                  readOnly
                />
                <div className="flex justify-end mt-2">
                  <Button 
                    onClick={copyShareLink} 
                    className={getPaletteButtonClass(currentPalette)}
                  >
                    Copy Link
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareListButton;
