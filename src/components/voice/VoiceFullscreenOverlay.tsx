
import React, { useEffect } from 'react';
import { X, Mic, MicOff, AudioWaveform } from 'lucide-react';
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
              {/* Audio visualization */}
              {isListening ? (
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-1 bg-white rounded-full",
                        "animate-[pulse_0.6s_ease-in-out_infinite]",
                      )}
                      style={{ 
                        height: `${Math.random() * 12 + 4}px`,
                        animationDelay: `${i * 0.1}s` 
                      }}
                    ></div>
                  ))}
                </div>
              ) : isSpeaking ? (
                <AudioWaveform className="h-6 w-6 text-white animate-pulse" />
              ) : (
                <MicOff className="h-6 w-6 text-white/70" />
              )}
            </div>
          </div>
        </div>

        {/* Audio wave visualization outside the circles */}
        {(isListening || isSpeaking) && (
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-64 h-24 flex items-center justify-center">
            <div className="flex items-end justify-center gap-1 h-16 w-full">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1.5 rounded-full bg-gradient-to-t",
                    isListening ? "from-primary/70 to-primary/30" : "from-white/70 to-white/30",
                    "animate-[pulse_1s_ease-in-out_infinite]"
                  )}
                  style={{
                    height: `${
                      Math.sin((i / 16) * Math.PI) * (isListening || isSpeaking ? 24 : 4) + 
                      (isListening || isSpeaking ? Math.random() * 12 : 0)
                    }px`,
                    animationDelay: `${i * 0.05}s`,
                    animationDuration: `${0.5 + Math.random() * 0.5}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        )}
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
