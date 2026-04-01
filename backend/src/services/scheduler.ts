import cron from 'node-cron';
import prisma from '../lib/prisma';
import { checkWebsite } from './monitor';

export const startScheduler = () => {
  // Har 1 minute baad chalay ga
  cron.schedule('* * * * *', async () => {
    console.log('--- Running Health Checks ---');
    
    const monitors = await prisma.monitor.findMany();

    for (const monitor of monitors) {
      await checkWebsite(monitor.id, monitor.url);
    }
  });
};
