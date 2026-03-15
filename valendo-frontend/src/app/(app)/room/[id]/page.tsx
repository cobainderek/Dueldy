"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useSocketContext } from "@/contexts/socket-context";
import { Button } from "@/components/ui/button";
import { PlayerList } from "@/components/room/player-list";
import { ConnectionStatus } from "@/components/room/connection-status";
import { mockGetRoom, mockToggleReady, mockLeaveRoom } from "@/lib/mock-rooms";
import type { Room } from "@/types";
import {
  ArrowLeft,
  Copy,
  Check,
  Loader2,
  Swords,
  Users,
  Repeat,
  Play,
  Shield,
  Lock,
} from "lucide-react";

export default function RoomLobbyPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { status: socketStatus } = useSocketContext();
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const fetchRoom = useCallback(async () => {
    try {
      const data = await mockGetRoom(id);
      setRoom(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar sala.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRoom();
  }, [fetchRoom]);

  async function handleToggleReady() {
    if (!user) return;
    const updated = await mockToggleReady(id, user.id);
    setRoom(updated);
  }

  async function handleLeave() {
    if (!user) return;
    await mockLeaveRoom(id, user.id);
    router.push("/dashboard");
  }

  function handleCopyCode() {
    if (!room) return;
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-32">
        <Loader2 className="h-10 w-10 animate-spin text-neon-cyan" />
        <span className="font-mono text-sm text-muted-foreground">Entrando na sala...</span>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="flex flex-col items-center gap-6 py-32">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10">
          <Swords className="h-10 w-10 text-destructive" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-destructive">{error || "Sala nao encontrada."}</p>
          <p className="mt-1 text-sm text-muted-foreground">A sala pode ter sido encerrada</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
          className="gap-2 rounded-xl"
        >
          <ArrowLeft className="h-5 w-5" />
          Voltar ao Dashboard
        </Button>
      </div>
    );
  }

  const currentPlayer = room.players.find((p) => p.id === user?.id);
  const isOwner = room.owner === user?.id;
  const allReady = room.players.every((p) => p.isReady);
  const canStart = isOwner && allReady && room.players.length >= 2;

  return (
    <div className="mx-auto max-w-2xl space-y-8 pt-4">
      {/* Back + connection status */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleLeave}
          className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
          Sair da sala
        </button>
        <ConnectionStatus status={socketStatus} />
      </div>

      {/* Room header card */}
      <div className="gradient-border overflow-hidden rounded-2xl bg-card/80 backdrop-blur-xl neon-glow-cyan-strong">
        {/* Top gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-cyan" />

        <div className="p-8">
          {/* Title row */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neon-cyan/10 neon-glow-cyan">
                <Swords className="h-8 w-8 text-neon-cyan" />
              </div>
              <div>
                <h1 className="text-2xl font-black">{room.theme}</h1>
                <div className="mt-1 flex items-center gap-1.5">
                  {room.isPrivate && <Lock className="h-3.5 w-3.5 text-neon-magenta" />}
                  <span className="text-sm text-muted-foreground">
                    {room.isPrivate ? "Sala privada" : "Sala publica"}
                  </span>
                </div>
              </div>
            </div>

            {/* Code badge */}
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-2.5 rounded-xl border border-neon-cyan/20 bg-neon-cyan/[0.06] px-4 py-2.5 font-mono text-base font-bold tracking-[0.25em] text-neon-cyan transition-all hover:border-neon-cyan/40 hover:bg-neon-cyan/10"
            >
              {room.code}
              {copied ? (
                <Check className="h-5 w-5 text-neon-green" />
              ) : (
                <Copy className="h-5 w-5 opacity-60" />
              )}
            </button>
          </div>

          {/* Stats row */}
          <div className="mt-6 flex gap-6">
            <div className="flex items-center gap-2.5 rounded-xl bg-secondary/50 px-4 py-2.5">
              <Repeat className="h-5 w-5 text-neon-cyan" />
              <div>
                <p className="text-xs text-muted-foreground">Rodadas</p>
                <p className="text-lg font-bold">{room.rounds}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-secondary/50 px-4 py-2.5">
              <Users className="h-5 w-5 text-neon-magenta" />
              <div>
                <p className="text-xs text-muted-foreground">Jogadores</p>
                <p className="text-lg font-bold">
                  {room.players.length}
                  <span className="text-sm font-normal text-muted-foreground">/{room.maxPlayers}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Players section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <Shield className="h-5 w-5 text-neon-cyan/60" />
          <h2 className="text-base font-semibold text-muted-foreground">Jogadores na sala</h2>
        </div>
        <PlayerList players={room.players} ownerId={room.owner} />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        {currentPlayer && (
          <Button
            onClick={handleToggleReady}
            className={`h-14 flex-1 gap-2.5 rounded-xl text-base font-bold transition-all ${
              currentPlayer.isReady
                ? "border-2 border-border/40 bg-secondary/50 text-foreground hover:bg-secondary/70"
                : "bg-neon-cyan text-background shadow-[0_0_20px_#00f0ff33] hover:bg-neon-cyan/90 hover:shadow-[0_0_30px_#00f0ff55]"
            }`}
          >
            {currentPlayer.isReady ? (
              "Cancelar Pronto"
            ) : (
              <>
                <Check className="h-5 w-5" />
                Estou Pronto
              </>
            )}
          </Button>
        )}
        {canStart && (
          <Button
            onClick={() => router.push(`/room/${id}/play?theme=${encodeURIComponent(room.theme)}&rounds=${room.rounds}`)}
            className="h-14 flex-1 gap-2.5 rounded-xl bg-neon-magenta text-base font-bold text-white shadow-[0_0_20px_#ff00e533] transition-all hover:bg-neon-magenta/90 hover:shadow-[0_0_30px_#ff00e555]"
          >
            <Play className="h-6 w-6" />
            Iniciar Partida
          </Button>
        )}
      </div>

      {/* Status message */}
      {isOwner && !canStart && (
        <div className="border-pulse-cyan rounded-xl border border-neon-cyan/20 bg-neon-cyan/[0.03] px-5 py-4 text-center">
          <p className="text-sm text-muted-foreground">
            {room.players.length < 2
              ? "Compartilhe o codigo da sala para convidar jogadores..."
              : "Aguardando todos os jogadores ficarem prontos..."}
          </p>
        </div>
      )}
    </div>
  );
}
