/* 临时诊断：只包装现有营销待办查询，不增加查询，不记录工单内容和令牌。 */
(function () {
  'use strict';
  const VERSION = 'embedded-2-20260923';
  const startedAt = Date.now();
  const sessionId = startedAt + '-' + Math.random().toString(36).slice(2, 8);
  const records = [];
  let serial = 0;
  const pending = new Map();
  function log(event) {
    const entry = Object.assign({ time: new Date().toISOString(), elapsedMs: Date.now() - startedAt }, event);
    records.push(entry);
    if (records.length > 1500) records.shift();
    console.info('[低压取数诊断]', entry);
  }
  window.lowVoltageDiagnosticReceive = function (event) {
    log(event);
    if (event.stage === 'callback-applied' || event.stage === 'callback-error' || event.stage === 'query-error') {
      clearTimeout(pending.get(event.id)); pending.delete(event.id);
    }
  };
  // 此函数的代码在营销页面中执行；占位符由原查询脚本替换。
  function remoteWrapper(id, node, target) {
    const nativeFetch = window.fetch.bind(window);
    const nativeBridge = window.__prototype__;
    function emit(event) {
      event.id = id; event.node = node;
      console.info('[低压业务查询诊断]', event);
      try {
        nativeBridge('sgBrowserExcuteJsCode', target,
          'window.lowVoltageDiagnosticReceive(' + JSON.stringify(event) + ')', 'show');
      } catch (_) { console.warn('[低压业务查询诊断]诊断回传失败'); }
    }
    function summary(value, path, depth, result) {
      if (depth > 3 || result.structure.length > 70) return;
      if (Array.isArray(value)) { result.structure.push({ path: path, type: 'array', length: value.length }); return; }
      if (value && typeof value === 'object') {
        const keys = Object.keys(value).filter(function (k) { return !/token|cookie|authorization|password|secret/i.test(k); }).slice(0, 40);
        result.structure.push({ path: path, type: 'object', keys: keys });
        keys.forEach(function (k) {
          const v = value[k];
          if (/^(total|totalCount|totalElements|itemCount|count|pageNo|pageSize|pages|current|code|status|success|ok)$/i.test(k) &&
              (typeof v === 'number' || typeof v === 'boolean' || typeof v === 'string' && /^(\d+|success|fail|error|ok)$/i.test(v))) result.values[path + '.' + k] = v;
          summary(v, path + '.' + k, depth + 1, result);
        });
      } else result.structure.push({ path: path, type: value === null ? 'null' : typeof value });
    }
    function fetch(url, options) {
      return nativeFetch(url, options).then(function (res) {
        emit({ stage: 'http-response', status: res.status, ok: res.ok });
        // 代理json读取，保持原响应及业务回调数据不变。
        return { json: function () { return res.json().then(function (data) {
          const result = { stage: 'business-response', structure: [], values: {} };
          summary(data, '$', 0, result); emit(result); return data;
        }); } };
      });
    }
    function __prototype__() {
      const args = Array.prototype.slice.call(arguments);
      // 原业务回调和诊断标记放在同一次客户端回传里，验证回调实际执行。
      if (args[0] === 'sgBrowserExcuteJsCode' && typeof args[2] === 'string') {
        const original = args[2];
        const event = JSON.stringify({ id: id, node: node, stage: 'callback-applied' });
        args[2] = 'try {' + original + ';window.lowVoltageDiagnosticReceive(' + event + ');} catch(e) {window.lowVoltageDiagnosticReceive(' +
          JSON.stringify({ id: id, node: node, stage: 'callback-error', reason: '原数量赋值或回调执行异常' }) + ');}';
      }
      const result = nativeBridge.apply(window, args);
      emit({ stage: 'callback-dispatched', note: '已调用回传，实际赋值以callback-applied为准' });
      return result;
    }
    emit({ stage: 'script-started' });
    try {
      Promise.resolve((function () {
        /* ORIGINAL_QUERY */
      })()).catch(function () { emit({ stage: 'query-error', reason: '请求、JSON解析或回传异常，未导出原始错误内容' }); });
    } catch (_) { emit({ stage: 'query-error', reason: '业务脚本同步异常' }); }
  }
  const names = { oderlist: '上门服务', oderlist1: '合同生成', oderlist2: '计量设备配置出库', oderlist3: '配套工程跟踪',
    oderlist4: '装表接电', oderlist5: '空间拓扑绘图', oderlist6: '信息归档', oderlist7: '档案归档', oderlist8: '线上业务受理' };
  const fields = ['ysl','ywsl','smfu','gzp','htqc','jlsb','ptgc','zbjd','kjtb','xxgd','dagd'];
  const lists = ['ysllist','ywsllist','smfulist','gzplist','htqclist','jlsblist','ptgclist','smfulist2','zbjdlist','kjtblist','xxgdlist','xxgdlist2','dagdlist'];
  function numeric(value) {
    return typeof value === 'number' && Number.isFinite(value) ? value :
      typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : null;
  }
  function vmSummary(instance) {
    if (!instance) return null;
    const counts = {}, lengths = {};
    fields.forEach(function (key) { counts[key] = { value: numeric(instance[key]), type: typeof instance[key] }; });
    lists.forEach(function (key) { lengths[key] = Array.isArray(instance[key]) ? instance[key].length : null; });
    return { counts: counts, listLengths: lengths, overdueTotal: numeric(instance.overdueTotal),
      archiveSameReference: Array.isArray(instance.xxgdlist) && instance.xxgdlist === instance.xxgdlist2,
      popup: { visible: instance.popupVisible === true, length: Array.isArray(instance.popupList) ? instance.popupList.length : null,
        pageSize: numeric(instance.pageSize), page: numeric(instance.currentPopupPage) } };
  }
  function snapshot() {
    const app = document.getElementById('app');
    let lexical = null;
    try { if (typeof mac !== 'undefined') lexical = mac; } catch (_) { /* Vue尚在初始化 */ }
    const domVm = app && app.__vue__;
    const badges = Array.from(document.querySelectorAll('.flow-node .badge')).map(function (badge) {
      const parent = badge.closest('.flow-node');
      const label = parent && parent.querySelector('.flow-sub');
      const style = getComputedStyle(badge);
      const text = badge.textContent.trim();
      return { node: label ? label.textContent.trim().slice(0, 60) : '未识别节点',
        text: /^(\d+\+?)?$/.test(text) ? text : '[非数字内容]',
        visible: style.display !== 'none' && style.visibility !== 'hidden' && badge.getClientRects().length > 0 };
    });
    return { windowMac: vmSummary(window.mac), lexicalMac: vmSummary(lexical), domVue: vmSummary(domVm),
      instanceMatch: { windowAndDom: !!window.mac && window.mac === domVm, windowAndLexical: !!window.mac && window.mac === lexical },
      badges: badges, readyState: document.readyState, visibility: document.visibilityState };
  }
  function safeSnapshot() { try { return snapshot(); } catch (_) { return { snapshotError: true }; } }
  log({ stage: 'diagnostic-loaded', version: VERSION, sessionId: sessionId, readyState: document.readyState });
  const originalAction = window.BrowserAction;
  if (typeof originalAction === 'function') {
    window.BrowserAction = function () {
      const args = Array.prototype.slice.call(arguments);
      if (args[0] !== 'sgBrowserExcuteJsCodeByArea' || typeof args[2] !== 'string' || !args[2].includes('/getWorkOrderToDoList'))
        return originalAction.apply(this, args);
      const match = args[2].match(/window\.(oderlist\d*)\(/);
      const node = match ? names[match[1]] : '未知节点';
      const id = ++serial;
      log({ id: id, node: node, stage: 'query-dispatched', pageNo: 1, pageSize: 20 });
      // 直接包装场景页已注册的原回调，独立于营销侧新增日志判断数据是否到达。
      if (match && typeof window[match[1]] === 'function') {
        const originalCallback = window[match[1]];
        window[match[1]] = function (data) {
          log({ id: id, node: node, stage: 'original-callback-entered',
            payloadType: Array.isArray(data) ? 'array' : data === null ? 'null' : typeof data,
            length: Array.isArray(data) ? data.length : null });
          try {
            const result = originalCallback.apply(this, arguments);
            log({ id: id, node: node, stage: 'original-callback-completed', snapshot: safeSnapshot() });
            clearTimeout(pending.get(id)); pending.delete(id);
            return result;
          } catch (error) { log({ id: id, node: node, stage: 'original-callback-threw' }); throw error; }
        };
      }
      const source = args[2].trim().replace(/^fetch\(/, 'return fetch(');
      args[2] = '(' + remoteWrapper.toString().replace('/* ORIGINAL_QUERY */', function () { return source; }) + ')(' +
        JSON.stringify(id) + ',' + JSON.stringify(node) + ',' + JSON.stringify(location.href) + ');';
      pending.set(id, setTimeout(function () {
        log({ id: id, node: node, stage: 'timeout', note: '45秒未收到查询完成标记，不等于零待办', snapshot: safeSnapshot() }); pending.delete(id);
      }, 45000));
      try {
        const result = originalAction.apply(this, args);
        Promise.resolve(result).then(function (reply) {
          log({ id: id, node: node, stage: 'bridge-returned', accepted: !!(reply && reply.accepted === true) });
        }, function () { log({ id: id, node: node, stage: 'bridge-error' }); });
        return result;
      } catch (error) { log({ id: id, node: node, stage: 'bridge-error' }); throw error; }
    };
  } else log({ stage: 'bridge-missing' });
  function install() {
    const button = document.createElement('button');
    const label = document.createElement('div');
    label.style.cssText = 'position:fixed;right:16px;bottom:58px;z-index:2147483647;padding:8px;background:#fff;color:#00665c;font-size:13px';
    document.body.appendChild(label);
    let previous = '';
    let heartbeat = 0;
    function sample() {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const current = safeSnapshot();
      const serialized = JSON.stringify(current);
      if (serialized !== previous || heartbeat % 15 === 0) {
        log({ stage: serialized !== previous ? 'page-state-changed' : 'heartbeat', snapshot: current }); previous = serialized;
      }
      heartbeat++;
      label.textContent = '诊断V2 · 已运行' + elapsed + '秒 · ' + sessionId + (elapsed < 60 ? ' · 请等满60秒' : ' · 可以下载');
      button.textContent = elapsed < 60 ? '下载日志（尚未满60秒）' : '下载低压诊断V2日志';
    }
    sample();
    const sampler = setInterval(sample, 2000);
    window.addEventListener('pagehide', function () { clearInterval(sampler); });
    document.addEventListener('click', function (event) {
      if (event.target.closest && event.target.closest('.flow-node .badge')) {
        log({ stage: 'badge-clicked', snapshot: safeSnapshot() });
        setTimeout(function () { log({ stage: 'after-badge-click', snapshot: safeSnapshot() }); }, 100);
      }
    }, true);
    window.addEventListener('error', function (event) {
      log({ stage: 'page-error', line: event.lineno || null, column: event.colno || null,
        errorType: event.error && ['TypeError','ReferenceError','SyntaxError','RangeError'].includes(event.error.name) ? event.error.name : 'Error' });
    });
    window.addEventListener('unhandledrejection', function () { log({ stage: 'unhandled-rejection' }); });
    button.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:2147483647;padding:8px 14px;background:#fff;color:#00665c;border:1px solid #00665c;cursor:pointer';
    button.onclick = function () {
      const elapsedMs = Date.now() - startedAt;
      log({ stage: 'export-clicked', snapshot: safeSnapshot() });
      const blob = new Blob([JSON.stringify({ version: VERSION, sessionId: sessionId, scenePath: location.pathname,
        time: new Date().toISOString(), elapsedMs: elapsedMs, exportedEarly: elapsedMs < 60000,
        snapshot: safeSnapshot(), pendingRequestIds: Array.from(pending.keys()), records: records }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob); const a = document.createElement('a');
      a.href = url; a.download = '低压内置诊断V2-' + Date.now() + '.json'; a.click();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    };
    document.body.appendChild(button);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install); else install();
})();
