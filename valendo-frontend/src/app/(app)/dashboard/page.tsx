"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/ui/page-transition";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";
import { RoomCard } from "@/components/room/room-card";
import { CreateRoomModal } from "@/components/room/create-room-modal";
import { JoinByCode } from "@/components/room/join-by-code";
import { mockListRooms, mockCreateRoom, mockJoinRoom, mockJoinByCode } from "@/lib/mock-rooms";
import type { Room, CreateRoomPayload } from "@/types";
import { LogOut, Plus, RefreshCw, Swords, Hash, Zap } from "lucide-react";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await mockListRooms();
      setRooms(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const currentPlayer = {
    id: user?.id ?? "",
    name: user?.name ?? "",
    tag: user?.tag ?? "",
    isReady: false,
  };

  async function handleCreate(payload: CreateRoomPayload) {
    const room = await mockCreateRoom(payload, { ...currentPlayer, isReady: true });
    toast.success("Sala criada com sucesso!");
    router.push(`/room/${room.id}`);
  }

  async function handleJoin(roomId: string) {
    setJoiningId(roomId);
    try {
      await mockJoinRoom(roomId, currentPlayer);
      toast.success("Entrando na sala...");
      router.push(`/room/${roomId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao entrar na sala.");
    } finally {
      setJoiningId(null);
    }
  }

  async function handleJoinByCode(code: string) {
    const room = await mockJoinByCode(code, currentPlayer);
    toast.success("Entrando na sala...");
    router.push(`/room/${room.id}`);
  }

  if (loading) return <DashboardSkeleton />;

  return (
    <PageTransition>
      <div className="space-y-10">
        {/* Hero header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon-cyan/10 neon-glow-cyan" role="img" aria-label="Icone do dashboard">
              <Zap className="h-6 w-6 text-neon-cyan" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                Ola, <span className="text-neon-cyan neon-text-cyan">{user?.name}</span>
              </h1>
              <p className="text-sm text-muted-foreground">Pronto para um duelo?</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={logout}
            aria-label="Sair da conta"
            className="gap-2.5 self-start rounded-xl border-border/40 px-5 py-2.5 transition-all hover:border-neon-magenta/50 hover:bg-neon-magenta/10 hover:text-neon-magenta"
          >
            <LogOut className="h-5 w-5" />
            <span className="sm:inline">Sair</span>
          </Button>
        </div>

        {/* Join by code section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <Hash className="h-5 w-5 text-neon-cyan/60" />
            <h2 className="text-base font-semibold text-muted-foreground">Entrar por codigo</h2>
          </div>
          <JoinByCode onJoin={handleJoinByCode} />
        </div>

        {/* Room list section */}
        <div className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <Swords className="h-6 w-6 text-neon-cyan" />
              <h2 className="text-xl font-bold">Salas abertas</h2>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={fetchRooms}
                aria-label="Atualizar lista de salas"
                className="gap-2 rounded-xl border-border/40 px-4 transition-all hover:border-neon-cyan/30 hover:bg-neon-cyan/5"
              >
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>
              <Button
                onClick={() => setShowCreate(true)}
                aria-label="Criar nova sala"
                className="gap-2 rounded-xl bg-neon-magenta px-6 font-bold text-white shadow-[0_0_20px_#ff00e522] transition-all hover:bg-neon-magenta/90 hover:shadow-[0_0_30px_#ff00e544]"
              >
                <Plus className="h-5 w-5" />
                Criar Sala
              </Button>
            </div>
          </div>

          {rooms.length === 0 ? (
            <div className="gradient-border flex flex-col items-center gap-4 rounded-2xl bg-card/50 py-16 text-center backdrop-blur-sm sm:py-20">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/50">
                <Swords className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Nenhuma sala aberta</p>
                <p className="mt-1 text-sm text-muted-foreground">Crie a primeira e convide seus amigos!</p>
              </div>
              <Button
                onClick={() => setShowCreate(true)}
                className="mt-2 gap-2 rounded-xl bg-neon-magenta px-6 font-bold text-white shadow-[0_0_15px_#ff00e522]"
              >
                <Plus className="h-5 w-5" />
                Criar Sala
              </Button>
            </div>
          ) : (
            <div className="space-y-4" role="list" aria-label="Lista de salas">
              {rooms.map((room) => (
                <div key={room.id} role="listitem">
                  <RoomCard
                    room={room}
                    onJoin={handleJoin}
                    loading={joiningId === room.id}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <CreateRoomModal
          open={showCreate}
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      </div>
    </PageTransition>
  );
}
