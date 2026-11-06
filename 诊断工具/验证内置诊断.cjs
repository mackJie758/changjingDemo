const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const helper = fs.readFileSync('典型场景/低压业扩报装/js/sceneDiagnostics.js', 'utf8');
const html = fs.readFileSync('典型场景/低压业扩报装/index.html', 'utf8');
const scripts = [...html.matchAll(/let callback = `([\s\S]*?)`;\s*window\.BrowserAction\("sgBrowserExcuteJsCodeByArea"/g)]
  .map(m => m[1]).filter(s => s.includes('getWorkOrderToDoList'));
assert.equal(scripts.length, 9);
(async () => {
  for (const [index, template] of scripts.entries()) {
    const source = vm.runInNewContext('`' + template + '`', {location:{href:'http://test/scene/tool/id/'}});
    let wrapped;
    const logs = [];
    const context = { console:{info:(...x)=>logs.push(x),warn:()=>{}}, location:{href:'http://test/scene/tool/id/'},
      document:{readyState:'loading',addEventListener:()=>{}}, setTimeout:()=>1,clearTimeout:()=>{},
      BrowserAction:(...args)=>{wrapped=args[2];return {accepted:true};} };
    context.window=context; vm.createContext(context); vm.runInContext(helper,context);
    let assigned;
    const cb='oderlist'+(index || ''); context[cb]=data=>{assigned=data.length;};
    context.BrowserAction('sgBrowserExcuteJsCodeByArea','http://marketing',source,'hide');
    new vm.Script(wrapped);
    const remote={sessionStorage:{token:'TEST_ONLY'},console:{info:()=>{},warn:()=>{}},
      fetch:async()=>({status:200,ok:true,json:async()=>({code:200,total:31,data:[{privateValue:'DO_NOT_EXPORT'}]})}),
      __prototype__:(method,target,code)=>vm.runInContext(code,context)};
    remote.window=remote; vm.runInNewContext(wrapped,remote);
    await new Promise(resolve=>setImmediate(resolve));
    assert.equal(assigned,1);
    const serialized=JSON.stringify(logs);
    assert(serialized.includes('callback-applied'));
    assert(serialized.includes('business-response'));
    assert(serialized.includes('31'));
    assert(!serialized.includes('DO_NOT_EXPORT'));
    assert(!serialized.includes('TEST_ONLY'));
  }
  const elements=[]; let installer, exported;
  const businessVm={ptgc:'27',ptgclist:Array(27).fill({customer:'DO_NOT_EXPORT'}),overdueTotal:27};
  const dom={readyState:'loading',visibilityState:'visible',
    addEventListener:(name,fn)=>{if(name==='DOMContentLoaded')installer=fn;},
    getElementById:()=>({__vue__:businessVm}),
    querySelectorAll:()=>[{closest:()=>({querySelector:()=>({textContent:'配套工程跟踪'})}),textContent:'27',getClientRects:()=>[{}]}],
    createElement:()=>{const e={style:{},click(){}};elements.push(e);return e;},body:{appendChild(){}}};
  const ui={document:dom,mac:businessVm,console:{info(){},warn(){}},location:{pathname:'/scene/tool/id/',href:'http://test/scene/tool/id/'},
    setTimeout:()=>1,clearTimeout(){},setInterval:()=>1,clearInterval(){},addEventListener(){},
    getComputedStyle:()=>({display:'block',visibility:'visible'}),BrowserAction(){},
    Blob:function(parts){exported=JSON.parse(parts[0]);},URL:{createObjectURL:()=> 'blob:test',revokeObjectURL(){}}};
  ui.window=ui;vm.createContext(ui);vm.runInContext(helper,ui);installer();
  elements.find(e=>typeof e.onclick==='function').onclick();
  assert.equal(exported.snapshot.windowMac.counts.ptgc.value,27);
  assert.equal(exported.snapshot.windowMac.counts.ptgc.type,'string');
  assert.equal(exported.snapshot.domVue.listLengths.ptgclist,27);
  assert.equal(exported.snapshot.badges[0].text,'27');
  assert.equal(exported.exportedEarly,true);
  assert(!JSON.stringify(exported).includes('DO_NOT_EXPORT'));
  console.log('九项查询回调、总数摘要、V2页面采集、字符串数量、提前导出标识和敏感值排除验证通过');
})().catch(error=>{console.error(error);process.exitCode=1;});
