"use client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useState } from "react";
import LoginModel from "@/components/auth/LoginModel";

export default function Home() {
  const [login, setLogin] = useState(true);
  const handleGoogle = () => {
    window.location.href = "http://localhost:4000/auth/google";
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white 
    dark:bg-black text-black dark:text-white transition-all duration 300"
    >
      <div className="max-w-3xl text-center space-y-10">
        <h1 className="text-6xl font-semibold">Collab Learn</h1>
        <p>
          Join thousands of students in interactive study groups, access premium
          tutorials, and collaborate in real-time with video calls and screen
          sharing.
        </p>
        <div className="space-x-2">
          <Button onClick={() => setLogin(true)}>Login</Button>
          <Button variant="secondary"> Sign Up</Button>
          <Button variant="secondary" onClick={handleGoogle}>Google</Button>
        </div>
        <ThemeToggle />
        <LoginModel open={login} onOpenChange={setLogin} />
      </div>
    </div>
  );
}
