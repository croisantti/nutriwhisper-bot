
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
      {/* Voice visualization animation */}
      <div className="relative w-64 h-64 mb-8">
        {/* Expanding rings animation */}
        <div className={cn(
          "absolute inset-0 rounded-full",
          isListening ? "bg-primary/20" : "bg-white/10",
          isSpeaking && "bg-white/20"
        )}>
          {/* Animated pulse rings */}
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <div className={cn(
              "absolute w-full h-full rounded-full transform scale-50 opacity-30",
              isListening ? "bg-primary animate-ping" : isSpeaking ? "bg-white/30 animate-ping" : "bg-white/20"
            )} />
            <div className={cn(
              "absolute w-full h-full rounded-full transform scale-75 opacity-20",
              isListening ? "bg-primary animate-ping animation-delay-300" : isSpeaking ? "bg-white/30 animate-ping animation-delay-300" : "bg-white/10"
            )} />
            <div className={cn(
              "absolute w-full h-full rounded-full transform scale-90 opacity-10",
              isListening ? "bg-primary animate-ping animation-delay-600" : isSpeaking ? "bg-white/20 animate-ping animation-delay-600" : "bg-white/5"
            )} />
            
            {/* Central visualization */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Voice wave visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-end justify-center gap-1.5 h-24 w-full">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "rounded-full",
                        isListening ? "bg-primary" : "bg-white/70",
                        (isListening || isSpeaking) ? "animate-audio-pulse" : "h-1"
                      )}
                      style={{
                        width: i % 2 === 0 ? '4px' : '3px',
                        '--pulse-height': `${12 + Math.abs(i - 4) * 3}px`,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: `${0.8 + Math.random() * 0.4}s`,
                        height: (isListening || isSpeaking) ? 'auto' : '2px',
                        opacity: (isListening || isSpeaking) ? 1 : 0.5
                      } as React.CSSProperties}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Circular waveform visualization */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className={cn(
            "w-44 h-44 rounded-full flex items-center justify-center",
            isListening ? "bg-primary/5 border border-primary/20" : "bg-white/5 border border-white/10",
            isSpeaking && "bg-white/10 border-white/20"
          )}>
            <div className={cn(
              "w-36 h-36 rounded-full flex items-center justify-center",
              isListening ? "bg-primary/10 border border-primary/30" : "bg-white/10 border border-white/20",
              isSpeaking && "bg-white/15 border-white/30"
            )}>
              <div className={cn(
                "w-28 h-28 rounded-full flex items-center justify-center",
                isListening ? "bg-primary/15" : "bg-white/15",
                isSpeaking && "bg-white/20"
              )}>
                {/* Dynamic waveform */}
                <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden">
                  <div className="flex flex-row items-end justify-center gap-1 h-16 w-full">
                    {[...Array(12)].map((_, i) => {
                      const isActive = isListening || isSpeaking;
                      const baseHeight = isActive ? 6 + Math.random() * 14 : 2;
                      
                      return (
                        <div
                          key={i}
                          className={cn(
                            "rounded-full transition-all duration-200",
                            isListening ? "bg-primary" : "bg-white/80"
                          )}
                          style={{
                            width: '2px',
                            height: `${baseHeight}px`,
                            animationDuration: `${0.7 + Math.random() * 0.6}s`,
                            animationDelay: `${i * 0.05}s`,
                            transform: `rotate(${i * 30}deg) translateY(-5px)`,
                            transformOrigin: 'bottom',
                            animation: isActive ? 'wave 1.2s infinite ease-in-out' : 'none'
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom audio wave visualization */}
        {(isListening || isSpeaking) && (
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-64 h-16 flex items-center justify-center">
            <div className="flex items-end justify-center gap-1 h-16 w-full">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1.5 rounded-full bg-gradient-to-t",
                    isListening ? "from-primary/70 to-primary/30" : "from-white/70 to-white/30",
                    "animate-[wave_1.2s_ease-in-out_infinite]"
                  )}
                  style={{
                    height: `${
                      Math.sin((i / 16) * Math.PI) * (isListening || isSpeaking ? 24 : 4) + 
                      (isListening || isSpeaking ? Math.random() * 10 : 0)
                    }px`,
                    animationDelay: `${i * 0.05}s`,
                    animationDuration: `${0.7 + Math.random() * 0.6}s`
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
