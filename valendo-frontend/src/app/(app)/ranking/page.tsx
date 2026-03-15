"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { mockGetRanking } from "@/lib/mock-ranking";
import { PageTransition } from "@/components/ui/page-transition";
import { RankingSkeleton } from "@/components/skeletons/ranking-skeleton";
import { RankingTable } from "@/components/ranking/ranking-table";
import { PlayerRankCard } from "@/components/ranking/player-rank-card";
import type { RankedPlayer, RankingPeriod } from "@/types";
import { Trophy, Calendar, CalendarDays, Infinity } from "lucide-react";

const PERIODS: { value: RankingPeriod; label: string; icon: typeof Calendar }[] = [
  { value: "weekly", label: "Semanal", icon: Calendar },
  { value: "monthly", label: "Mensal", icon: CalendarDays },
  { value: "alltime", label: "Geral", icon: Infinity },
];

export default function RankingPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<RankingPeriod>("weekly");
  const [players, setPlayers] = useState<RankedPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRanking = useCallback(async (p: RankingPeriod) => {
    setLoading(true);
    try {
      const data = await mockGetRanking(p);
      setPlayers(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRanking(period);
  }, [period, fetchRanking]);

  const myRank = players.find((p) => p.playerId === user?.id);

  if (loading) return <RankingSkeleton />;

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10 shadow-[0_0_15px_#eab30822]" role="img" aria-label="Icone de ranking">
            <Trophy className="h-6 w-6 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Ranking</h1>
            <p className="text-sm text-muted-foreground">Os melhores jogadores da plataforma</p>
          </div>
        </div>

        {/* Period filter */}
        <div className="flex gap-2" role="tablist" aria-label="Filtro de periodo">
          {PERIODS.map((p) => {
            const Icon = p.icon;
            const active = period === p.value;
            return (
              <button
                key={p.value}
                role="tab"
                aria-selected={active}
                onClick={() => setPeriod(p.value)}
                className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all sm:px-5 ${
                  active
                    ? "border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan neon-glow-cyan"
                    : "border-border/30 bg-card/40 text-muted-foreground hover:border-border/50 hover:bg-card/60"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* My position card */}
        {myRank && <PlayerRankCard player={myRank} />}

        {/* Ranking list */}
        <RankingTable players={players} currentUserId={user?.id ?? ""} />
      </div>
    </PageTransition>
  );
}
