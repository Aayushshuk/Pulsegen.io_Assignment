import fs from 'node:fs';
import Video from '../models/Video.js';

export async function streamVideo(req,res){
  const v = await Video.findById(req.params.id);
  if(!v) return res.status(404).end();
  if (v.tenantId !== req.user.tenantId) return res.status(403).end();
  const filePath = v.storageKey;
  const stat = fs.statSync(filePath);
  const range = req.headers.range;
  if(!range){
    res.writeHead(200, { 'Content-Length': stat.size, 'Content-Type': 'video/mp4' });
    return fs.createReadStream(filePath).pipe(res);
  }
  const [startStr, endStr] = range.replace(/bytes=/,'').split('-');
  const start = parseInt(startStr,10);
  const end = endStr ? parseInt(endStr,10) : stat.size - 1;
  const chunk = (end - start) + 1;
  res.writeHead(206, {
    'Content-Range': `bytes ${start}-${end}/${stat.size}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunk,
    'Content-Type': 'video/mp4'
  });
  fs.createReadStream(filePath, { start, end }).pipe(res);
}
