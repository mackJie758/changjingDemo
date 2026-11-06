/* 首页与低压独立场景共用。数量严格取各节点返回列表长度，保留原场景第一页口径。 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LowVoltageTodo = factory();
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';
  const TOOL_ID = 'af249b3a3497713f329efa163eb5b4a3';
  const MARKETING = 'http://emss20.md.sgcc.com.cn';
  const nodes = [
    { key: 'ywsl', name: '线上业务受理', list: 'ywsllist', steps: ['BAC_0100408', 'BAC_0100216'] },
    { key: 'smfu', name: '上门服务', list: 'smfulist', steps: ['BAC_0100414', 'BAC_0100213'] },
    { key: 'htqc', name: '合同生成', list: 'htqclist', steps: ['BAC_0100204', 'BAC_0102608'] },
    { key: 'jlsb', name: '计量设备配置出库', list: 'jlsblist', steps: ['BAC_0100409', 'BAC_0100205', 'BAC_0102606'] },
    { key: 'ptgc', name: '配套工程跟踪', list: 'ptgclist', steps: ['BAC_0100419', 'BAC_0100224'] },
    { key: 'zbjd', name: '装表接电', list: 'zbjdlist', steps: ['BAC_0100410', 'BAC_0100209', 'BAC_0102611'] },
    { key: 'kjtb', name: '空间拓扑绘图', list: 'kjtblist', steps: ['BAC_0102618'] },
    { key: 'xxgd', name: '信息归档', list: 'xxgdlist2', steps: ['BAC_0100215', 'BAC_0100411', 'BAC_0102616'] },
    { key: 'dagd', name: '档案归档', list: 'dagdlist', steps: ['BAC_0100407', 'BAC_0100212', 'BAC_01026122'] }
  ];
  function isOverdue(recTime, now) {
    if (!recTime) return false;
    return ((now || Date.now()) - new Date(recTime).getTime()) / 3600000 > 36;
  }
  function paramsFor(node) {
    return { wkOrderNo: '', wkOrderType: '00', procCodeList: ['BAC_0102600', 'BAC_0100200', 'BAC_0100400'],
      stepCodeList: node.steps, handleID: '', pageNo: '1', pageSize: '20', initUsers: [], busAttrName: '',
      busAttrNo: '', workItemStats: [], orderByCol: '', orderSort: '', cmprType: '' };
  }
  function getIdentity(host) {
    try {
      const user = JSON.parse(host.localStorage.getItem('userinfo') || '{}');
      return String(user.userId || user.account || '');
    } catch (_) { return ''; }
  }
  // 保持原客户端 __prototype__ 回传方式；只有原查询结果成功解析为数组才标记成功。
  function remoteQuery(params, target, callback) {
    function reply(value) {
      __prototype__('sgBrowserExcuteJsCode', target,
        'if(typeof window[' + JSON.stringify(callback) + ']==="function"){window[' + JSON.stringify(callback) + '](' + JSON.stringify(value) + ');}', 'show');
    }
    try {
      const token = sessionStorage.getItem('token');
      if (!token) { reply({ ok: false, reason: '请先登录营销2.0' }); return; }
      fetch('http://25.73.2.220:31702/emss-cmnf-common-front/member/workOrderQuery/getWorkOrderToDoList', {
        method: 'POST', headers: { 'Content-Type': 'application/json;charset=UTF-8', Accept: 'application/json, text/plain, */*', Auth_token: token },
        body: JSON.stringify(params)
      }).then(function (response) {
        if (!response.ok) throw new Error('HTTP');
        return response.json();
      }).then(function (body) {
        if (!body || body.success === false || body.ok === false || !Array.isArray(body.data)) {
          reply({ ok: false, reason: '未获取到有效待办列表，请检查业务系统登录及权限' }); return;
        }
        if ([401,403,500,'401','403','500'].includes(body.code) || [401,403,500,'401','403','500'].includes(body.status)) {
          reply({ ok: false, reason: '业务系统返回失败状态' }); return;
        }
        reply({ ok: true, rows: body.data });
      }).catch(function () { reply({ ok: false, reason: '营销查询失败，请检查登录状态后刷新' }); });
    } catch (_) { reply({ ok: false, reason: '营销页面尚未就绪，请稍后刷新' }); }
  }
  function buildQuery(node, target, callback) {
    return '(' + remoteQuery.toString() + ')(' + JSON.stringify(paramsFor(node)) + ',' + JSON.stringify(target) + ',' + JSON.stringify(callback) + ');';
  }
  function createClient(options) {
    options = options || {};
    const host = options.host || window;
    const states = nodes.map(function (node) { return Object.assign({}, node, { rows: [], status: 'idle', error: '', updatedAt: 0 }); });
    const instance = 'lv' + Date.now() + Math.random().toString(36).slice(2);
    const pending = new Map();
    const timers = new Set();
    let sequence = 0, disposed = false, channel = null, identity = getIdentity(host), lastStart = 0;
    function emit() { if (!disposed && options.onChange) options.onChange(states.map(function (s) { return Object.assign({}, s); })); }
    function later(fn, ms) {
      const id = host.setTimeout(function () { timers.delete(id); if (!disposed) fn(); }, ms);
      timers.add(id); return id;
    }
    function cancel(key) {
      const p = pending.get(key);
      if (p) { host.clearTimeout(p.timer); timers.delete(p.timer); delete host[p.callback]; pending.delete(key); }
    }
    function broadcast(state) {
      if (channel) {
        try { channel.postMessage({ type: 'result', owner: identity, key: state.key, rows: state.rows, updatedAt: state.updatedAt, sender: instance }); } catch (_) { /* 同步不可用时独立查询 */ }
      }
    }
    function connect() {
      if (channel) channel.close(); channel = null;
      if (!identity || typeof host.BroadcastChannel !== 'function') return;
      try {
        channel = new host.BroadcastChannel('ypt-low-voltage-v1-' + identity);
        channel.onmessage = function (event) {
          if (disposed || getIdentity(host) !== identity) return;
          const message = event.data;
          if (!message || message.owner !== identity || message.sender === instance) return;
          if (message.type === 'request') {
            states.filter(function (s) { return s.status === 'success' && Date.now() - s.updatedAt < 60000; }).forEach(broadcast); return;
          }
          const state = states.find(function (s) { return s.key === message.key; });
          if (message.type !== 'result' || !state || !Array.isArray(message.rows) || !Number.isFinite(message.updatedAt) ||
              message.updatedAt <= state.updatedAt || Date.now() - message.updatedAt > 60000 || message.updatedAt > Date.now() + 5000) return;
          const currentRequest = pending.get(state.key);
          if (currentRequest && message.updatedAt < currentRequest.stamp) return;
          cancel(state.key); Object.assign(state, { rows: message.rows, updatedAt: message.updatedAt, status: 'success', error: '' }); emit();
        };
        channel.postMessage({ type: 'request', owner: identity, sender: instance });
      } catch (_) { channel = null; }
    }
    function ensureIdentity() {
      const current = getIdentity(host);
      if (current === identity) return;
      states.forEach(function (s) { cancel(s.key); Object.assign(s, { rows: [], status: 'idle', updatedAt: 0, error: '' }); });
      identity = current; connect(); emit();
    }
    function query(state, attempt) {
      if (disposed) return;
      ensureIdentity(); cancel(state.key);
      const callback = '__lowVoltage_' + instance + '_' + (++sequence);
      const owner = identity;
      const stamp = Date.now();
      Object.assign(state, { rows: [], status: 'loading', error: '' }); emit();
      function complete(result) {
        if (disposed || !pending.has(state.key) || pending.get(state.key).callback !== callback) return;
        cancel(state.key);
        if (getIdentity(host) !== owner) { ensureIdentity(); return; }
        if (result && result.ok === true && Array.isArray(result.rows)) {
          if (stamp < state.updatedAt) return;
          Object.assign(state, { rows: result.rows, status: 'success', error: '', updatedAt: stamp }); broadcast(state); emit();
        } else if (attempt < 1) {
          const previousStamp = state.updatedAt;
          later(function () { if (getIdentity(host) === owner && state.updatedAt === previousStamp && state.status !== 'success') query(state, attempt + 1); }, 3000);
        } else {
          Object.assign(state, { rows: [], status: 'error', error: result && result.reason || '查询超时，未收到业务回传' }); emit();
        }
      }
      host[callback] = complete;
      const timer = later(function () { complete({ ok: false, reason: '查询超时，未收到业务回传' }); }, options.timeout || 20000);
      pending.set(state.key, { timer: timer, callback: callback, stamp: stamp });
      try {
        const reply = host.BrowserAction('sgBrowserExcuteJsCodeByArea', MARKETING, buildQuery(state, host.location.href, callback), 'hide');
        Promise.resolve(reply).catch(function () { complete({ ok: false, reason: '客户端调用失败' }); });
      } catch (_) { complete({ ok: false, reason: '客户端不可用' }); }
    }
    function refresh(force) {
      if (disposed) return;
      ensureIdentity();
      if (pending.size || Date.now() - lastStart < 2000 || (!force && Date.now() - lastStart < 30000)) return;
      lastStart = Date.now();
      if (typeof host.BrowserAction !== 'function') {
        states.forEach(function (s) { Object.assign(s, { rows: [], status: 'error', error: '请在一平台客户端中查看待办' }); }); emit(); return;
      }
      try { Promise.resolve(host.BrowserAction('sgHideBrowerserOpenPage', MARKETING)).catch(function () {}); } catch (_) { /* 请求时报告错误 */ }
      states.forEach(function (state, index) {
        const before = state.updatedAt;
        later(function () { if (state.updatedAt === before) query(state, 0); }, 2500 + index * 120);
      });
    }
    function focus() { if (!host.document || host.document.visibilityState !== 'hidden') refresh(false); }
    function dispose() {
      disposed = true; timers.forEach(function (id) { host.clearTimeout(id); }); timers.clear();
      states.forEach(function (s) { cancel(s.key); }); if (channel) channel.close();
      host.removeEventListener('focus', focus); host.removeEventListener('storage', focus);
    }
    connect(); emit(); host.addEventListener('focus', focus); host.addEventListener('storage', focus);
    return { refresh: refresh, dispose: dispose };
  }
  return { TOOL_ID: TOOL_ID, MARKETING: MARKETING, nodes: nodes, isOverdue: isOverdue, paramsFor: paramsFor, buildQuery: buildQuery, createClient: createClient };
});
