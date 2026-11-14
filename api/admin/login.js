const L=require('../_lib');
module.exports=async(req,res)=>{
  if(!L.guard(req,res,{method:'POST',open:true}))return;
  if(!L.env.ADMIN_PASSWORD||!L.env.SESSION_SECRET){L.send(res,503,{error:'not configured'});return}
  if(L.throttled(req)){L.send(res,429,{error:'too many attempts'});return}
  if(!L.sameOrigin(req)){L.send(res,403,{error:'forbidden'});return}
  const b=L.body(req),p=b.password;
  let role=null;
  if(typeof p==='string'&&p.length>0&&p.length<=200){
    if(L.safeEq(p,L.env.ADMIN_PASSWORD))role='admin';
    else if(L.env.TEACHER_PASSWORD&&L.safeEq(p,L.env.TEACHER_PASSWORD))role='teacher';
    else if(L.env.VIEWER_PASSWORD&&L.safeEq(p,L.env.VIEWER_PASSWORD))role='viewer';
  }
  if(role&&L.env.ADMIN_TOTP_SECRET&&role!=='viewer'&&!L.totpOk(L.env.ADMIN_TOTP_SECRET,b.code)){
    if(!b.code){L.send(res,401,{error:'Enter your 6-digit code',need2fa:true});return}
    role=null;
  }
  if(role){L.clearFail(req);L.send(res,200,{ok:true,role},{'Set-Cookie':L.cookie(L.makeToken(role),8*3600)});return}
  L.noteFail(req);
  await new Promise(r=>setTimeout(r,700));
  L.send(res,401,{error:'wrong password or code'});
};
