require('dotenv').config();
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(httpServer, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: `http://${hostname}:${port}`,
      methods: ['GET', 'POST'],
    },
  });

  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY not found in environment variables');
    console.error('Create a .env file with your API key');
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  console.log('Socket.io server initialized');
  console.log('Gemini AI configured');

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('send-message', async (data) => {
      const { message, history } = data;

      try {
        const chatHistory = history.map((msg) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({
          history: chatHistory,
        });

        // Send message and get streaming response
        const result = await chat.sendMessageStream(message);

        // Stream chunks to client
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          if (chunkText) {
            socket.emit('chat-chunk', { chunk: chunkText });
          }
        }

        // Signal completion
        socket.emit('chat-complete');
        console.log(`Message streaming completed for ${socket.id}`);
      } catch (error) {
        console.error(`Error processing message for ${socket.id}:`, error);
        socket.emit('chat-error', {
          error: error.message || 'Failed to generate response',
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`Running on http://${hostname}:${port}`);
    });
});