"use client";

import { Wifi, WifiOff, Loader2 } from "lucide-react";
import type { SocketStatus } from "@/lib/socket";

interface ConnectionStatusProps {
  status: SocketStatus;
}

const config: Record<SocketStatus, { label: string; color: string; icon: typeof Wifi }> = {
  connected: { label: "Conectado", color: "text-neon-green", icon: Wifi },
  connecting: { label: "Reconectando...", color: "text-yellow-400", icon: Loader2 },
  disconnected: { label: "Desconectado", color: "text-destructive", icon: WifiOff },
};

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  const { label, color, icon: Icon } = config[status];

  return (
    <div className={`flex items-center gap-2 text-xs font-medium ${color}`}>
      <Icon className={`h-4 w-4 ${status === "connecting" ? "animate-spin" : ""}`} />
      {label}
    </div>
  );
}
