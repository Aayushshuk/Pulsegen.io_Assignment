import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sign, seedAdmin } from '../auth/jwt.js';

const r = Router();

r.post('/seed-admin', async (_req,res)=>{
  const u = await seedAdmin();
  res.json({ ok: true, email: u.email, password: 'admin123' });
});

r.post('/register', async (req,res,next)=>{
  try{
    const { email, password, name, tenantId, role } = req.body;
    const exists = await User.findOne({ email });
    if(exists) return res.status(409).json({ error: 'Email in use' });
    const user = await User.create({
      email, name, tenantId: tenantId || 'demo-tenant',
      role: role || 'VIEWER',
      passwordHash: await bcrypt.hash(password, 10)
    });
    res.status(201).json({ user: { _id: user._id, email: user.email, name: user.name, tenantId: user.tenantId, role: user.role } });
  }catch(e){ next(e); }
});

r.post('/login', async (req,res,next)=>{
  try{
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if(!u || !await bcrypt.compare(password, u.passwordHash)) return res.status(401).json({ error: 'Invalid credentials' });
    const token = sign(u);
    res.json({ token, user: { _id: u._id, email: u.email, name: u.name, tenantId: u.tenantId, role: u.role } });
  }catch(e){ next(e); }
});

export default r;
