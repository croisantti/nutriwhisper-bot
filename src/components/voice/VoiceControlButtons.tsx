
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceControlButtonsProps {
  isConnected: boolean;
  isConnecting: boolean;
  onStartConversation: () => void;
  onEndConversation: () => void;
}

const VoiceControlButtons: React.FC<VoiceControlButtonsProps> = ({
  isConnected,
  isConnecting,
  onStartConversation,
  onEndConversation,
}) => {
  if (!isConnected) {
    return (
      <Button 
        onClick={onStartConversation}
        disabled={isConnecting}
        size="sm"
        className="bg-primary hover:bg-primary/90 text-white rounded-full px-4"
      >
        {isConnecting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Connecting
          </>
        ) : (
          <>
            <Mic className="h-4 w-4 mr-2" />
            Start Voice Chat
          </>
        )}
      </Button>
    );
  }
  
  return (
    <Button 
      onClick={onEndConversation}
      variant="outline"
      size="sm"
      className="rounded-full px-4"
    >
      <MicOff className="h-4 w-4 mr-2" />
      End Voice Chat
    </Button>
  );
};

export default VoiceControlButtons;
