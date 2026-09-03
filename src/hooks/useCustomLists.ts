"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "mv_custom_lists";

export interface CustomList {
  id: string;
  name: string;
  movieIds: number[];
  createdAt: number;
}

function readLists(): CustomList[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CustomList[]) : [];
  } catch {
    return [];
  }
}

function writeLists(lists: CustomList[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  window.dispatchEvent(new Event("mv-lists-updated"));
}

export function useCustomLists() {
  const [lists, setLists] = useState<CustomList[]>([]);

  const refresh = useCallback(() => setLists(readLists()), []);

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("mv-lists-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("mv-lists-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [refresh]);

  const createList = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const list: CustomList = {
      id: crypto.randomUUID(),
      name: trimmed,
      movieIds: [],
      createdAt: Date.now(),
    };
    writeLists([list, ...readLists()]);
    return list;
  };

  const deleteList = (id: string) => {
    writeLists(readLists().filter((l) => l.id !== id));
  };

  const toggleMovieInList = (listId: string, movieId: number) => {
    writeLists(
      readLists().map((list) => {
        if (list.id !== listId) return list;
        const has = list.movieIds.includes(movieId);
        return {
          ...list,
          movieIds: has
            ? list.movieIds.filter((id) => id !== movieId)
            : [...list.movieIds, movieId],
        };
      })
    );
  };

  return { lists, createList, deleteList, toggleMovieInList, refresh };
}
