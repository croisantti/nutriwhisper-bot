
import React, { useEffect } from 'react';
import { X, Mic, MicOff } from 'lucide-react';
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
      {/* Dynamic waveform visualization */}
      <div className="relative w-48 h-48 mb-8">
        <div className={cn(
          "absolute inset-0 rounded-full transition-all duration-500",
          isListening ? "bg-primary/20 scale-100" : "bg-white/10 scale-95",
          isSpeaking && "bg-white/20"
        )}>
          {/* Animated concentric circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isListening && (
              <div className="absolute w-64 h-64 rounded-full bg-primary/5 animate-pulse duration-1000"></div>
            )}
            <div className={cn(
              "w-40 h-40 rounded-full transition-all duration-500",
              isListening ? "bg-primary/10 scale-110" : "bg-white/10 scale-100",
              isSpeaking && "bg-white/15 animate-pulse"
            )}></div>
            <div className={cn(
              "w-32 h-32 rounded-full transition-all duration-500", 
              isListening ? "bg-primary/15" : "bg-white/20",
              isSpeaking && "bg-white/25 animate-pulse"
            )}></div>
            <div className={cn(
              "w-24 h-24 rounded-full transition-all duration-300", 
              isListening ? "bg-primary/20" : "bg-white/30",
              isSpeaking && "bg-white/40 animate-pulse"
            )}></div>
            <div className={cn(
              "w-16 h-16 rounded-full transition-all duration-300 flex items-center justify-center",
              isListening ? "bg-primary/30" : "bg-white/40",
              isSpeaking && "bg-white/50 animate-pulse"
            )}>
              {/* Mic icon */}
              {isListening ? (
                <Mic className="h-6 w-6 text-white animate-pulse" />
              ) : isSpeaking ? (
                <div className="flex flex-col space-y-1 items-center">
                  <div className="w-1 h-3 bg-white rounded-full animate-[pulse_1s_ease-in-out_infinite]"></div>
                  <div className="w-1 h-5 bg-white rounded-full animate-[pulse_1s_ease-in-out_0.2s_infinite]"></div>
                  <div className="w-1 h-2 bg-white rounded-full animate-[pulse_1s_ease-in-out_0.4s_infinite]"></div>
                </div>
              ) : (
                <MicOff className="h-6 w-6 text-white/70" />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Status text with animations */}
      <p className={cn(
        "text-white/70 text-sm mb-12 transition-all duration-300 animate-fade-in",
        isListening && "text-primary/90 font-medium scale-105",
        isSpeaking && "text-white/90 font-medium"
      )}>
        {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Tap to cancel'}
      </p>
      
      {/* Cancel button with hover effects */}
      <Button 
        variant="destructive" 
        size="icon" 
        className="rounded-full w-12 h-12 mb-8 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-up" 
        onClick={onCancel}
      >
        <X className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default VoiceFullscreenOverlay;
