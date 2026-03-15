"use client";

import { Swords, Trophy, Target, Flame, Zap, TrendingUp } from "lucide-react";
import type { PlayerStats } from "@/types";

interface StatsGridProps {
  stats: PlayerStats;
}

const STAT_CARDS = [
  { key: "totalMatches", label: "Partidas", icon: Swords, color: "text-neon-cyan", bg: "bg-neon-cyan/10" },
  { key: "wins", label: "Vitorias", icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { key: "winRate", label: "Taxa Vitoria", icon: TrendingUp, color: "text-neon-green", bg: "bg-neon-green/10", suffix: "%" },
  { key: "accuracy", label: "Acertos", icon: Target, color: "text-neon-magenta", bg: "bg-neon-magenta/10", suffix: "%" },
  { key: "bestStreak", label: "Melhor Sequencia", icon: Flame, color: "text-orange-400", bg: "bg-orange-500/10" },
  { key: "totalPoints", label: "Pontos Totais", icon: Zap, color: "text-neon-cyan", bg: "bg-neon-cyan/10", format: true },
] as const;

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {STAT_CARDS.map((card) => {
        const Icon = card.icon;
        const raw = stats[card.key];
        const value = "format" in card && card.format ? raw.toLocaleString() : raw;
        const suffix = "suffix" in card ? card.suffix : "";

        return (
          <div
            key={card.key}
            className="gradient-border flex items-center gap-3 rounded-xl bg-card/60 p-4 backdrop-blur-sm"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.bg}`}>
              <Icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div>
              <p className="font-mono text-xl font-black">
                {value}{suffix}
              </p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
