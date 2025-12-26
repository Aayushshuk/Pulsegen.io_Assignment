import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const sign = (u) => jwt.sign(
  { sub: u._id, role: u.role, tenantId: u.tenantId, email: u.email },
  process.env.JWT_SECRET, { expiresIn: '12h' }
);

export const authn = (req, _res, next) => {
  try {
    const token = (req.headers.authorization || '').replace('Bearer ','').trim();
    if(!token) throw new Error('Missing token');
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    next({ status: 401, message: 'Unauthorized' });
  }
};

export const requireRole = (...roles) => (req,_res,next)=> {
  if(roles.includes(req.user?.role)) return next();
  next({ status: 403, message: 'Forbidden' });
};

export async function seedAdmin(){
  const email = 'admin@example.com';
  const exists = await User.findOne({ email });
  if(exists) return exists;
  const u = await User.create({
    email,
    name: 'Admin',
    tenantId: 'demo-tenant',
    role: 'ADMIN',
    passwordHash: await bcrypt.hash('admin123', 10)
  });
  return u;
}
