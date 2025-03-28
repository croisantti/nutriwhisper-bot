
import React from "react";
import ChatContainer from "@/components/ChatContainer";
import Navbar from "@/components/Navbar";

const Index = () => {
  return <div className="flex flex-col h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />

      <main className="flex-1 overflow-hidden">
        <div className="container h-full px-4 py-6 md:py-8">
          <div className="flex flex-col h-full overflow-hidden rounded-2xl border shadow-sm">
            <ChatContainer />
          </div>
        </div>
      </main>

      <footer className="border-t bg-background py-4">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>
            Yummi provides general nutrition information and is not a substitute for professional medical advice.
          </p>
        </div>
      </footer>
    </div>;
};
export default Index;
