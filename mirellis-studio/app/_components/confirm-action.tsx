"use client";

export function ConfirmAction({ label, prompt, className = "button button-secondary" }: { label: string; prompt: string; className?: string }) {
  return (
    <button className={className} type="submit" onClick={(event) => { if (!window.confirm(prompt)) event.preventDefault(); }}>
      {label}
    </button>
  );
}
