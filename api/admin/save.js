const L=require('../_lib');
module.exports=async(req,res)=>{
  if(!L.guard(req,res,{method:'POST',write:true}))return;
  if(!L.ready()){L.send(res,503,{error:'not configured'});return}
  const b=L.body(req);
  try{
    let data,sha=typeof b.sha==='string'?b.sha:null;
    if(req.role==='teacher'){
      const cur=await L.readFile();
      const incoming=L.clean(b.config);
      const merged={...cur.data.config};
      L.TEACHER_KEYS.forEach(k=>{if(k in incoming)merged[k]=incoming[k];else delete merged[k]});
      data={config:L.clean(merged),presets:cur.data.presets,notes:cur.data.notes};
      sha=cur.sha;
    }else data={config:L.clean(b.config),presets:L.cleanPresets(b.presets),notes:L.str(b.notes,6000)};
    const r=await L.writeFile(data,sha,(req.role==='teacher'?'teacher: ':'admin: ')+(b.message||'update settings'));
    if(r.conflict){L.send(res,409,{error:'The settings changed somewhere else. Reload and try again.'});return}
    L.send(res,200,{ok:true,sha:r.sha,config:data.config,presets:data.presets,notes:data.notes});
  }catch(e){L.send(res,502,{error:String(e.message)})}
};
