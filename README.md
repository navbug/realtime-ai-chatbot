# 🤖 Real-Time AI Chatbot with Streaming

A modern, real-time AI chatbot application featuring streaming responses from Google Gemini AI using WebSocket communication. Built with Next.js, TypeScript, and Socket.io.

## ✨ Features

- **Real-time streaming responses** from Google Gemini AI
- **WebSocket communication** using Socket.io for bidirectional communication
- **Typing indicators** showing when AI is processing
- **Connection status monitoring** with visual indicators
- **Auto-scroll** to latest messages
- **Character limit** indicator with validation
- **Error handling** with user-friendly messages
- **Responsive design** that works on mobile and desktop
- **Markdown rendering** in AI responses
- **Copy to clipboard** functionality for AI messages
- **Clear chat** functionality
- **Clean, modern UI** built with Tailwind CSS

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with functional components and hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.io Client** - WebSocket client library
- **react-markdown** - Markdown rendering
- **lucide-react** - Icons
  
### Backend
- **Node.js** - Runtime environment
- **Socket.io** - WebSocket server
- **Google Generative AI** - Gemini API integration
- **Next.js API Routes** - Custom server setup

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone <https://github.com/navbug/realtime-ai-chatbot>
cd realtime-ai-chatbot
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 4: Set Up Environment Variables

Create a `.env` file in the root directory:

Edit `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

## 🎮 Running the Project

### Development Mode

```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## ⏱ Time Spent

Total time: **12-15 hours**

## 🎥 Demo Video

[**Watch Demo Video 1**](https://www.loom.com/share/d5cc2bb7c5fb412e866bdbba4abf5ef6)
[**Watch Demo Video 2**](https://www.loom.com/share/2975887b23cc41ccbf6c1735182ddba6)
