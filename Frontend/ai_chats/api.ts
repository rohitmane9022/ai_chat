export async function sendMessage(message: string, sessionId?: string) {
  const res = await fetch("https://ai-chat-kt00.onrender.com/chat/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId }),
  });

  return res.json();
}

export async function fetchChatHistory(sessionId: string) {
  const res = await fetch(
    `https://ai-chat-kt00.onrender.com/chat/history/${sessionId}`
  );

  return res.json();
}
