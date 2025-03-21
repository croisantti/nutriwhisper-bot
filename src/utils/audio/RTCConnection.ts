
/**
 * Manages WebRTC connection to OpenAI's Realtime API
 */
export class RTCConnection {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private audioEl: HTMLAudioElement;

  constructor(
    private onMessage: (message: any) => void,
    private onDataChannelOpen: () => void
  ) {
    this.audioEl = document.createElement("audio");
    this.audioEl.autoplay = true;
  }

  /**
   * Initialize WebRTC connection with OpenAI's Realtime API
   */
  async connect(ephemeralToken: string): Promise<void> {
    try {
      // Create peer connection with appropriate configuration
      this.pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      // Set up remote audio
      this.pc.ontrack = e => {
        console.log("Received audio track from OpenAI");
        this.audioEl.srcObject = e.streams[0];
      };

      // Set up data channel
      this.dc = this.pc.createDataChannel("oai-events");
      this.dc.onopen = () => {
        console.log("Data channel opened");
        this.onDataChannelOpen();
      };
      this.dc.addEventListener("message", (e) => {
        const event = JSON.parse(e.data);
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
          Authorization: `Bearer ${ephemeralToken}`,
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
    } catch (error) {
      console.error("Error establishing WebRTC connection:", error);
      throw error;
    }
  }

  /**
   * Add track to the peer connection
   */
  addTrack(track: MediaStreamTrack, stream: MediaStream): void {
    if (this.pc) {
      this.pc.addTrack(track, stream);
    }
  }

  /**
   * Send data through the data channel
   */
  sendData(data: any): void {
    if (this.dc?.readyState === 'open') {
      this.dc.send(JSON.stringify(data));
    } else {
      console.warn("Data channel not ready");
    }
  }

  /**
   * Close the WebRTC connection
   */
  close(): void {
    this.dc?.close();
    this.pc?.close();
  }

  /**
   * Check if data channel is ready
   */
  get isReady(): boolean {
    return this.dc?.readyState === 'open';
  }
}
