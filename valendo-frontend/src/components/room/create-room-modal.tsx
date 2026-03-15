"use client";

import { useState, type FormEvent } from "react";
import { Loader2, X, Sparkles, Repeat, Users, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateRoomPayload } from "@/types";

interface CreateRoomModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateRoomPayload) => Promise<void>;
}

const THEMES = [
  { name: "Ciencia", emoji: "🔬" },
  { name: "Historia", emoji: "📜" },
  { name: "Tecnologia", emoji: "💻" },
  { name: "Geografia", emoji: "🌍" },
  { name: "Esportes", emoji: "⚽" },
  { name: "Cultura Pop", emoji: "🎬" },
  { name: "Matematica", emoji: "📐" },
  { name: "Natureza", emoji: "🌿" },
];

export function CreateRoomModal({ open, onClose, onCreate }: CreateRoomModalProps) {
  const [theme, setTheme] = useState(THEMES[0].name);
  const [rounds, setRounds] = useState(5);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onCreate({ theme, rounds, maxPlayers, isPrivate });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar sala.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-md">
      <div className="gradient-border w-full max-w-lg rounded-2xl bg-card/95 backdrop-blur-xl neon-glow-magenta-strong">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neon-magenta/10 neon-glow-magenta">
                <Sparkles className="h-6 w-6 text-neon-magenta" />
              </div>
              <h2 className="text-2xl font-bold">Criar Sala</h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Theme grid */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Tema</Label>
              <div className="grid grid-cols-4 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => setTheme(t.name)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-xs font-medium transition-all ${
                      theme === t.name
                        ? "border-neon-magenta bg-neon-magenta/10 text-neon-magenta neon-glow-magenta"
                        : "border-border/30 bg-background/40 text-muted-foreground hover:border-border/60 hover:bg-background/60"
                    }`}
                  >
                    <span className="text-xl">{t.emoji}</span>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Rounds + players */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rounds" className="flex items-center gap-2 text-sm font-medium">
                  <Repeat className="h-4 w-4 text-neon-magenta/60" />
                  Rodadas
                </Label>
                <Input
                  id="rounds"
                  type="number"
                  min={1}
                  max={20}
                  value={rounds}
                  onChange={(e) => setRounds(Number(e.target.value))}
                  className="h-12 rounded-xl border-border/40 bg-background/60 text-center text-lg font-bold focus-visible:ring-2 focus-visible:ring-neon-magenta/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxPlayers" className="flex items-center gap-2 text-sm font-medium">
                  <Users className="h-4 w-4 text-neon-magenta/60" />
                  Max Jogadores
                </Label>
                <Input
                  id="maxPlayers"
                  type="number"
                  min={2}
                  max={10}
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  className="h-12 rounded-xl border-border/40 bg-background/60 text-center text-lg font-bold focus-visible:ring-2 focus-visible:ring-neon-magenta/50"
                />
              </div>
            </div>

            {/* Private toggle */}
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/30 bg-background/40 px-4 py-3.5 transition-colors hover:bg-background/60">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <span className="text-sm font-medium">Sala privada</span>
                <p className="text-xs text-muted-foreground">Apenas por codigo de convite</p>
              </div>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="h-5 w-5 rounded accent-neon-magenta"
              />
            </label>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="h-13 w-full rounded-xl bg-neon-magenta text-base font-bold tracking-wide text-white shadow-[0_0_20px_#ff00e533] transition-all hover:bg-neon-magenta/90 hover:shadow-[0_0_30px_#ff00e555]"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Criar Sala
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
