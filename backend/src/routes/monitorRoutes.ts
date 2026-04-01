import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// 1. Saare Monitors Get Karein
router.get('/', async (req, res) => {
  const monitors = await prisma.monitor.findMany({
    include: { heartbeats: { take: 10, orderBy: { timestamp: 'desc' } } }
  });
  res.json(monitors);
});

// 2. Naya Monitor Add Karein
router.post('/add', async (req, res) => {
  const { name, url, interval } = req.body;
  try {
    const newMonitor = await prisma.monitor.create({
      data: { name, url, interval: parseInt(interval) || 60, userId: 'default-user' }
    });
    res.json(newMonitor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create monitor' });
  }
});

// 3. Monitor Delete Karein
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.monitor.delete({ where: { id } });
  res.json({ message: 'Monitor deleted' });
});

export default router;