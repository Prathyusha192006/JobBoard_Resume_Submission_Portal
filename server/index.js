// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const employerRoutes = require('./routes/employer.routes');
const adminRoutes = require('./routes/admin.routes');
const appliedRoutes = require('./routes/applied.routes');
const chatRoutes = require('./routes/chat.routes');
const jobsRoutes = require('./routes/jobs.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const savedRoutes = require('./routes/saved.routes');
const ContactMessage = require('./models/ContactMessage');
const auth = require('./middleware/auth');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', /\.vercel\.app$/],
  credentials: true
}));
app.use(express.json());

// File upload setup using multer
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

app.post('/api/upload', auth, upload.single('resume'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const resumeUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ resumeUrl, fileName: req.file.originalname });
});

// Public contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    const newMessage = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send contact message' });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/applied', appliedRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/saved', savedRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running and healthy',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});