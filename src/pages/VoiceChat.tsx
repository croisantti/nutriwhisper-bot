import React, { useState } from "react";
import { Leaf, Volume2 } from "lucide-react";
import VoiceInterface from "@/components/VoiceInterface";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
const VoiceChat = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  return <div className="flex flex-col h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      
      <main className="flex-1 overflow-hidden">
        <div className="container h-full px-4 py-6 md:py-8">
          <div className="flex flex-col h-full overflow-hidden rounded-2xl border shadow-sm">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Voice Chat</h2>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  BETA
                </Badge>
                
                {isSpeaking && <Badge variant="outline" className="bg-green-500/10 text-green-500 animate-pulse flex items-center gap-1">
                    <Volume2 className="h-3 w-3" />
                    Speaking
                  </Badge>}
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6">
              <div className="max-w-md w-full">
                <div className="text-center mb-8">
                  <h3 className="text-lg font-medium mb-2">Have a conversation with Yummi</h3>
                  <p className="text-muted-foreground">
                    This feature uses AI to have a natural voice conversation about nutrition.
                    Just click the button to start talking.
                  </p>
                </div>

                <VoiceInterface onSpeakingChange={setIsSpeaking} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-background py-4">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>
            NutriWhisper voice interface is in beta. Results may vary.
          </p>
        </div>
      </footer>
    </div>;
};
export default VoiceChat;