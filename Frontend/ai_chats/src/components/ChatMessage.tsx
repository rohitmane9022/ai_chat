import { cn } from "../lib/utils";

interface ChatMessageProps {
  sender: "user" | "bot";
  text: string;
}

export function ChatMessage({ sender, text }: ChatMessageProps) {
  const isUser = sender === "user";

  return (
    <div
      className={cn(
        "flex w-full animate-message-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed",
          isUser
            ? "bg-chat-user text-chat-user-foreground rounded-br-md"
            : "bg-chat-bot text-chat-bot-foreground rounded-bl-md shadow-sm border border-border/50"
        )}
      >
        <span className="font-semibold text-sm opacity-80">
          {isUser ? "You" : "Bot"}:
        </span>{" "}
        <span className="whitespace-pre-wrap">{text}</span>
      </div>
    </div>
  );
}
