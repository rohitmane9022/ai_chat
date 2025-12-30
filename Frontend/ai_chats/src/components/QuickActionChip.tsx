import { cn } from "../lib/utils";

interface QuickActionChipProps {
  label: string;
  onClick: () => void;
}

export function QuickActionChip({ label, onClick }: QuickActionChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium",
        "bg-chat-chip border border-chat-chip-border",
        "text-foreground/80 hover:bg-chat-chip-hover",
        "transition-all duration-200 hover:shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-primary/20"
      )}
    >
      {label}
    </button>
  );
}
