"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function OtpModal({
  open,
  onOpenChange,
  email,
  username,
  password,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  email: string;
  username: string;
  password: string;
}) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length < 6) {
      alert("Please enter the complete OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ⬅ important for session cookie
        body: JSON.stringify({ email, otp, username, password }),
      });

      if (res.ok) {
        onOpenChange(false);
      window.location.href = "/status";
      } else {
        const data = await res.json();
        alert(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md space-y-6">
        <DialogHeader>
          <DialogTitle>Verify OTP</DialogTitle>
        </DialogHeader>

        <p className="text-center text-sm text-muted-foreground">
          Enter the 6-digit OTP sent to{" "}
          <span className="font-medium">{email}</span>
        </p>

        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            pattern="[0-9]*" // only numbers
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button onClick={handleVerify} disabled={loading} className="w-full">
          {loading ? "Verifying..." : "Submit"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
