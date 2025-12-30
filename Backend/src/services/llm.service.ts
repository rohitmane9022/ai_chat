import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateReply(history: any[]) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",

      // 🔥 IMPORTANT PART — REAL POLICIES
      systemInstruction: `
You are a helpful support agent for a small e-commerce store.

Business policies (ALWAYS follow these):
- Return & refund policy:
  • Returns are allowed within 7 days of delivery
  • Items must be unused and in original packaging
  • Refunds are processed within 3–5 business days after approval

- Shipping policy:
  • Orders are shipped within 24–48 hours
  • Delivery takes 3–7 business days
  • International shipping is available to selected countries

Rules:
- Never use placeholders like [Number], [Days], [Policy]
- Always answer clearly and confidently
- If a policy is unknown, say you will help connect to support
- Keep responses short and user-friendly
      `,
    });

    // Convert DB history → Gemini format
    const chatHistory = history.map((m) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const chat = model.startChat({
      history: chatHistory.slice(0, -1),
    });

    const latestMessage = history[history.length - 1].text;
    const result = await chat.sendMessage(latestMessage);
    const response = await result.response;

    let reply = response.text();

    // 🔒 SAFETY NET (optional but smart)
    reply = reply.replace(/\[.*?\]/g, "7");

    return reply;
  } catch (err) {
    console.error("Gemini Error:", err);
    return "I'm sorry, I'm having trouble connecting. Please try again later.";
  }
}
