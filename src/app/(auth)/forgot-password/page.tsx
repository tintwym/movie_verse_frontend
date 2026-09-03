"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { backendApi } from "@/lib/api/backend";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await backendApi.auth.verifyUser(username, email);
      if (!data.resetToken) {
        setError("If that account exists, check your details and try again.");
        return;
      }
      setResetToken(data.resetToken);
      setStep(2);
    } catch {
      setError("Could not start password reset. Try again.");
    }
  };

  const reset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!PASSWORD_REGEX.test(newPassword)) {
      setError(
        "Password needs uppercase, lowercase, number, and special character (8+ chars)."
      );
      return;
    }
    try {
      await backendApi.auth.resetPasswordAuth(
        username,
        email,
        newPassword,
        resetToken
      );
      setMessage("Password reset! Redirecting...");
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      setError("Reset failed. Token may be expired — start over.");
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
          {step === 1 ? "Continue" : "Reset Password"}
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
