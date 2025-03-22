
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceFullscreenOverlayProps {
  isListening: boolean;
  isSpeaking: boolean;
  onCancel: () => void;
}

const VoiceFullscreenOverlay: React.FC<VoiceFullscreenOverlayProps> = ({
  isListening,
  isSpeaking,
  onCancel
}) => {
  // Enable and disable body scroll when overlay is shown
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in">
      <div className="text-center mb-16">
        {/* Simple text status indicator */}
        <div className={cn(
          "text-4xl font-bold mb-4",
          isListening ? "text-primary" : isSpeaking ? "text-white" : "text-white/70"
        )}>
          {isListening 
            ? "Listening..." 
            : isSpeaking 
              ? "Responding..." 
              : "Voice Chat"
          }
        </div>
        
        <p className="text-white/70 text-lg mb-8">
          {!isListening && !isSpeaking && "Tap the button below to end the conversation"}
        </p>
      </div>
      
      {/* Cancel button with hover effects */}
      <Button 
        variant="destructive" 
        size="icon" 
        className="rounded-full w-12 h-12 mb-8 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105" 
        onClick={onCancel}
      >
        <X className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default VoiceFullscreenOverlay;
