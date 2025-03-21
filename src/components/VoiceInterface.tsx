
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { RealtimeChat } from '@/utils/audio';
import { Loader2, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VoiceFullscreenOverlay from './voice/VoiceFullscreenOverlay';
import { cn } from '@/lib/utils';

interface VoiceInterfaceProps {
  systemPrompt?: string;
  onSpeakingChange: (speaking: boolean) => void;
  onTranscript?: (text: string) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ 
  systemPrompt,
  onSpeakingChange,
  onTranscript = () => {},
}) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcriptBuffer, setTranscriptBuffer] = useState('');
  const [showFullscreen, setShowFullscreen] = useState(false);
  const chatRef = useRef<RealtimeChat | null>(null);

  const handleMessage = (event: any) => {
    console.log('Received message:', event);
    
    // Handle different event types
    if (event.type === 'response.audio.delta') {
      if (!isSpeaking) {
        setIsSpeaking(true);
        onSpeakingChange(true);
      }
    } else if (event.type === 'response.audio.done') {
      setIsSpeaking(false);
      onSpeakingChange(false);
    } else if (event.type === 'turn_detection.speech_started') {
      setIsListening(true);
      setTranscriptBuffer('');
    } else if (event.type === 'turn_detection.speech_stopped') {
      setIsListening(false);
    }
  };

  const handleTranscript = (text: string) => {
    setTranscriptBuffer(prev => prev + text);
    onTranscript(text);
  };

  const startConversation = async () => {
    setIsConnecting(true);
    try {
      chatRef.current = new RealtimeChat(handleMessage, handleTranscript, systemPrompt);
      await chatRef.current.init();
      setIsConnected(true);
      setShowFullscreen(true);
      
      toast({
        title: "Voice activated",
        description: "I'm listening...",
        className: "bg-primary/10 border-primary",
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to start conversation',
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const endConversation = () => {
    chatRef.current?.disconnect();
    setIsConnected(false);
    setIsSpeaking(false);
    setIsListening(false);
    setShowFullscreen(false);
    onSpeakingChange(false);
    
    toast({
      title: "Voice chat ended",
      description: "Returning to text mode",
    });
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  // Simple button when not connected
  if (!isConnected) {
    return (
      <div className="flex justify-center">
        <Button 
          onClick={startConversation}
          disabled={isConnecting}
          className={cn(
            "rounded-full px-4 shadow-md hover:shadow-lg transition-all animate-fade-in",
            isConnecting ? "bg-muted" : "bg-primary hover:bg-primary/90 hover:scale-105"
          )}
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span className="animate-pulse">Connecting...</span>
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-2" />
              Start Voice Chat
            </>
          )}
        </Button>
      </div>
    );
  }

  // Show fullscreen overlay when in voice mode
  return (
    <>
      {showFullscreen && (
        <VoiceFullscreenOverlay 
          isListening={isListening}
          isSpeaking={isSpeaking}
          onCancel={endConversation}
        />
      )}
    </>
  );
};

export default VoiceInterface;
