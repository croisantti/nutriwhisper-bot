
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useTextToSpeech = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const speak = async (text: string, voice: string = 'alloy') => {
    if (!text) return;

    try {
      setIsLoading(true);
      
      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice }
      });
      
      if (error) throw new Error(error.message);
      
      if (data?.audioContent) {
        // Create audio element if it doesn't exist
        let audio = audioElement;
        if (!audio) {
          audio = new Audio();
          setAudioElement(audio);
          
          audio.onended = () => {
            setIsPlaying(false);
          };
        }
        
        // Set the source to a data URL with the base64 encoded audio
        audio.src = `data:audio/mp3;base64,${data.audioContent}`;
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Text-to-speech error:", error);
      toast({
        title: "Error",
        description: "Failed to convert text to speech",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stop = () => {
    if (audioElement && !audioElement.paused) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return {
    speak,
    stop,
    isLoading,
    isPlaying
  };
};
