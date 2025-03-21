
/**
 * Manages session configuration and message handling
 */
export class SessionManager {
  private isSessionCreated = false;

  constructor(
    private sendData: (data: any) => void,
    private onSessionCreated?: () => void
  ) {}

  /**
   * Handle incoming messages from OpenAI
   */
  handleMessage(event: any): void {
    // Check for session creation event
    if (event.type === "session.created" && !this.isSessionCreated) {
      console.log("Session created, configuring session");
      this.configureSession();
      this.isSessionCreated = true;
      this.onSessionCreated?.();
    }
  }

  /**
   * Configure the session with desired settings
   */
  configureSession(): void {
    this.sendData({
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
    });
    console.log("Session configuration sent");
  }

  /**
   * Send a text message to the AI
   */
  sendTextMessage(text: string): void {
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

    this.sendData(event);
    this.sendData({type: 'response.create'});
  }
}
