"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { OtpModal } from "./OtpModel";

export default function SignUpModel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otpOpen, setOtpOpen] = useState(false);

  const handleSignup = async () => {
    if(!email || !username || !password) return;
    const res = await fetch("http://localhost:4000/auth/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setOtpOpen(true);
      onOpenChange(false);
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-black">
          <DialogHeader>
            <DialogTitle className="mb-4 font-semibold text-center">
              Login
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <Button onClick={handleSignup}>Login</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <OtpModal
        open={otpOpen}
        onOpenChange={setOtpOpen}
        email={email}
        username={username}
        password={password}
      />
    </>
  );
}
