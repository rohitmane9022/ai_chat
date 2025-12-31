import express from "express";
import { db } from "../db";
import { generateReply } from "../services/llm.service";

const router = express.Router();


router.post("/message", async (req, res) => {
  const { message, sessionId } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Empty message" });
  }

  
  let conversationId = sessionId;

  try {
  
    if (!conversationId) {
      const convoResult = await db.query(
        `INSERT INTO conversations DEFAULT VALUES RETURNING id`
      );
      conversationId = convoResult.rows[0].id;
    } else {
      await db.query(
        `INSERT INTO conversations (id)
         VALUES ($1)
         ON CONFLICT DO NOTHING`,
        [conversationId]
      );
    }

  
    await db.query(
      `INSERT INTO messages (conversation_id, sender, text)
       VALUES ($1, 'user', $2)`,
      [conversationId, message]
    );

    const historyResult = await db.query(
      `SELECT sender, text
       FROM messages
       WHERE conversation_id = $1
       ORDER BY created_at ASC`,
      [conversationId]
    );

  
    const reply = await generateReply(historyResult.rows);

    
    await db.query(
      `INSERT INTO messages (conversation_id, sender, text)
       VALUES ($1, 'ai', $2)`,
      [conversationId, reply]
    );

    return res.json({
      reply,
      sessionId: conversationId,
    });

  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({
      error: "Service unavailable",
      reply: "I'm sorry, I'm having trouble connecting. Please try again later.",
    });
  }
});

/**
 * LOAD CHAT HISTORY
 */
router.get("/history/:conversationId", async (req, res) => {
  const { conversationId } = req.params;

  try {
    const result = await db.query(
      `SELECT sender, text, created_at
       FROM messages
       WHERE conversation_id = $1
       ORDER BY created_at ASC`,
      [conversationId]
    );

    return res.json({ messages: result.rows });

  } catch (error) {
    console.error("History error:", error);
    return res.status(500).json({
      error: "Failed to load history",
    });
  }
});

export default router;
