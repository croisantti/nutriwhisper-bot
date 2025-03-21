
import React from 'react';
import { X, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in">
      {/* Abstract waveform visualization */}
      <div className="relative w-48 h-48 mb-8">
        <div className={`absolute inset-0 rounded-full bg-white/10 ${isListening ? 'animate-pulse' : ''}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            {isListening && (
              <div className="w-40 h-40 rounded-full bg-white/5"></div>
            )}
            <div className={`w-32 h-32 rounded-full ${isSpeaking ? 'bg-primary/20 animate-pulse' : 'bg-white/10'}`}></div>
            <div className="w-24 h-24 rounded-full bg-white/20"></div>
            <div className="w-16 h-16 rounded-full bg-white/40"></div>
          </div>
        </div>
      </div>
      
      {/* Status text */}
      <p className="text-white/70 text-sm mb-12">
        {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Tap to cancel'}
      </p>
      
      {/* Cancel button */}
      <Button 
        variant="destructive" 
        size="icon" 
        className="rounded-full w-12 h-12 mb-8" 
        onClick={onCancel}
      >
        <X className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default VoiceFullscreenOverlay;
