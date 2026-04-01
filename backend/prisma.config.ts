import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

// .env file load karne ke liye
dotenv.config();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});