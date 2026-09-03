"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthProvider";
import { backendApi } from "@/lib/api/backend";
import type { UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function ProfileContent() {
  const { isLoggedIn, isLoading, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState({ watched: 0, favorites: 0, reviews: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    Promise.all([
      backendApi.auth.getProfile(),
      backendApi.interactions.getWatchedCount(),
      backendApi.interactions.getFavoriteCount(),
      backendApi.reviews.getReviewCount(),
    ]).then(([prof, watched, fav, reviews]) => {
      setProfile(prof.data);
      setStats({
        watched: watched.data.count,
        favorites: fav.data.count,
        reviews: reviews.data.reviewCount,
      });
    });
  }, [isLoggedIn, isLoading, router]);

  const changePassword = async () => {
    if (passwords.next !== passwords.confirm) {
      setMsg("Passwords don't match");
      return;
    }
    try {
      await backendApi.auth.changePassword(passwords.current, passwords.next);
      setMsg("Password updated!");
      setShowPassword(false);
    } catch {
      setMsg("Failed to update password");
    }
  };

  if (!profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-zinc-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-8">
      <h1 className="text-3xl font-bold text-white">Profile</h1>

      <div className="glass-card mt-8 space-y-6 p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-zinc-500">Username</p>
            <p className="font-medium text-white">{profile.username}</p>
          </div>
          <div>
            <p className="text-sm text-zinc-500">Email</p>
            <p className="font-medium text-white">{profile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-400">{stats.favorites}</p>
            <p className="text-xs text-zinc-500">Favorites</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-400">{stats.watched}</p>
            <p className="text-xs text-zinc-500">Watched</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-400">{stats.reviews}</p>
            <p className="text-xs text-zinc-500">Reviews</p>
          </div>
        </div>

        {profile.favouriteGenres?.length > 0 && (
          <div>
            <p className="mb-2 text-sm text-zinc-500">Favorite Genres</p>
            <div className="flex flex-wrap gap-2">
              {profile.favouriteGenres.map((g) => (
                <span
                  key={g.id ?? g.name}
                  className="rounded-full bg-indigo-500/20 px-3 py-1 text-sm text-indigo-300"
                >
                  {g.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 border-t border-white/10 pt-6">
          <Button variant="outline" onClick={() => setShowPassword(!showPassword)}>
            Change Password
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            Log Out
          </Button>
        </div>

        {showPassword && (
          <div className="space-y-3 border-t border-white/10 pt-6">
            <Input
              type="password"
              placeholder="Current password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            />
            <Input
              type="password"
              placeholder="New password"
              value={passwords.next}
              onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Confirm password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            />
            <Button onClick={changePassword}>Update Password</Button>
          </div>
        )}
        {msg && <p className="text-sm text-indigo-400">{msg}</p>}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <MainLayout>
      <ProfileContent />
    </MainLayout>
  );
}
