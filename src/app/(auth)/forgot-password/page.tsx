"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { backendApi } from "@/lib/api/backend";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await backendApi.auth.verifyUser(username, email);
      setStep(2);
    } catch {
      setError("Invalid username or email");
    }
  };

  const reset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await backendApi.auth.resetPassword(username, email, newPassword);
      setMessage("Password reset! Redirecting...");
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      setError("Reset failed");
    }
  };

  return (
    <div className="glass-card space-y-6 p-8">
      <h1 className="text-center text-2xl font-bold text-white">
        {step === 1 ? "Forgot password" : "New password"}
      </h1>

      <form onSubmit={step === 1 ? verify : reset} className="space-y-4">
        {step === 1 ? (
          <>
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </>
        ) : (
          <Input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        )}
        {error && <p className="text-sm text-red-400">{error}</p>}
        {message && <p className="text-sm text-green-400">{message}</p>}
        <Button type="submit" className="w-full">
          {step === 1 ? "Verify" : "Reset Password"}
        </Button>
      </form>

      <p className="text-center text-sm text-zinc-500">
        <Link href="/login" className="text-indigo-400">
          Back to login
        </Link>
      </p>
    </div>
  );
}
