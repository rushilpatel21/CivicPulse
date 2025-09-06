require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const geminiRouter = require('./routes/geminiRouter.js');
const issuesRouter = require('./routes/issuesRouter.js');
const bugRouter = require('./routes/bugRouter.js');
const adminRouter = require('./routes/adminRouter.js');
const userRouter = require('./routes/userRouter.js');
const testClassifierRouter = require('./routes/testClassifierRouter.js'); // Import the new router
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;


const corsOptions = {
  origin: [
    'https://civicpulse.vercel.app',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: '*',
};

app.use(cors(corsOptions));

// Socket.io setup with CORS
const io = socketIo(server, {
  cors: {
    origin: [
      'https://civicpulse.vercel.app',
      'http://localhost:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: '*',
  }
});

// Make io accessible to routes
app.set('socketio', io);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);
  
  // Test connection handler
  socket.on('test_connection', (data) => {
    console.log('🧪 Test connection received:', data);
    socket.emit('test_response', { message: 'Hello from server!', clientId: socket.id });
  });

  socket.on('disconnect', (reason) => {
    console.log('🔴 Client disconnected:', socket.id, 'Reason:', reason);
  });
});

app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Middleware to handle uploads

// Middleware to add io instance to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get('/', (req, res) => {
  res.send("Server is running.")
})

// Apply multer middleware *before* the router for routes needing file uploads
app.use('/api/gemini', upload.single('photo'), geminiRouter); // Apply middleware and router together
app.use('/api/test-classify', upload.single('image'), testClassifierRouter); // Use 'image' as the field name, matching the MCP example

// Other routes that don't need file uploads
app.use('/api/issues', issuesRouter);
app.use('/api/bugs', bugRouter);
app.use('/api/admin', adminRouter);
app.use('/api/ip', userRouter);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Socket.io server running`);
});