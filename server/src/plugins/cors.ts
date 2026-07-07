// server/src/plugins/cors.ts
import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import { config } from '../config.js';

export default fp(async (fastify) => {
  await fastify.register(cors, {
    origin:      config.FRONTEND_ORIGIN,
    credentials: true,                   // required for SameSite=None + credentialed fetch
    methods:     ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
});
