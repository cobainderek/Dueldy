"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Zap, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    if (name.length < 3) {
      setError("O nome deve ter pelo menos 3 caracteres.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email invalido.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas nao coincidem.");
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="gradient-border rounded-2xl bg-card/90 backdrop-blur-xl neon-glow-magenta">
      <div className="space-y-8 p-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neon-magenta/10 neon-glow-magenta-strong">
            <Zap className="h-8 w-8 text-neon-magenta" />
          </div>
          <div className="text-center">
            <h1 className="font-mono text-3xl font-black tracking-widest text-neon-magenta neon-text-magenta">
              VALENDO
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Crie sua conta para comecar a jogar
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
            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-neon-magenta/60" />
              Nome
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-xl border-border/40 bg-background/60 px-4 text-base focus-visible:ring-2 focus-visible:ring-neon-magenta/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4 text-neon-magenta/60" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl border-border/40 bg-background/60 px-4 text-base focus-visible:ring-2 focus-visible:ring-neon-magenta/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
              <Lock className="h-4 w-4 text-neon-magenta/60" />
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Min. 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-xl border-border/40 bg-background/60 px-4 text-base focus-visible:ring-2 focus-visible:ring-neon-magenta/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium">
              <Lock className="h-4 w-4 text-neon-magenta/60" />
              Confirmar Senha
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 rounded-xl border-border/40 bg-background/60 px-4 text-base focus-visible:ring-2 focus-visible:ring-neon-magenta/50"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-neon-magenta text-base font-bold tracking-wide text-white shadow-[0_0_20px_#ff00e533] transition-all hover:bg-neon-magenta/90 hover:shadow-[0_0_30px_#ff00e555]"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5" />
                Criar Conta
              </>
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="border-t border-border/30 pt-5 text-center">
          <p className="text-sm text-muted-foreground">
            Ja tem uma conta?{" "}
            <Link
              href="/login"
              className="font-semibold text-neon-cyan transition-all hover:underline neon-text-cyan"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
