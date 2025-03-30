
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { generateShareId } from "@/lib/storage";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface ShareListButtonProps {
  listId: string;
  shareId?: string;
}

const ShareListButton = ({ listId, shareId: initialShareId }: ShareListButtonProps) => {
  const [shareId, setShareId] = useState<string | undefined>(initialShareId);
  const { toast } = useToast();
  
  const generateShareLink = () => {
    try {
      if (!shareId) {
        const newShareId = generateShareId(listId);
        setShareId(newShareId);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate share link",
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
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={shareId ? undefined : generateShareLink}
        >
          <Share2 size={16} />
          Share List
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share shopping list</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <div className="text-sm text-gray-500 mb-2">
              Share this link with friends or family members to collaborate on this shopping list
            </div>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={shareId ? `${window.location.origin}/shared/${shareId}` : "Generating link..."}
              readOnly
            />
          </div>
          <Button onClick={copyShareLink} className="bg-brand hover:bg-brand-dark">
            Copy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareListButton;
