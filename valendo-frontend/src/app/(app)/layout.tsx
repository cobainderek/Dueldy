"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Zap, Swords, Trophy, User } from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Salas", icon: Swords },
    { href: "/ranking", label: "Ranking", icon: Trophy },
    { href: "/profile", label: "Perfil", icon: User },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center cyber-grid">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-neon-cyan" />
          <span className="font-mono text-sm text-muted-foreground">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background cyber-grid">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-64 left-1/4 h-[400px] w-[400px] rounded-full bg-neon-cyan/[0.04] blur-[100px]" />
        <div className="absolute -bottom-64 right-1/4 h-[400px] w-[400px] rounded-full bg-neon-magenta/[0.04] blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 border-b border-neon-cyan/10 bg-card/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-cyan/10 neon-glow-cyan">
              <Zap className="h-5 w-5 text-neon-cyan" />
            </div>
            <span className="font-mono text-xl font-black tracking-widest text-neon-cyan neon-text-cyan">
              VALENDO
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    active
                      ? "bg-neon-cyan/10 text-neon-cyan"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        {children}
      </main>
    </div>
  );
}
