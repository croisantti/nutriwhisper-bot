
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface AIPromptEditorProps {
  systemPrompt: string;
  onUpdatePrompt: (newPrompt: string) => void;
}

const AIPromptEditor: React.FC<AIPromptEditorProps> = ({ 
  systemPrompt, 
  onUpdatePrompt 
}) => {
  const { toast } = useToast();
  const [localPrompt, setLocalPrompt] = useState(systemPrompt);

  const handleSavePrompt = () => {
    onUpdatePrompt(localPrompt);
    toast({
      title: "Prompt Updated",
      description: "Your custom AI prompt has been saved.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit AI Prompt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Custom AI Prompt</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-2">
            Customize how the AI assistant responds by editing the system prompt below.
          </p>
          <Textarea 
            id="prompt" 
            className="h-[300px] font-mono text-sm"
            placeholder="Enter system prompt for the AI"
            value={localPrompt}
            onChange={(e) => setLocalPrompt(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleSavePrompt}>
              Save Changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIPromptEditor;
