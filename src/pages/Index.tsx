
import React from "react";
import { Leaf } from "lucide-react";
import ChatContainer from "@/components/ChatContainer";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-secondary/20">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-medium">NutriWhisper</span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <div className="container flex flex-1 flex-col px-4 py-6 md:py-8">
          <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border shadow-sm">
            <ChatContainer />
          </div>
        </div>
      </main>

      <footer className="border-t bg-background py-6">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>
            NutriWhisper provides general nutrition information and is not a substitute for professional medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
