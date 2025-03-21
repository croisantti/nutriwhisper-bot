
import { supabase } from "@/integrations/supabase/client";
import { AudioRecorder } from "./AudioRecorder";
import { encodeAudioData } from "./AudioUtils";
import { RTCConnection } from "./RTCConnection";
import { SessionManager } from "./SessionManager";

/**
 * Manages WebRTC connection with OpenAI's Realtime API
 */
export class RealtimeChat {
  private rtcConnection: RTCConnection | null = null;
  private sessionManager: SessionManager | null = null;
  private recorder: AudioRecorder | null = null;
  private systemPrompt: string;

  constructor(
    private onMessage: (message: any) => void,
    private onTranscript: (text: string) => void,
    systemPrompt?: string
  ) {
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

      // Initialize WebRTC connection
      this.rtcConnection = new RTCConnection(
        this.handleMessage.bind(this),
        this.onDataChannelOpen.bind(this)
      );

      // Add session manager
      this.sessionManager = new SessionManager(
        (data) => this.rtcConnection?.sendData(data),
        this.onSessionCreated.bind(this)
      );

      // Initialize audio recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getAudioTracks().forEach(track => {
        console.log("Adding audio track to peer connection");
        this.rtcConnection.addTrack(track, stream);
      });

      // Connect to OpenAI
      await this.rtcConnection.connect(EPHEMERAL_KEY);

    } catch (error) {
      console.error("Error initializing chat:", error);
      throw error;
    }
  }

  private handleMessage(event: any) {
    // Forward session events to the session manager
    this.sessionManager?.handleMessage(event);
    
    // Extract transcript from relevant events
    if (event.type === "response.audio_transcript.delta" && event.delta) {
      this.onTranscript(event.delta);
    }
    
    // Forward all events to the client
    this.onMessage(event);
  }

  private onDataChannelOpen() {
    console.log("Data channel opened, ready for communication");
  }

  private onSessionCreated() {
    // Start recording once session is created and configured
    this.startRecording();
  }

  private async startRecording() {
    this.recorder = new AudioRecorder((audioData) => {
      if (this.rtcConnection?.isReady) {
        this.rtcConnection.sendData({
          type: 'input_audio_buffer.append',
          audio: encodeAudioData(audioData)
        });
      }
    });
    await this.recorder.start();
    console.log("Audio recorder started");
  }

  async sendTextMessage(text: string) {
    if (!this.rtcConnection?.isReady) {
      throw new Error('Connection not ready');
    }
    this.sessionManager?.sendTextMessage(text);
  }

  disconnect() {
    console.log("Disconnecting from Realtime API");
    this.recorder?.stop();
    this.rtcConnection?.close();
  }
}
