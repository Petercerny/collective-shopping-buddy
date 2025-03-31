
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

interface ShareListButtonProps {
  listId: string;
  shareId?: string;
}

const ShareListButton = ({ listId, shareId: initialShareId }: ShareListButtonProps) => {
  const [shareId, setShareId] = useState<string | undefined>(initialShareId);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { currentPalette } = usePalette();
  
  // Verify list exists and get current shareId when dialog opens
  useEffect(() => {
    if (open) {
      try {
        const list = getListById(listId);
        if (!list) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "List not found. Unable to share.",
          });
          setOpen(false);
          return;
        }
        
        // Update shareId from the list in case it was changed elsewhere
        if (list.shareId) {
          setShareId(list.shareId);
        }
      } catch (error) {
        console.error("Error checking list:", error);
      }
    }
  }, [open, listId, toast]);
  
  const generateShareLink = () => {
    try {
      if (!shareId) {
        const newShareId = generateShareId(listId);
        setShareId(newShareId);
        
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
        description: "Could not generate share link. The list may not exist.",
      });
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
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <input
              className={`flex h-10 w-full rounded-md border border-palette-${currentPalette}-primary/30 bg-white/80 px-3 py-2 text-sm`}
              value={shareId ? `${window.location.origin}/shared/${shareId}` : "Generating link..."}
              readOnly
            />
          </div>
          <Button 
            onClick={copyShareLink} 
            className={getPaletteButtonClass(currentPalette)}
            disabled={!shareId}
          >
            Copy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareListButton;
