"use client";

import { CheckCircle2, Clock, Crown, User } from "lucide-react";
import type { RoomPlayer } from "@/types";

interface PlayerListProps {
  players: RoomPlayer[];
  ownerId: string;
}

export function PlayerList({ players, ownerId }: PlayerListProps) {
  return (
    <div className="space-y-3">
      {players.map((player) => {
        const isHost = player.id === ownerId;
        return (
          <div
            key={player.id}
            className={`flex items-center justify-between rounded-xl border px-5 py-4 transition-all ${
              player.isReady
                ? "border-neon-green/20 bg-neon-green/[0.04]"
                : "border-border/30 bg-background/40"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  isHost
                    ? "bg-neon-cyan/15 text-neon-cyan"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {isHost ? <Crown className="h-5 w-5" /> : <User className="h-5 w-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{player.name}</span>
                  {isHost && (
                    <span className="rounded-md bg-neon-cyan/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-neon-cyan">
                      Host
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs text-muted-foreground">{player.tag}</span>
              </div>
            </div>

            {/* Status */}
            {player.isReady ? (
              <div className="flex items-center gap-2 text-sm font-semibold text-neon-green">
                <CheckCircle2 className="h-5 w-5" />
                Pronto
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-5 w-5 animate-pulse" />
                Aguardando
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
