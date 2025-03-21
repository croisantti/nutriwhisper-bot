
import { supabase } from "@/integrations/supabase/client";
import { AudioRecorder } from "./AudioRecorder";
import { encodeAudioData } from "./AudioUtils";

/**
 * Manages WebRTC connection with OpenAI's Realtime API
 */
export class RealtimeChat {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private audioEl: HTMLAudioElement;
  private recorder: AudioRecorder | null = null;
  private systemPrompt: string;

  constructor(
    private onMessage: (message: any) => void,
    private onTranscript: (text: string) => void,
    systemPrompt?: string
  ) {
    this.audioEl = document.createElement("audio");
    this.audioEl.autoplay = true;
    this.systemPrompt = systemPrompt || '';
  }

  async init() {
    try {
      // Get ephemeral token from our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("realtime-chat", {
        body: { instructions: this.systemPrompt }
      });
      
      if (error) {
        throw new Error(`Failed to get ephemeral token: ${error.message}`);
      }
      
      if (!data.client_secret?.value) {
        throw new Error("Failed to get valid ephemeral token");
      }

      const EPHEMERAL_KEY = data.client_secret.value;
      console.log("Got ephemeral token successfully");

      // Create peer connection with appropriate configuration
      this.pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      // Add audio track to the peer connection
      // This is critical for the SDP negotiation to include an audio section
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getAudioTracks().forEach(track => {
        console.log("Adding audio track to peer connection");
        this.pc.addTrack(track, stream);
      });

      // Set up remote audio
      this.pc.ontrack = e => {
        console.log("Received audio track from OpenAI");
        this.audioEl.srcObject = e.streams[0];
      };

      // Set up data channel
      this.dc = this.pc.createDataChannel("oai-events");
      this.dc.onopen = () => console.log("Data channel opened");
      this.dc.addEventListener("message", (e) => {
        const event = JSON.parse(e.data);
        console.log("Received event:", event);
        
        if (event.type === "response.audio_transcript.delta" && event.delta) {
          this.onTranscript(event.delta);
        }
        
        this.onMessage(event);
      });

      // Create and set local description
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      // Verify that the offer includes an audio section
      console.log("SDP offer contains audio:", offer.sdp?.includes('m=audio'));

      // Connect to OpenAI's Realtime API
      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp"
        },
      });

      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text();
        throw new Error(`SDP negotiation failed: ${errorText}`);
      }

      const answer = {
        type: "answer" as RTCSdpType,
        sdp: await sdpResponse.text(),
      };
      
      await this.pc.setRemoteDescription(answer);
      console.log("WebRTC connection established");

      // Wait for session.created event before configuring
      const sessionCreatedPromise = new Promise<void>((resolve) => {
        const originalOnMessage = this.dc!.onmessage;
        
        this.dc!.onmessage = (e) => {
          const event = JSON.parse(e.data);
          if (event.type === "session.created") {
            console.log("Session created, configuring session");
            this.configureSession();
            resolve();
            
            // Restore original handler
            if (originalOnMessage) {
              this.dc!.onmessage = originalOnMessage;
            }
          }
          
          // Still call the handler we set up earlier
          if (originalOnMessage) {
            originalOnMessage.call(this.dc, e);
          }
        };
      });

      // Wait for session to be created before starting recorder
      await sessionCreatedPromise;

      // Start recording
      this.recorder = new AudioRecorder((audioData) => {
        if (this.dc?.readyState === 'open') {
          this.dc.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encodeAudioData(audioData)
          }));
        }
      });
      await this.recorder.start();
      console.log("Audio recorder started");

    } catch (error) {
      console.error("Error initializing chat:", error);
      throw error;
    }
  }

  private configureSession() {
    if (!this.dc || this.dc.readyState !== 'open') return;
    
    this.dc.send(JSON.stringify({
      type: "session.update",
      session: {
        modalities: ["text", "audio"],
        input_audio_format: "pcm16",
        output_audio_format: "pcm16",
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 1000
        }
      }
    }));
    console.log("Session configuration sent");
  }

  async sendTextMessage(text: string) {
    if (!this.dc || this.dc.readyState !== 'open') {
      throw new Error('Data channel not ready');
    }

    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text
          }
        ]
      }
    };

    this.dc.send(JSON.stringify(event));
    this.dc.send(JSON.stringify({type: 'response.create'}));
  }

  disconnect() {
    console.log("Disconnecting from Realtime API");
    this.recorder?.stop();
    this.dc?.close();
    this.pc?.close();
  }
}
