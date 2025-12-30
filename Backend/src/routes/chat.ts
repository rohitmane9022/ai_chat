import express from "express";
import { db } from "../db";
import { v4 as uuid } from "uuid";
import { generateReply } from "../services/llm.service";

const router = express.Router();

router.post("/message", async (req, res) => {
  const { message, sessionId } = req.body;
  if (!message) return res.status(400).json({ error: "Empty message" });

  const conversationId = sessionId || uuid();

  console.log("Incoming sessionId:", sessionId);
  console.log("Using conversationId:", conversationId);

  try {
    // 1️⃣ Ensure conversation exists
    await db.query(
      "INSERT IGNORE INTO conversations (id) VALUES (?)",
      [conversationId]
    );

    // 2️⃣ Save user message
    await db.query(
      `INSERT INTO messages (id, conversation_id, sender, text, created_at)
       VALUES (?, ?, 'user', ?, NOW())`,
      [uuid(), conversationId, message]
    );

    // 3️⃣ Load conversation history
    const [rows] = await db.query(
      `SELECT sender, text
       FROM messages
       WHERE conversation_id = ?
       ORDER BY created_at ASC`,
      [conversationId]
    );

    // 4️⃣ Generate AI reply
    const reply = await generateReply(rows as any[]);

    // 5️⃣ Save AI reply
    await db.query(
      `INSERT INTO messages (id, conversation_id, sender, text, created_at)
       VALUES (?, ?, 'ai', ?, NOW())`,
      [uuid(), conversationId, reply]
    );

    res.json({ reply, sessionId: conversationId });

  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Service unavailable",
      reply: "I'm sorry, I'm having trouble connecting. Please try again later."
    });
  }
});

/**
 * LOAD CHAT HISTORY
 */
router.get("/history/:conversationId", async (req, res) => {
  const { conversationId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT sender, text, created_at
       FROM messages
       WHERE conversation_id = ?
       ORDER BY created_at ASC`,
      [conversationId]
    );

    res.json({ messages: rows });
  } catch (error) {
    console.error("History error:", error);
    res.status(500).json({ error: "Failed to load history" });
  }
});

export default router;
