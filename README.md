# Reviewly - AI Code Reviewer

Reviewly is a production-ready AI-powered code review web application built with Next.js, OpenAI/Gemini, and MongoDB.

## 🚀 Features

- **Multi-Language Support**: Review JavaScript, TypeScript, Python, Java, C++, and more.
- **Structured Feedback**: Automated analysis of Bugs, Improvements, Security, and Complexity.
- **Modern UI**: Dark-mode-first, responsive interface with a professional Monaco code editor.
- **AI-Powered**: Integrates with both OpenAI (GPT-4o) and Google Gemini (1.5 Pro).
- **Persistence**: Save and retrieve code review history using MongoDB.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Node.js runtime)
- **Database**: MongoDB (Mongoose)
- **AI**: OpenAI SDK / Google Generative AI SDK
- **Icons**: Lucide React
- **Toast Notifications**: React Hot Toast

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local MongoDB instance

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory based on `.env.example`:

```env
AI_PROVIDER=openai # or 'gemini'

# OpenAI
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-4o

# Gemini
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-1.5-pro

# MongoDB
MONGODB_URI=your_mongodb_connection_string
```

### 4. Running the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔌 API Contract

### POST `/api/review`
**Request Body**:
```json
{
  "code": "string",
  "language": "string"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "bugs": [...],
    "improvements": [...],
    "security": [...],
    "complexity": [...]
  },
  "id": "mongodb_id"
}
```

## 🧠 LLM Prompts
The app uses a strict system prompt to ensure the LLM returns valid JSON conforming to the structural requirements of the UI.
