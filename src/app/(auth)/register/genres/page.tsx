"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { backendApi } from "@/lib/api/backend";
import { REGISTRATION_GENRES } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/Button";

export default function RegisterGenresPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const draft = sessionStorage.getItem("mv_register");
    if (!draft) router.replace("/register");
  }, [router]);

  const toggle = (genre: string) => {
    setSelected((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = async () => {
    const draft = sessionStorage.getItem("mv_register");
    if (!draft) return router.replace("/register");
    if (selected.length === 0) return setError("Pick at least one genre");

    setLoading(true);
    try {
      const { username, email, password } = JSON.parse(draft);
      await backendApi.auth.register({
        username,
        email,
        password,
        favoriteGenres: selected,
      });
      const { data } = await backendApi.auth.login({ username, password });
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("username", username);
        sessionStorage.removeItem("mv_register");
        refresh();
        router.push("/");
      }
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card space-y-6 p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Your taste</h1>
        <p className="mt-2 text-zinc-400">Pick genres you love</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {REGISTRATION_GENRES.map((genre) => (
          <button
            key={genre}
            type="button"
            onClick={() => toggle(genre)}
            className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
              selected.includes(genre)
                ? "bg-indigo-500 text-white"
                : "bg-white/5 text-zinc-300 hover:bg-white/10"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {error && <p className="text-center text-sm text-red-400">{error}</p>}

      <Button className="w-full" onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating account..." : "Complete Sign Up"}
      </Button>
    </div>
  );
}
