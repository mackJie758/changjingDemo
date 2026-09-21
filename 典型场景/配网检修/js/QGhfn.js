(function () {
    // 将库的方法封装在一个对象中
    var QGhfn = {
        txBrowserAjax: function (callBack,targeturl,actionurl,requestType,requestHeder,requestParam) {
            var res = sgBrowerserJsAjax(callBack, targeturl, actionurl, requestType, requestHeder, JSON.stringify(requestParam));
            console.log(res)
        },
        // js 回调函数，可通过此函数，返回执行 js 的结果(主要用于目标 URL 执行完成后返回结果)
        callBackJsToCpp: function(param) {
            callBackJsToCpp(param)
        },
        // 执行 sql 语句
        sgBrowserJsSql: function(callback, sqlStr) {
            sgBrowserJsSql(callback, sqlStr)
    },
        // 执行 JS 代码
        sgBrowserExcuteJsCode: function(targeturl,jsCode) {
            sgBrowserExcuteJsCode(targeturl,jsCode)
    },
        // 注入 JS 方法
        sgBrowserRegJsFun: function(targeturl,funContent) {
            sgBrowserRegJsFun(targeturl,funContent)
    },
        // 执行 JS 方法
        sgBrowserExcuteJsFun: function(targeturl,funName) {
            sgBrowserExcuteJsFun(targeturl,funName)
    },
        // 登录初始化
        sgBrowerserLogin: function(obj) {
            sgBrowerserLogin(obj)
        },
        // 退出登录
        sgBrowerserLogou: function() {
            sgBrowerserLogou()
        },
        // 设置缓存数据
        sgBrowerserSetStorage: function(key,val) {
            sgBrowerserSetStorage(key,val)
        },
        // 获取缓存数据
        sgBrowerserGetStorage: function(key,callback) {
            sgBrowerserGetStorage(key,callback)
        },
        // 在新页签打开 URL，等第一个 url 加载完成后，加载第二个 url
        sgBrowerserOpen: function (url1,url2) {
            sgBrowerserOpen(url1,url2);
        },
        // 获取所有已经打开的 url地址
        sgBrowerserGetUrls: function (callback) {
            sgBrowerserGetUrls(callback);
        },
        // 打开本地应用
        sgBrowerserOpenEXE: function (filePath) {
            sgBrowerserOpenEXE(filePath);
        },
        // 激活页签
        sgBrowerserActiveTab: function (url,callBack) {
            sgBrowerserActiveTab(url,callBack);
        },
        // 设置浏览器背景色
        sgBrowerserSetBackColor: function (color) {
            sgBrowerserSetBackColor(color);
        },
        //  打开消息框
        sgBrowerserOpenMessage: function (url,w,h) {
            sgBrowerserOpenMessage(url,w,h);
        },
        // 消息框隐藏
        sgBrowerserMessageHide: function () {
            sgBrowerserMessageHide();
        },
        // 消息框显示
        sgBrowerserMessageShow: function () {
            sgBrowerserMessageShow();
        },
        // 设置消息标题
        sgBrowerserMessageSetTitle: function (title) {
            sgBrowerserMessageSetTitle(title);
        },
        // 打开新页面
        sgBrowerserOpenPage: function (url) {
            sgBrowerserOpenPage(url);
        },
        // 打开用户信息页面
        sgBrowerserOpenUser: function (url, width, height) {
            sgBrowerserOpenUser(url, width, height);
        },
        // 隐藏用户信息页面
        sgBrowerserHideUser: function () {
            sgBrowerserHideUser();
        },
        // 显示用户信息页面
        sgBrowerserShowUser: function () {
            sgBrowerserShowUser();
        },
        // 设置登录后用户显示图标和名称
        sgBrowerserSetUser: function (userImg, username) {
            sgBrowerserSetUser(userImg, username);
        },

        // 设置登录后浏览器 Logo 图标
        sgBrowerserSetLogoImg: function (img) {
            sgBrowerserSetLogoImg(img);
        },
        // 关闭显示的页面
        sgBrowserClosePage: function (url) {
            sgBrowserClosePage(url);
        },
        // 浏览器最大化
        sgBrowserMaxShow: function () {
            sgBrowserMaxShow();
        },
        // 在隐藏域打开网页
        sgHideBrowerserOpenPage: function () {
            sgHideBrowerserOpenPage();
        },
        // 获取隐藏域所有已经打开的 url
        sgHideBrowerserGetUrls: function (callBackFun) {
            sgHideBrowerserGetUrls(callBackFun);
        },
        // 关闭隐藏域网址
        sgHideBrowerserClosePage: function (url) {
            sgHideBrowerserClosePage(url);
        },
        // 改变消息框大小
        sgBrowerserMessageResize: function (width, height) {
            sgBrowerserMessageResize(width, height);
        },
        // 设置浏览器模式 1 菜单模式 2 原模式
        sgBroewserSetModel: function (num) {
            sgBroewserSetModel(num);
        },
        // 设置顶部标题颜色
        sgBroewserSetToptcolor: function (color) {
            sgBroewserSetToptcolor(color);
        },
        // 设置左侧菜单栏颜色
        sgBroewserSetLefcolor: function (color) {
            sgBroewserSetLefcolor(color);
        },
        // 修改已设置菜单属性
        /*
        * 示例
        * var res = sgBrowerserEditMenu(JSON.stringify( {
                name: "菜单名字",
                normalImg: "图标",
                acttveImg: "活动图标",
                url: "链接地址"
            })) */
        sgBrowerserEditMenu: function (params) {
            sgBrowerserEditMenu(params)
        },

        // 新增菜单
        /*
        * 示例
        * var res = sgBrowerserAddMenu(JSON.stringify( {
                name: "菜单名字",
                normalImg: "图标",
                acttveImg: "活动图标",
                url: "链接地址"
            })) */
        sgBrowerserAddMenu: function (params) {
            sgBrowerserAddMenu(params)
        },
        // 删除菜单
        sgBrowerserDelMenu: function (name) {
            sgBrowerserDelMenu(name)
        },
        // Helper function to execute AJAX
        _executeAjax: function (param, ajaxFunction) {
            let { callbackfun, urlpage, ajaxurl, requestType, requestHeader, requestParam } = param;
            window[ajaxFunction](callbackfun, urlpage, ajaxurl, requestType, requestHeader, requestParam);
        }
    };

// 将库暴露为全局变量，以便在 HTML 页面中访问
    window.QGhfn = QGhfn;
})();

// 使用示例

/*
// 调用dPageAjax
QGhfn.dPageAjax({
    urlpage: 'http://example.com',
    ajaxurl: 'http://api.example.com/data',
    requestType: 'GET',
    requestHeader: 'application/json',
    requestParam: '{}',
    callbackFun: 'myCallbackFunction'
});

// 调用dPageExeJs
QGhfn.dPageExeJs('http://example.com', "alert('Hello World!')");

// 调用dPageOpenDialog
QGhfn.dPageOpenDialog({
    x: 100,
    y: 100,
    width: 400,
    height: 300,
    url: 'http://example.com/dialog',
    callbackfun: 'dialogCallback'
});

// 设置全局存储
QGhfn.dPageSetStorage('myKey', 'myValue');

// 获取全局存储
QGhfn.dPageGetStorage('myKey', function(key, val) {
    console.log(key, val);
});
*/

