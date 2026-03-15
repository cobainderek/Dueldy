"use client";

import { Check, X } from "lucide-react";

interface AnswerOptionProps {
  id: string;
  text: string;
  label: string;
  selected: boolean;
  correct?: boolean | null;
  revealed: boolean;
  disabled: boolean;
  onSelect: (id: string) => void;
}

export function AnswerOption({
  id,
  text,
  label,
  selected,
  correct,
  revealed,
  disabled,
  onSelect,
}: AnswerOptionProps) {
  let borderColor = "border-border/40 hover:border-neon-cyan/40";
  let bgColor = "bg-card/60 hover:bg-card/90";
  let labelBg = "bg-secondary/70 text-muted-foreground";
  let icon = null;

  if (selected && !revealed) {
    borderColor = "border-neon-cyan/60";
    bgColor = "bg-neon-cyan/[0.08]";
    labelBg = "bg-neon-cyan/20 text-neon-cyan";
  }

  if (revealed) {
    if (correct === true) {
      borderColor = "border-neon-green/60";
      bgColor = "bg-neon-green/[0.08]";
      labelBg = "bg-neon-green/20 text-neon-green";
      icon = <Check className="h-6 w-6 text-neon-green" />;
    } else if (selected && correct === false) {
      borderColor = "border-destructive/60";
      bgColor = "bg-destructive/[0.08]";
      labelBg = "bg-destructive/20 text-destructive";
      icon = <X className="h-6 w-6 text-destructive" />;
    } else {
      borderColor = "border-border/20";
      bgColor = "bg-card/30 opacity-50";
    }
  }

  return (
    <button
      onClick={() => onSelect(id)}
      disabled={disabled}
      className={`flex w-full items-center gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all ${borderColor} ${bgColor} ${
        disabled ? "cursor-default" : "cursor-pointer"
      }`}
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold ${labelBg}`}>
        {label}
      </span>
      <span className="flex-1 text-base font-medium">{text}</span>
      {icon}
    </button>
  );
}
