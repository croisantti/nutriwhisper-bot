
import React from "react";
import Navbar from "@/components/Navbar";
import ProfileForm from "@/components/profile/ProfileForm";
import { Leaf } from "lucide-react";

const ProfilePage: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="container py-8 max-w-4xl mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Leaf className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Update your nutrition preferences and goals</p>
          </div>
        </div>
        
        <ProfileForm />
      </div>
    </>
  );
};

export default ProfilePage;
