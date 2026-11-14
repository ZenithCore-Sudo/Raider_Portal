const L=require('./_lib');
let cache=null,at=0;
module.exports=async(req,res)=>{
  if(req.method!=='GET'){L.send(res,405,{error:'method'});return}
  let c={};
  try{if(L.ready()){if(!cache||Date.now()-at>10000){cache=(await L.readFile()).data.config;at=Date.now()}c=cache}}catch(e){c=cache||{}}
  L.send(res,200,{ok:true,locked:c.lockdown===true,testing:c.testingMode===true,maintenance:c.maintenanceMode===true,appsBlocked:c.noApps===true,linksBlocked:c.noLinks===true,time:new Date().toISOString()},{'Cache-Control':'public, s-maxage=10'});
};
