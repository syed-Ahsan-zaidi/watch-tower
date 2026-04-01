import 'dotenv/config';
import express from 'express';
import cors from 'cors'; 
import monitorRoutes from './routes/monitorRoutes';
import { startScheduler } from './services/scheduler';

const app = express();
const PORT = 3001;

// Middlewares (ORDER IS IMPORTANT)
app.use(cors()); // Pehle CORS allow karein
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

