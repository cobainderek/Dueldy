"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Hash, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface JoinByCodeProps {
  onJoin: (code: string) => Promise<void>;
}

export function JoinByCode({ onJoin }: JoinByCodeProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError("Digite o codigo da sala.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onJoin(trimmed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar na sala.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="gradient-border rounded-xl bg-card/70 p-5 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="flex items-start gap-3">
        <div className="relative flex-1">
          <Hash className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neon-cyan/40" />
          <Input
            placeholder="CODIGO DA SALA"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={8}
            className="h-12 rounded-xl border-border/40 bg-background/60 pl-11 font-mono text-base uppercase tracking-[0.3em] focus-visible:ring-2 focus-visible:ring-neon-cyan/50"
          />
          {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="h-12 gap-2 rounded-xl bg-neon-cyan px-6 text-base font-bold text-background shadow-[0_0_15px_#00f0ff22] transition-all hover:bg-neon-cyan/90 hover:shadow-[0_0_25px_#00f0ff44]"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Entrar
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
