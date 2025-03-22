
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Leaf, 
  MessageSquare, 
  Utensils, 
  ArrowRight 
} from "lucide-react";

const LandingPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Leaf className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-medium">NutriWhisper</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="default">Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/50 py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex flex-col text-left md:w-1/2 space-y-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary mb-2">
                  <Leaf className="h-6 w-6 text-primary-foreground" />
                </div>
                <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Your Personal Nutrition Companion
                </h1>
                <p className="text-balance text-lg text-muted-foreground md:text-xl">
                  Get personalized nutrition guidance and meal plans tailored to your unique needs and preferences.
                </p>
                <div className="flex flex-row gap-4 pt-2">
                  <Link to="/signup">
                    <Button size="lg" className="gap-2 group">
                      Get Started
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline">Sign In</Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <img
                  src="/lovable-uploads/48a3b789-4f26-44de-9621-c4d8aae7a3bd.png"
                  alt="Peach Fuzz Color Palette"
                  className="max-w-full h-auto rounded-lg shadow-md border border-accent/50"
                />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-20 blur-3xl"></div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-24 bg-secondary/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Smart Nutrition for Everyone
              </h2>
              <p className="max-w-[700px] text-muted-foreground">
                NutriWhisper uses AI to provide personalized nutrition advice tailored to your goals and preferences.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center p-6 bg-card rounded-lg border shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 mb-4">
                  <MessageSquare className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">AI-Powered Coaching</h3>
                <p className="text-muted-foreground text-center">
                  Chat with our nutrition AI for real-time advice and answers to your nutrition questions.
                </p>
              </div>
              <div className="flex flex-col items-center p-6 bg-card rounded-lg border shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 mb-4">
                  <Utensils className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">Personalized Plans</h3>
                <p className="text-muted-foreground text-center">
                  Get customized meal plans and nutrition recommendations based on your dietary preferences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/20 to-accent/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 mb-6">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Begin Your Nutrition Journey Today
              </h2>
              <p className="max-w-[700px] text-muted-foreground mb-8">
                Join thousands of users who have transformed their relationship with food through personalized nutrition guidance.
              </p>
              <Link to="/signup">
                <Button size="lg" className="gap-2">
                  Sign Up Now - It's Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background py-6">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2">
            NutriWhisper provides general nutrition information and is not a substitute for professional medical advice.
          </p>
          <p className="text-xs">
            © {new Date().getFullYear()} NutriWhisper. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
