import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import monitorRoutes from './routes/monitorRoutes';
import { startScheduler } from './services/scheduler';

const app = express();
const PORT = 3001;

// Middlewares (ORDER IS IMPORTANT)
 app.use(cors({
  origin: [
    "https://watch-tower-mu.vercel.app", 
    "https://watch-tower-phk4sa7p0-syed-ahsan-zaidis-projects.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
// Pehle CORS allow karein
app.use(express.json()); // Phir JSON parse karein

// Routes
app.use('/api/monitors', monitorRoutes);

// Worker
startScheduler();

app.get('/', (req, res) => {
  res.send('WatchTower Backend is running...');
});

app.listen(PORT, () => {
  console.log(`🚀 WatchTower live on http://localhost:${PORT}`);
});

