import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import monitorRoutes from './routes/monitorRoutes';
import { startScheduler } from './services/scheduler';

const app = express();
const PORT = process.env.PORT || 3001; // Railway automatically port assign karta hai

// 1. CORS Configuration (Order: Pehle CORS)
app.use(cors({
  origin: [
    "https://watch-tower-mu.vercel.app",
    "https://watch-tower-phk4sa7p0-syed-ahsan-zaidis-projects.vercel.app",
    "https://watch-tower-c3raxpzqu-syed-ahsan-zaidis-projects.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// 2. Body Parser (Order: Phir JSON parsing)
app.use(express.json());

// 3. Routes
app.use('/api/monitors', monitorRoutes);

// 4. Background Worker (Starts the website checking logic)
startScheduler();

// Health Check Route
app.get('/', (req, res) => {
  res.send('WatchTower Backend is running... 🚀');
});

// Server Start
app.listen(PORT, () => {
  console.log(`🚀 WatchTower live on port ${PORT}`);
});