"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthProvider";
import { backendApi } from "@/lib/api/backend";
import type { AdminReview, AdminUser } from "@/lib/types";
import { Button } from "@/components/ui/Button";

export default function AdminPage() {
  const { isLoggedIn, isAdmin, isLoading } = useAuth();
  const [stats, setStats] = useState({ userCount: 0, reviewCount: 0 });
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!isLoggedIn || !isAdmin) return;
    setBusy(true);
    setError("");
    try {
      const [s, u, r] = await Promise.all([
        backendApi.admin.stats(),
        backendApi.admin.users(),
        backendApi.admin.reviews(),
      ]);
      setStats(s.data);
      setUsers(u.data);
      setReviews(r.data);
    } catch {
      setError("Could not load admin data. Check that your account has Admin role.");
    } finally {
      setBusy(false);
    }
  }, [isLoggedIn, isAdmin]);

  useEffect(() => {
    if (!isLoading) load();
  }, [isLoading, load]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-6xl px-4 py-16 text-zinc-400">Loading…</div>
      </MainLayout>
    );
  }

  if (!isLoggedIn || !isAdmin) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-16">
          <h1 className="text-2xl font-bold text-white">Admin</h1>
          <p className="text-zinc-400">
            Admin access required. Sign in with an admin account (seeded as{" "}
            <code className="text-indigo-300">admin</code> /{" "}
            <code className="text-indigo-300">admin123</code>).
          </p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin dashboard</h1>
          <p className="mt-1 text-sm text-zinc-400">Manage users and community reviews</p>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-zinc-400">Users</p>
            <p className="mt-1 text-3xl font-bold text-white">{stats.userCount}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-zinc-400">Reviews</p>
            <p className="mt-1 text-3xl font-bold text-white">{stats.reviewCount}</p>
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Users</h2>
            <Button size="sm" variant="secondary" onClick={load} disabled={busy}>
              Refresh
            </Button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-white/5 text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Username</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-white/5">
                    <td className="px-4 py-3 text-white">{u.username}</td>
                    <td className="px-4 py-3 text-zinc-400">{u.email}</td>
                    <td className="px-4 py-3 text-zinc-300">{u.role}</td>
                    <td className="px-4 py-3 text-right">
                      {u.role !== "Admin" && (
                        <button
                          type="button"
                          className="text-xs text-red-400 hover:text-red-300"
                          onClick={async () => {
                            if (!confirm(`Delete user ${u.username}?`)) return;
                            await backendApi.admin.deleteUser(u.id);
                            await load();
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Reviews</h2>
          <ul className="divide-y divide-white/5 rounded-xl border border-white/10">
            {reviews.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-zinc-500">No reviews</li>
            ) : (
              reviews.map((r) => (
                <li
                  key={`${r.userId}-${r.tmdbMovieId}`}
                  className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div>
                    <p className="text-sm text-white">
                      <span className="font-medium">{r.username}</span>
                      <span className="text-zinc-500"> · movie {r.tmdbMovieId}</span>
                      {r.edited && (
                        <span className="ml-2 text-xs text-indigo-400">edited</span>
                      )}
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">{r.reviewText}</p>
                  </div>
                  {r.userId && (
                    <button
                      type="button"
                      className="flex-shrink-0 text-xs text-red-400 hover:text-red-300"
                      onClick={async () => {
                        if (!confirm("Delete this review?")) return;
                        await backendApi.admin.deleteReview(r.userId!, r.tmdbMovieId);
                        await load();
                      }}
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </MainLayout>
  );
}
