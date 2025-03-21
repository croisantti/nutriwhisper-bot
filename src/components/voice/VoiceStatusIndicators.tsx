
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface VoiceStatusIndicatorsProps {
  isSpeaking: boolean;
  isListening: boolean;
}

const VoiceStatusIndicators: React.FC<VoiceStatusIndicatorsProps> = ({ 
  isSpeaking, 
  isListening 
}) => {
  if (!isSpeaking && !isListening) return null;
  
  return (
    <div className="flex items-center gap-2">
      {isSpeaking && (
        <Badge variant="outline" className="bg-green-500/10 text-green-500 animate-pulse">
          AI Speaking
        </Badge>
      )}
      {isListening && (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 animate-pulse">
          Listening...
        </Badge>
      )}
    </div>
  );
};

export default VoiceStatusIndicators;
