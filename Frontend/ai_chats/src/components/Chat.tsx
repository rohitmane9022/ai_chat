import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { QuickActionChip } from "./QuickActionChip";
import { ChatInput } from "./ChatInput";
import { MessageCircle } from "lucide-react";
import { sendMessage, fetchChatHistory } from "../../api";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const QUICK_ACTIONS = [
  "Where is my order?",
  "How do I return an item?",
  "Do you ship internationally?",
  "Shipping policy",
  "Return/refund policy"
];

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(
    localStorage.getItem("chat_session_id") || undefined
  );

  const chatEndRef = useRef<HTMLDivElement>(null);

  // 🔁 Load chat history on refresh
  useEffect(() => {
    const storedSessionId = localStorage.getItem("chat_session_id");
    if (!storedSessionId) return;

    setSessionId(storedSessionId);

    const loadHistory = async () => {
      try {
        const data = await fetchChatHistory(storedSessionId);
        if (data.messages?.length) {
          setMessages(
            data.messages.map((m: any) => ({
              sender: m.sender === "ai" ? "bot" : "user",
              text: m.text,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load history", err);
      }
    };

    loadHistory();
  }, []);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Send message
  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setIsTyping(true);

    try {
      const data = await sendMessage(text, sessionId);

      if (data.sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem("chat_session_id", data.sessionId);
      }

      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "I'm sorry, I'm having trouble connecting." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl shadow-lg border overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-primary text-primary-foreground">
        <MessageCircle className="w-6 h-6" />
        <h2 className="font-semibold text-lg">Support Chat</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground">
            Ask about orders, returns, or shipping!
          </p>
        )}

        {messages.map((msg, i) => (
          <ChatMessage key={i} sender={msg.sender} text={msg.text} />
        ))}

        {isTyping && <p className="text-sm">AI is thinking…</p>}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-t">
        {QUICK_ACTIONS.map((action) => (
          <QuickActionChip
            key={action}
            label={action}
            onClick={() => handleSend(action)}
          />
        ))}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  );
}
