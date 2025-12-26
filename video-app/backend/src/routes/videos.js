import { Router } from 'express';
import Video from '../models/Video.js';
import { authn, requireRole } from '../auth/jwt.js';
import { withTenantFilter } from '../middlewares/tenant.js';
import { videoUpload } from '../middlewares/upload.js';
import { processVideo } from '../services/processor.js';
import { streamVideo } from '../services/stream.js';

const r = Router();
r.use(authn, withTenantFilter);

r.post('/upload', requireRole('EDITOR','ADMIN'), videoUpload.single('file'), async (req,res,next)=>{
  try{
    const v = await Video.create({
      tenantId: req.user.tenantId,
      ownerId: req.user.sub,
      title: req.body.title || req.file.originalname,
      originalName: req.file.originalname,
      storageKey: req.file.path,
      size: req.file.size
    });
    processVideo(v).catch(console.error);
    res.status(201).json(v);
  }catch(e){ next(e); }
});

r.get('/', async (req,res,next)=>{
  try{
    const q = { ...req.tenantFilter };
    if(req.query.status) q.status = req.query.status;
    if(req.query.q) q.title = new RegExp(String(req.query.q),'i');
    const items = await Video.find(q).sort({ createdAt: -1 }).limit(200);
    res.json(items);
  }catch(e){ next(e); }
});

r.get('/:id', async (req,res,next)=>{
  try{
    const v = await Video.findOne({ _id: req.params.id, ...req.tenantFilter });
    if(!v) return res.status(404).end();
    res.json(v);
  }catch(e){ next(e); }
});

r.get('/:id/stream', streamVideo);

export default r;
