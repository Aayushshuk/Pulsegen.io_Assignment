export const withTenantFilter = (req,_res,next)=>{
  req.tenantFilter = { tenantId: req.user.tenantId };
  next();
};
