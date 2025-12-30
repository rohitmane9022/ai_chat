import { useState } from "react";
import { Send } from "lucide-react";
import { cn } from "../lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-card border-t border-border">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={disabled}
        className={cn(
          "flex-1 px-4 py-3 rounded-xl",
          "bg-background border border-border",
          "text-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
          "transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className={cn(
          "px-5 py-3 rounded-xl font-medium text-sm",
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90 active:scale-95",
          "transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
          "focus:outline-none focus:ring-2 focus:ring-primary/20"
        )}
      >
        <span className="hidden sm:inline">Send</span>
        <Send className="w-4 h-4 sm:hidden" />
      </button>
    </div>
  );
}
