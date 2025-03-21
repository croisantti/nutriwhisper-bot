
import { useState, useRef, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useAudioRecorder = () => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    audioChunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Error",
        description: "Could not access your microphone. Please check your browser permissions.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopRecording = useCallback(async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current || !isRecording) {
        reject("Not recording");
        return;
      }

      setIsProcessing(true);
      
      mediaRecorderRef.current.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Convert to base64
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            try {
              const base64data = reader.result?.toString().split(',')[1];
              
              if (!base64data) {
                throw new Error("Failed to convert audio to base64");
              }
              
              // Call voice-to-text function
              const { data, error } = await supabase.functions.invoke('voice-to-text', {
                body: { audio: base64data }
              });
              
              if (error) throw new Error(error.message);
              
              if (data?.text) {
                resolve(data.text);
              } else {
                throw new Error("No transcription received");
              }
            } catch (e) {
              console.error('Error processing audio:', e);
              reject(e);
            } finally {
              setIsProcessing(false);
            }
          };
        } catch (e) {
          console.error('Error processing audio recording:', e);
          setIsProcessing(false);
          reject(e);
        }
      };
      
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks in the stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    });
  }, [isRecording]);

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording
  };
};
