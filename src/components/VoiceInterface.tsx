
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { RealtimeChat } from '@/utils/audio';
import VoiceStatusIndicators from './voice/VoiceStatusIndicators';
import TranscriptDisplay from './voice/TranscriptDisplay';
import VoiceControlButtons from './voice/VoiceControlButtons';

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
      
      toast({
        title: "Connected",
        description: "Voice interface is ready",
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
    onSpeakingChange(false);
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      {isConnecting && (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Connecting...</span>
        </div>
      )}
      
      {isConnected && (
        <div className="flex flex-col items-center gap-2">
          <VoiceStatusIndicators 
            isSpeaking={isSpeaking} 
            isListening={isListening} 
          />
          
          <TranscriptDisplay 
            transcript={transcriptBuffer} 
            visible={isConnected} 
          />
        </div>
      )}
      
      <VoiceControlButtons 
        isConnected={isConnected}
        isConnecting={isConnecting}
        onStartConversation={startConversation}
        onEndConversation={endConversation}
      />
    </div>
  );
};

export default VoiceInterface;
