"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Zap, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email invalido.");
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="gradient-border rounded-2xl bg-card/90 backdrop-blur-xl neon-glow-cyan">
      <div className="space-y-8 p-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neon-cyan/10 neon-glow-cyan-strong">
            <Zap className="h-8 w-8 text-neon-cyan" />
          </div>
          <div className="text-center">
            <h1 className="font-mono text-3xl font-black tracking-widest text-neon-cyan neon-text-cyan">
              VALENDO
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Entre com sua conta para jogar
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4 text-neon-cyan/60" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl border-border/40 bg-background/60 px-4 text-base focus-visible:ring-2 focus-visible:ring-neon-cyan/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
              <Lock className="h-4 w-4 text-neon-cyan/60" />
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-xl border-border/40 bg-background/60 px-4 text-base focus-visible:ring-2 focus-visible:ring-neon-cyan/50"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-neon-cyan text-base font-bold tracking-wide text-background shadow-[0_0_20px_#00f0ff33] transition-all hover:bg-neon-cyan/90 hover:shadow-[0_0_30px_#00f0ff55]"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5" />
                Entrar
              </>
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="border-t border-border/30 pt-5 text-center">
          <p className="text-sm text-muted-foreground">
            Ainda nao tem conta?{" "}
            <Link
              href="/register"
              className="font-semibold text-neon-magenta transition-all hover:underline neon-text-magenta"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
