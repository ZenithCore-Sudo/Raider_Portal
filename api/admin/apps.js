const L=require('../_lib');
module.exports=async(req,res)=>{
  if(!L.guard(req,res,{method:'GET',role:['admin','viewer']}))return;
  L.send(res,200,require('../_apps.json'));
};
