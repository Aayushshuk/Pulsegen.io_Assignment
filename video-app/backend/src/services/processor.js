import { execa } from 'execa';
import Video from '../models/Video.js';
import { io } from '../sockets/io.js';

async function setStatus(v, status, progress){
  await Video.findByIdAndUpdate(v._id, { status, processingProgress: progress });
  io.to(String(v.ownerId)).emit('processing:progress', { videoId: v._id, progress });
}

async function ffprobe(filePath){
  const { stdout } = await execa('ffprobe', ['-v','error','-show_entries','format=duration','-of','default=nk=1:nw=1', filePath]);
  return { duration: Math.round(parseFloat(stdout)) };
}

async function simpleSensitivityHeuristic(v){
  return /flag|nsfw|testbad/i.test(v.originalName) || (v.size > 800*1024*1024);
}

export async function processVideo(v){
  try{
    await setStatus(v, 'PROCESSING', 5);
    const meta = await ffprobe(v.storageKey);
    await setStatus(v, 'PROCESSING', 30);
    const flagged = await simpleSensitivityHeuristic(v);
    await setStatus(v, 'PROCESSING', 85);
    await Video.findByIdAndUpdate(v._id, {
      status: flagged ? 'FLAGGED' : 'SAFE',
      sensitivityScore: flagged ? 0.85 : 0.1,
      duration: meta.duration
    });
    io.to(String(v.ownerId)).emit('processing:complete', { videoId: v._id, status: flagged ? 'FLAGGED' : 'SAFE' });
  }catch(e){
    await Video.findByIdAndUpdate(v._id, { status: 'FAILED' });
    io.to(String(v.ownerId)).emit('processing:failed', { videoId: v._id });
  }
}
