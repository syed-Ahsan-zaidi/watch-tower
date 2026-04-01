import axios from 'axios';
import prisma from '../lib/prisma';

export const checkWebsite = async (monitorId: string, url: string) => {
  const startTime = Date.now();

  try {
    const response = await axios.get(url, { timeout: 10000 });
    const latency = Date.now() - startTime;

    // ✅ Schema ke mutabiq: statusCode (Int) aur latency (Int)
    await prisma.heartbeat.create({
      data: {
        monitorId: monitorId,
        statusCode: response.status, // e.g., 200
        latency: latency,            // e.g., 150
      },
    });

    // Monitor ka main status bhi update kar dete hain
    await prisma.monitor.update({
      where: { id: monitorId },
      data: { status: 'UP' }
    });

    console.log(`✅ Checked ${url}: UP (${latency}ms)`);
  } catch (error: any) {
    const errorCode = error.response?.status || 500;
    
    await prisma.heartbeat.create({
      data: {
        monitorId: monitorId,
        statusCode: errorCode,
        latency: 0,
      },
    });

    await prisma.monitor.update({
      where: { id: monitorId },
      data: { status: 'DOWN' }
    });

    console.error(`❌ DOWN: ${url} (Status: ${errorCode})`);
  }
};