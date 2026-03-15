"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { mockGetProfile, mockUpdateProfile } from "@/lib/mock-profile";
import { PageTransition } from "@/components/ui/page-transition";
import { ProfileSkeleton } from "@/components/skeletons/profile-skeleton";
import { ProfileCard } from "@/components/profile/profile-card";
import { StatsGrid } from "@/components/profile/stats-grid";
import { MatchHistory } from "@/components/profile/match-history";
import type { PlayerProfile } from "@/types";
import { User, BarChart3, History } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await mockGetProfile();
      setProfile(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  async function handleSave(data: { name: string; avatar: string }) {
    await mockUpdateProfile(data);
    if (profile) {
      setProfile({ ...profile, name: data.name, avatar: data.avatar });
      toast.success("Perfil atualizado!");
    }
  }

  if (loading || !profile) return <ProfileSkeleton />;

  return (
    <PageTransition>
      <div className="space-y-10">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon-magenta/10 shadow-[0_0_15px_#ff00e522]" role="img" aria-label="Icone de perfil">
            <User className="h-6 w-6 text-neon-magenta" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Perfil</h1>
            <p className="text-sm text-muted-foreground">Suas informacoes e estatisticas</p>
          </div>
        </div>

        {/* Profile card */}
        <ProfileCard profile={profile} onSave={handleSave} />

        {/* Stats */}
        <section aria-label="Estatisticas do jogador" className="space-y-4">
          <div className="flex items-center gap-2.5">
            <BarChart3 className="h-5 w-5 text-neon-cyan/60" />
            <h2 className="text-lg font-bold">Estatisticas</h2>
          </div>
          <StatsGrid stats={profile.stats} />
        </section>

        {/* Match history */}
        <section aria-label="Historico de partidas" className="space-y-4">
          <div className="flex items-center gap-2.5">
            <History className="h-5 w-5 text-neon-cyan/60" />
            <h2 className="text-lg font-bold">Partidas Recentes</h2>
          </div>
          <MatchHistory matches={profile.recentMatches} />
        </section>
      </div>
    </PageTransition>
  );
}
