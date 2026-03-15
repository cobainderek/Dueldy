"use client";

import { Users, Swords, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Room } from "@/types";

interface RoomCardProps {
  room: Room;
  onJoin: (roomId: string) => void;
  loading?: boolean;
}

export function RoomCard({ room, onJoin, loading }: RoomCardProps) {
  const isFull = room.players.length >= room.maxPlayers;
  const fillPercent = (room.players.length / room.maxPlayers) * 100;

  return (
    <div className="gradient-border group rounded-xl bg-card/70 backdrop-blur-sm transition-all duration-300 hover:bg-card/90 hover:neon-glow-cyan">
      <div className="flex items-center gap-5 p-5">
        {/* Icon */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-neon-cyan/10 transition-all group-hover:bg-neon-cyan/20 group-hover:neon-glow-cyan">
          <Swords className="h-7 w-7 text-neon-cyan" />
        </div>

        {/* Info */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">{room.theme}</span>
            <span className="rounded-lg bg-neon-cyan/10 px-2.5 py-1 font-mono text-xs font-semibold tracking-widest text-neon-cyan">
              {room.code}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span className="font-medium text-foreground">{room.players.length}</span>/{room.maxPlayers}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan/50" />
              {room.rounds} rodadas
            </span>
          </div>
          {/* Player bar */}
          <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-cyan/50 transition-all"
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </div>

        {/* Join button */}
        <Button
          disabled={isFull || loading}
          onClick={() => onJoin(room.id)}
          className="h-12 gap-2 rounded-xl bg-neon-cyan px-6 text-base font-bold text-background shadow-[0_0_15px_#00f0ff22] transition-all hover:bg-neon-cyan/90 hover:shadow-[0_0_25px_#00f0ff44] disabled:opacity-30 disabled:shadow-none"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isFull ? (
            "Cheia"
          ) : (
            <>
              Entrar
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
