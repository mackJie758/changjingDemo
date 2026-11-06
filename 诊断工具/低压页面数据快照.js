/* 仅读取当前低压场景内存，不发送网络请求，不更改角标。 */
(function () {
  'use strict';
  if (!/\/scene\/tool\//.test(location.pathname) || !document.body.innerText.includes('低压业扩报装')) {
    console.error('请在低压业扩报装场景页执行'); return;
  }
  const app = document.getElementById('app');
  const vm = window.mac || (app && app.__vue__);
  if (!vm || !('ptgc' in vm) || !('ptgclist' in vm)) {
    console.error('未找到低压页面数据，请确认控制台选择了场景所在的页面/框架。'); return;
  }
  const definitions = [
    ['预受理', 'ysl', 'ysllist', false],
    ['线上业务受理', 'ywsl', 'ywsllist', true],
    ['上门服务', 'smfu', 'smfulist', true],
    ['营销作业平台', 'gzp', 'gzplist', false],
    ['合同生成', 'htqc', 'htqclist', true],
    ['计量设备配置出库', 'jlsb', 'jlsblist', true],
    ['配套工程跟踪', 'ptgc', 'ptgclist', true],
    ['装表接电', 'zbjd', 'zbjdlist', true],
    ['空间拓扑绘图', 'kjtb', 'kjtblist', true],
    ['信息归档', 'xxgd', 'xxgdlist2', true],
    ['档案归档', 'dagd', 'dagdlist', true],
    ['申请派车（错误复用归档）', 'xxgd', 'xxgdlist', false],
    ['物资申领（无独立数量）', null, 'smfulist2', false]
  ];
  function number(value) { return typeof value === 'number' && Number.isFinite(value) ? value : null; }
  const nodes = definitions.map(function (d) {
    const list = vm[d[2]];
    return { name: d[0], countField: d[1], listField: d[2],
      count: d[1] ? number(vm[d[1]]) : null,
      listLength: Array.isArray(list) ? list.length : null,
      existingQueryInSource: d[3],
      firstRecordFieldNames: Array.isArray(list) && list[0] && typeof list[0] === 'object'
        ? Object.keys(list[0]).filter(function (key) { return !/token|cookie|authorization|password|secret/i.test(key); }) : [],
      note: '快照不证明请求成功或数量完整；0可能是初始化值' };
  });
  const report = {
    version: 'snapshot-1', time: new Date().toISOString(), scenePath: location.pathname,
    nodes: nodes,
    existingQueryDisplayedSubtotal: nodes.filter(function (n) { return n.existingQueryInSource; })
      .reduce(function (sum, n) { return sum + (n.count || 0); }, 0),
    subtotalNote: '只加九个已有查询字段，不加派车重复绑定；只是当前页面数值合计，不是已验证全量待办',
    archiveListsShareReference: vm.xxgdlist === vm.xxgdlist2,
    overdueReminderDisplayed: number(vm.overdueTotal),
    popup: { visible: vm.popupVisible === true, listLength: Array.isArray(vm.popupList) ? vm.popupList.length : null,
      pageSize: number(vm.pageSize), currentPage: number(vm.currentPopupPage) }
  };
  const panel = document.createElement('div');
  panel.style.cssText = 'position:fixed;right:16px;top:16px;width:460px;max-width:90vw;max-height:85vh;overflow:auto;z-index:2147483647;background:white;color:#222;border:2px solid #008577;padding:16px;font:14px/1.5 sans-serif';
  const heading = document.createElement('strong'); heading.textContent = '低压页面数据快照（不发请求）';
  const pre = document.createElement('pre'); pre.style.cssText = 'white-space:pre-wrap;word-break:break-all'; pre.textContent = JSON.stringify(report, null, 2);
  const button = document.createElement('button'); button.textContent = '下载页面快照';
  button.onclick = function () {
    const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = '低压页面快照-' + Date.now() + '.json'; a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  };
  const close = document.createElement('button'); close.textContent = '关闭'; close.onclick = function () { panel.remove(); };
  panel.append(heading, button, close, pre); document.body.appendChild(panel);
  console.table(nodes.map(function (n) { return { 节点: n.name, 页面数量: n.count, 已加载列表长度: n.listLength }; }));
})();
