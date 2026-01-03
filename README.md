
# 🤖 AI Chat App 

A full-stack AI-powered support chat application built with **React**, **Node.js**, **Express**, **MySQL**, and **Google Gemini**.
The app supports **session-based conversations**, **chat history persistence**, and **AI-powered responses** with real business policies.

---

## ✨ Features

- AI-powered chat using **Google Gemini**
- Session-based conversations with persistent history
- Chat history stored in **MySQL**
- Page refresh resumes conversation
- Quick action buttons (Shipping, Returns, Order status)
- Clean frontend & backend separation
- Production-ready architecture

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express
- TypeScript
- Google Gemini SDK

### Database
- MySQL (`mysql2/promise`) or Postgresql
- UUID-based primary keys

---

## 📂 Project Structure

```
AI-CHAT-APP
├── Backend
│   ├── src
│   │   ├── db
│   │   │   └── index.ts
│   │   ├── routes
│   │   │   └── chat.ts
│   │   ├── services
│   │   │   └── llm.service.ts
│   │   ├── utils
│   │   │   └── session.ts
│   │   ├── index.ts
│   │   └── server.ts
│   ├── .env
│   └── package.json
│
├── Frontend_ai_chats
│   ├── src
│   │   ├── components
│   │   │   ├── Chat.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   └── QuickActionChip.tsx
│   │   ├── api.ts
│   │   └── main.tsx
│   └── index.html
```

---

## ⚙️ Environment Variables

Create a `.env` file inside `Backend`:

```env
PORT=4000



DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ai_chat

GEMINI_API_KEY=your_gemini_api_key
Postgresql = DATABASE_URL
```

---

## 🛢️ Database Setup (MySQL)

### Create Database

```sql
CREATE DATABASE ai_chat;
USE ai_chat;
```

### Create Tables

```sql
CREATE TABLE conversations (
  id VARCHAR(36) PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  id VARCHAR(36) PRIMARY KEY,
  conversation_id VARCHAR(36) NOT NULL,
  sender ENUM('user', 'ai') NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id)
    REFERENCES conversations(id)
    ON DELETE CASCADE
);
```

---

## ▶️ Run Locally

### Backend

```bash
cd Backend
npm install
npm run dev
```

Backend runs on:
```
http://localhost:4000
```

### Frontend

```bash
cd Frontend_ai_chats
npm install
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

---

## 🧠 Architecture Overview

### Backend
- Routes handle HTTP requests
- Services encapsulate Gemini logic
- DB layer manages MySQL connection pooling
- UUID-based session handling

### Frontend
- Central Chat component controls session
- History loaded on initial mount
- Backend is source of truth for sessionId

---

## 🤖 LLM Notes

- Provider: **Google Gemini (gemini-2.5-flash)**
- Strong system prompt with real business policies
- Prevents placeholders like `[Number]`
- Optimized for support-style conversations

---

## ⚖️ Trade-offs & Improvements

### Current Trade-offs
- No user authentication yet
- Policies are hardcoded in prompt
- Free backend may sleep on inactivity

### If I Had More Time
- Add authentication
- Store policies in DB
- Admin dashboard
- Redis caching
- CI/CD pipeline

---

## 🚀 Deployment (Free)

- Frontend: Vercel
- Backend: Render
- Database: PlanetScale (MySQL)

---

## 👤 Author

**Rohit Mane**  
Frontend / Full Stack Developer  
Portfolio: https://rohitmane.space
