"use client";

import { useEffect, useState } from "react";
import { UserPlus, UserMinus } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";
import { backendApi } from "@/lib/api/backend";
import { Button } from "@/components/ui/Button";

interface Props {
  personId: number;
  personName: string;
  profilePath?: string | null;
}

export function FollowPersonButton({ personId, personName, profilePath }: Props) {
  const { isLoggedIn } = useAuth();
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      setFollowing(false);
      return;
    }
    backendApi.follows
      .status(personId)
      .then((res) => setFollowing(res.data.following))
      .catch(() => setFollowing(false));
  }, [isLoggedIn, personId]);

  const toggle = async () => {
    if (!isLoggedIn) {
      setHint("Sign in to follow actors");
      return;
    }
    setBusy(true);
    try {
      if (following) {
        await backendApi.follows.unfollow(personId);
        setFollowing(false);
      } else {
        await backendApi.follows.follow({
          tmdbPersonId: personId,
          personName,
          profilePath,
        });
        setFollowing(true);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button size="sm" variant={following ? "secondary" : "primary"} onClick={toggle} disabled={busy}>
        {following ? (
          <>
            <UserMinus className="mr-2 h-4 w-4" /> Unfollow
          </>
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" /> Follow
          </>
        )}
      </Button>
      {hint && <p className="text-xs text-amber-400">{hint}</p>}
    </div>
  );
}
