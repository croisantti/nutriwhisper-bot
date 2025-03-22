
import React from "react";
import { OnboardingForm } from "./onboarding/OnboardingForm";

type OnboardingProps = {
  onComplete: () => void;
};

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to Yummi!</h1>
          <p className="text-muted-foreground mt-2">
            Let's personalize your experience with a few quick questions
          </p>
        </div>

        <div className="bg-card p-6 shadow-md rounded-lg">
          <OnboardingForm onComplete={onComplete} />
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
