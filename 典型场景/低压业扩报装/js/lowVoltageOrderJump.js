/* 只负责原工单跳转协议：打开营销页，5秒后写入原有两个参数；不查询或处理工单。 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LowVoltageOrderJump = factory();
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';
  const TARGET = 'http://emss20.md.sgcc.com.cn';
  function writeAndConfirm(serialized, source, callback) {
    var result;
    try {
      // 顺序、键名、值与原场景保持一致，不额外触发刷新或菜单点击。
      localStorage.setItem('tiaozhuan', 'td');
      localStorage.setItem('popupItem', serialized);
      result = { status: localStorage.getItem('tiaozhuan') === 'td' && localStorage.getItem('popupItem') === serialized
        ? 'written' : 'unconfirmed' };
    } catch (_) { result = { status: 'write-failed' }; }
    try {
      __prototype__('sgBrowserExcuteJsCode', source,
        'if(typeof window[' + JSON.stringify(callback) + ']==="function"){window[' + JSON.stringify(callback) + '](' + JSON.stringify(result) + ');}', 'show');
    } catch (_) { /* 确认通道失败不能阻断原有业务参数写入；来源页会提示未确认 */ }
  }
  function create(options) {
    options = options || {};
    const host = options.host || window;
    let active = null, disposed = false;
    function cancel() {
      if (!active) return;
      host.clearTimeout(active.delay); host.clearTimeout(active.timeout);
      delete host[active.callback]; active = null;
    }
    function open(row) {
      if (disposed) return;
      cancel();
      const task = { callback: '__lvOrderJump_' + Date.now() + '_' + Math.random().toString(36).slice(2) };
      active = task;
      function finish(status) {
        if (active !== task || disposed) return;
        cancel();
        if (options.onResult) options.onResult({ status: status });
      }
      let serialized;
      try {
        if (!row || typeof row !== 'object' || Array.isArray(row)) throw new Error('invalid');
        serialized = JSON.stringify(row);
      } catch (_) { finish('invalid-row'); return; }
      if (typeof host.BrowserAction !== 'function') { finish('client-unavailable'); return; }
      host[task.callback] = function (result) {
        if (result && ['written', 'unconfirmed', 'write-failed'].includes(result.status)) finish(result.status);
      };
      try {
        const opened = host.BrowserAction('sgBrowerserOpenPage', TARGET);
        Promise.resolve(opened).then(function (reply) {
          if (reply && (reply.ok === false || reply.accepted === false)) finish('open-failed');
        }, function () { finish('open-failed'); });
        task.delay = host.setTimeout(function () {
          if (active !== task || disposed) return;
          const script = '(' + writeAndConfirm.toString() + ')(' + JSON.stringify(serialized) + ',' +
            JSON.stringify(host.location.href) + ',' + JSON.stringify(task.callback) + ');';
          task.timeout = host.setTimeout(function () { finish('unconfirmed'); }, 15000);
          try {
            // 与最初低压场景使用的命令一致，不能替换成ByArea。
            const result = host.BrowserAction('sgBrowserExcuteJsCode', TARGET, script);
            Promise.resolve(result).then(function (reply) {
              if (reply && (reply.ok === false || reply.accepted === false)) finish('inject-failed');
            }, function () { finish('inject-failed'); });
          } catch (_) { finish('inject-failed'); }
        }, 5000);
      } catch (_) { finish('open-failed'); }
    }
    return { open: open, dispose: function () { disposed = true; cancel(); } };
  }
  function message(status) {
    const messages = {
      written: '工单参数已写入营销页面；若仍停在首页，需检查营销侧详情定位逻辑',
      unconfirmed: '未收到工单参数写入确认，请检查营销页面；这不代表参数一定未写入',
      'write-failed': '营销页面写入工单参数失败',
      'open-failed': '打开营销系统失败',
      'inject-failed': '客户端执行工单定位脚本失败',
      'client-unavailable': '请在一平台客户端中打开工单',
      'invalid-row': '工单数据无法用于跳转'
    };
    return messages[status] || '工单跳转状态未知';
  }
  return { create: create, message: message };
});
