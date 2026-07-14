// server/src/plugins/cors.ts
import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import { config } from '../config.js';

export default fp(async (fastify) => {
  const allowedOrigins = [
    config.FRONTEND_ORIGIN,
    'https://www.greytextileandmerchendise.com',
    'https://greytextileandmerchendise.com',
    'https://tnf-gules.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ].filter(Boolean);

  await fastify.register(cors, {
    origin: (origin, cb) => {
      if (!origin) {
        cb(null, true);
        return;
      }
      
      const isAllowed = allowedOrigins.some((allowed) => {
        if (origin === allowed) return true;
        try {
          const originUrl = new URL(origin);
          const allowedUrl = new URL(allowed);
          return originUrl.hostname === allowedUrl.hostname || originUrl.hostname.endsWith('.' + allowedUrl.hostname);
        } catch {
          return false;
        }
      });

      if (isAllowed) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
    credentials: true,                   // required for SameSite=None + credentialed fetch
    methods:     ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
});
