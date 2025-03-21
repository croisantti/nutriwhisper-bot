
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Onboarding from "@/components/Onboarding";
import { supabase } from "@/integrations/supabase/client";

const OnboardingPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) return;

      try {
        // Use a raw SQL query to check if user has completed onboarding
        // This is a workaround until the types are updated
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error checking onboarding status:", error);
        }

        // If we have data, user has completed onboarding
        if (data) {
          setHasCompletedOnboarding(true);
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error in checkOnboardingStatus:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading) {
      if (!user) {
        navigate("/login");
      } else {
        checkOnboardingStatus();
      }
    }
  }, [user, loading, navigate]);

  const handleOnboardingComplete = () => {
    // Redirect to dashboard instead of landing page
    navigate("/dashboard");
  };

  if (loading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="loading-dots">Loading</div>
      </div>
    );
  }

  if (hasCompletedOnboarding) {
    return null; // Will redirect in useEffect
  }

  return <Onboarding onComplete={handleOnboardingComplete} />;
};

export default OnboardingPage;
