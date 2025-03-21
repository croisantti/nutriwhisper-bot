
import React from 'react';

interface TranscriptDisplayProps {
  transcript: string;
  visible: boolean;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ 
  transcript,
  visible
}) => {
  if (!visible || !transcript) return null;
  
  return (
    <div className="text-sm text-muted-foreground italic max-w-sm overflow-hidden text-ellipsis">
      Heard: "{transcript}"
    </div>
  );
};

export default TranscriptDisplay;
