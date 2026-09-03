"use client";

import { useState } from "react";
import { ListPlus, Check } from "lucide-react";
import { useCustomLists } from "@/hooks/useCustomLists";
import { Button } from "@/components/ui/Button";

interface Props {
  movieId: number;
}

export function AddToListButton({ movieId }: Props) {
  const { lists, createList, toggleMovieInList } = useCustomLists();
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const handleCreate = () => {
    const list = createList(newName);
    if (list) {
      toggleMovieInList(list.id, movieId);
      setNewName("");
    }
  };

  return (
    <div className="relative">
      <Button variant="outline" onClick={() => setOpen((v) => !v)}>
        <ListPlus className="h-4 w-4" />
        My Lists
      </Button>
      {open && (
        <div className="absolute left-0 z-30 mt-2 w-64 rounded-2xl border border-white/10 bg-[#0c0c18] p-3 shadow-xl">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
            Save to list
          </p>
          <div className="max-h-48 space-y-1 overflow-y-auto">
            {lists.length === 0 && (
              <p className="px-2 py-3 text-sm text-zinc-500">No lists yet</p>
            )}
            {lists.map((list) => {
              const inList = list.movieIds.includes(movieId);
              return (
                <button
                  key={list.id}
                  type="button"
                  onClick={() => toggleMovieInList(list.id, movieId)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-zinc-200 transition hover:bg-white/5"
                >
                  <span>
                    {list.name}{" "}
                    <span className="text-zinc-500">({list.movieIds.length})</span>
                  </span>
                  {inList && <Check className="h-4 w-4 text-indigo-400" />}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex gap-2 border-t border-white/10 pt-3">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New list name"
              className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-white outline-none focus:border-indigo-500/50"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <Button onClick={handleCreate} className="px-3 py-1.5 text-sm">
              Add
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
