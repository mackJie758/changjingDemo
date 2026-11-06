/* 在低压业扩报装场景页面的开发者工具 Console 中执行。仅查询上门服务第一页。 */
(function () {
  'use strict';
  if (!/\/scene\/tool\//.test(location.pathname) ||
      !document.body.innerText.includes('低压业扩报装')) {
    console.error('请在低压业扩报装场景页面执行。');
    return;
  }
  if (window.__lowVoltageDiagnostic && window.__lowVoltageDiagnostic.running) {
    console.warn('诊断正在进行，请等待，不要重复执行。');
    return;
  }
  const id = '__lvDiagnostic_' + Date.now();
  const report = {
    version: 1, time: new Date().toISOString(), scenePath: location.pathname,
    node: '上门服务', pageNo: 1, pageSize: 20,
    stepCodes: ['BAC_0100414', 'BAC_0100213'],
    bridge: '尚未发送', stages: [], result: null,
    note: '一次只读查询；列表长度不代表完整总数；无回传不等于无权限或零待办。'
  };
  const state = window.__lowVoltageDiagnostic = { running: true, report: report };
  const panel = document.createElement('div');
  panel.style.cssText = 'position:fixed;right:16px;top:16px;width:440px;max-width:90vw;max-height:85vh;overflow:auto;background:white;color:#222;padding:16px;border:2px solid #008577;z-index:2147483647;font:14px/1.5 sans-serif;box-shadow:0 3px 20px #999';
  const title = document.createElement('strong');
  title.textContent = '低压业扩报装 · 只读诊断';
  const pre = document.createElement('pre');
  pre.style.cssText = 'white-space:pre-wrap;word-break:break-all;font-size:12px';
  const download = document.createElement('button');
  download.textContent = '下载诊断结果';
  download.onclick = function () {
    const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url; a.download = '低压诊断-' + Date.now() + '.json'; a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  };
  const close = document.createElement('button');
  close.textContent = '关闭面板';
  close.onclick = function () { panel.remove(); };
  panel.append(title, pre, download, close); document.body.appendChild(panel);
  function render() { pre.textContent = JSON.stringify(report, null, 2); }
  let timer;
  function finish(result) {
    report.result = result; state.running = false; clearTimeout(timer); render();
    // 保留本次唯一回调以接收迟到结果，不覆盖业务页面的原回调；刷新页面即清除。
  }
  window[id] = function (message) {
    report.stages.push(message);
    if (message.stage === 'completed') finish('已收到业务响应摘要，请核对 httpStatus、业务状态和数量字段');
    else if (message.stage === 'failed') finish('业务页已回传诊断失败阶段');
    else render();
  };
  // 此函数序列化后由现有客户端在已登录营销页面执行。
  function probe(callbackName, targetUrl) {
    function send(message) {
      if (typeof __prototype__ !== 'function') return false;
      try {
        __prototype__('sgBrowserExcuteJsCode', targetUrl,
          'window[' + JSON.stringify(callbackName) + '](' + JSON.stringify(message) + ')', 'show');
        return true;
      } catch (_) { return false; }
    }
    (async function () {
      send({ stage: 'script-started' });
      let token;
      try { token = sessionStorage.getItem('token'); }
      catch (_) { send({ stage: 'failed', reason: '无法读取营销页面登录状态' }); return; }
      if (!token) { send({ stage: 'failed', reason: '营销页面 sessionStorage.token 缺失，请先登录营销系统' }); return; }
      send({ stage: 'login-token-present', note: '仅确认存在，不代表令牌有效' });
      const controller = new AbortController();
      const timeout = setTimeout(function () { controller.abort(); }, 20000);
      let phase = 'fetch';
      try {
        const response = await fetch('http://25.73.2.220:31702/emss-cmnf-common-front/member/workOrderQuery/getWorkOrderToDoList', {
          method: 'POST', signal: controller.signal,
          headers: { 'Content-Type': 'application/json;charset=UTF-8', Accept: 'application/json, text/plain, */*', Auth_token: token },
          body: JSON.stringify({ wkOrderNo: '', wkOrderType: '00', procCodeList: ['BAC_0102600', 'BAC_0100200', 'BAC_0100400'],
            stepCodeList: ['BAC_0100414', 'BAC_0100213'], handleID: '', pageNo: '1', pageSize: '20', initUsers: [],
            busAttrName: '', busAttrNo: '', workItemStats: [], orderByCol: '', orderSort: '', cmprType: '' })
        });
        phase = 'decode-json';
        const payload = await response.json();
        const summary = { stage: 'completed', httpStatus: response.status, httpOk: response.ok,
          structure: [], counts: {}, businessStatus: {} };
        const forbidden = /token|cookie|authorization|password|secret/i;
        const countKeys = /^(total|totalCount|totalElements|totalRecords|recordCount|itemCount|count|pageNo|pageNum|pageSize|pages|totalPage|totalPages|size|current)$/i;
        function walk(value, path, depth) {
          if (summary.structure.length >= 100 || depth > 4) return;
          if (Array.isArray(value)) {
            summary.structure.push({ path: path, type: 'array', length: value.length });
            // 不读取任何列表记录，避免收集客户明细。
            return;
          }
          if (value && typeof value === 'object') {
            const keys = Object.keys(value).filter(function (k) { return !forbidden.test(k); }).slice(0, 50);
            summary.structure.push({ path: path, type: 'object', keys: keys });
            keys.forEach(function (key) {
              const child = value[key]; const childPath = path + '.' + key;
              if (countKeys.test(key) && (typeof child === 'number' || (typeof child === 'string' && /^\d+$/.test(child)))) summary.counts[childPath] = child;
              if (/^(code|status|success|ok)$/i.test(key) &&
                (typeof child === 'boolean' || typeof child === 'number' || (typeof child === 'string' && /^(\d+|success|error|fail|ok)$/i.test(child)))) summary.businessStatus[childPath] = child;
              walk(child, childPath, depth + 1);
            });
          } else summary.structure.push({ path: path, type: value === null ? 'null' : typeof value });
        }
        walk(payload, '$', 0);
        send(summary);
      } catch (error) {
        send({ stage: 'failed', phase: phase,
          reason: error && error.name === 'AbortError' ? '业务查询超过20秒' : phase === 'decode-json' ? '业务响应不是可解析JSON' : '业务请求失败，需检查登录、网络或跨域',
          errorType: error && ['AbortError', 'TypeError', 'SyntaxError'].includes(error.name) ? error.name : 'Error' });
      } finally { clearTimeout(timeout); }
    })();
  }
  render();
  if (typeof window.BrowserAction !== 'function') { finish('场景页没有 BrowserAction，未发送查询'); return; }
  timer = setTimeout(function () { finish('45秒内没有完成回传；查看已收到阶段，不能据此认定零待办'); }, 45000);
  report.bridge = '正在发送'; render();
  try {
    const result = window.BrowserAction('sgBrowserExcuteJsCodeByArea', 'http://emss20.md.sgcc.com.cn',
      '(' + probe.toString() + ')(' + JSON.stringify(id) + ',' + JSON.stringify(location.href) + ');', 'hide');
    Promise.resolve(result).then(function (reply) {
      report.bridge = reply && reply.accepted === true ? '本地服务已接受指令（不等于业务成功）' : '调用已返回，需以业务回传为准'; render();
    }, function () { report.bridge = '本地调用异常'; render(); });
  } catch (_) { report.bridge = '本地调用抛出异常'; finish('未能正常调用客户端'); }
})();
