"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Film } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!PASSWORD_REGEX.test(password)) {
      setError(
        "Password needs uppercase, lowercase, number, and special character (8+ chars)."
      );
      return;
    }
    sessionStorage.setItem(
      "mv_register",
      JSON.stringify({ username, email })
    );
    // Keep password only in memory for this navigation hop via sessionStorage is worse;
    // use a short-lived in-memory handoff on window.
    (window as unknown as { __mv_reg_pw?: string }).__mv_reg_pw = password;
    router.push("/register/genres");
  };

  return (
    <div className="glass-card space-y-8 p-8">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600">
          <Film className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Create account</h1>
        <p className="mt-2 text-zinc-400">Join MovieVerse today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</p>
        )}
        <div>
          <label className="mb-1.5 block text-sm text-zinc-400">Username</label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={5}
            pattern="[A-Za-z0-9]{5,}"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-zinc-400">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-zinc-400">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>

      <p className="text-center text-sm text-zinc-500">
        Have an account?{" "}
        <Link href="/login" className="font-medium text-indigo-400">
          Sign in
        </Link>
      </p>
    </div>
  );
}
