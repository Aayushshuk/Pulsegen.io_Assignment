import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import fs from 'node:fs';

import authRoutes from './routes/auth.js';
import videoRoutes from './routes/videos.js';
import { initIO } from './sockets/io.js';

const app = express();
app.use(cors());
app.use(express.json());

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.get('/api/health', (_req,res)=> res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

async function main(){
  await mongoose.connect(process.env.MONGO_URI);
  const server = http.createServer(app);
  initIO(server);
  const port = process.env.PORT || 4000;
  server.listen(port, ()=> console.log('Backend listening on', port));
}
main().catch(e=>{ console.error(e); process.exit(1); });
