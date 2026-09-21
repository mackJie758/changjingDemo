//==============================================公共接口行=========================================================

//加密
document.write(
  `<script    src="http://10.161.33.114:18080/a_js/emss/emss-lib.umd.js"></script>`
);
document.write(
  `<script type="text/javascript"  src="http://10.161.33.114:18080/a_js/emss/emssUtil.js"></script>`
);
//

//公共js样式组件
document.write(
  `<script type="text/javascript"  src="http://10.161.33.114:18080/a_js/axios.js"></script>`
);
document.write(
  `<script type="text/javascript"  src="http://10.161.33.114:18080/a_js/moment.js"></script>`
);
document.write(
  `<script type="text/javascript"  src="http://10.161.33.114:18080/a_js/vue.js"></script>`
);
document.write(
  `<script type="text/javascript"  src="http://10.161.33.114:18080/a_js/elementui.js"></script>`
);
document.write(
  `<script type="text/javascript"  src="http://10.161.33.114:18080/a_js/QGhfn.js"></script>`
);
document.write(
  `<script type="text/javascript"  src="http://10.161.33.114:18080/a_js/dpage.min.js"></script>`
);
document.write(
  `<script type="text/javascript"  src="http://10.161.33.114:18080/a_js/jquery.js"></script>`
);
document.write(
  `<link rel="stylesheet" href="http://10.161.33.114:18080/a_js/elementui.css">`
);
document.write(
  `<link rel="stylesheet" href="http://10.161.33.114:18080/a_js/style.css" rel="stylesheet">`
);
document.write(
  `<script type="text/javascript"  src="http://10.161.33.114:18080/a_js/wangeditor_editor.js"></script>`
);
document.write(
  `<script type="text/javascript"  src="http://10.161.33.114:18080/a_js/echarts.js"></script>`
);
document.write(
  `<script type="text/javascript"  src="http://10.161.33.114:18080/a_js/echarts-liquidfill.min.js"></script>`
);
document.write(
  `<script type="text/javascript"  src="http://10.161.33.114:18080/a_js/pinyin.min.js"></script>`
);
document.write(
  `<script type="text/javascript"  src="http://10.161.33.114:18080/a_js/xlsx.full.min.js"></script>`
);

document.write(
  `<script type="text/javascript"  src="http://10.161.33.114:18080/a_js/marked.min.js"></script>`
);

document.write(
  `<script type="text/javascript"  src="http://10.161.33.114:18080/a_js/x6.js"></script>`
);
//

//====================================================================================================
document.write(
  `<script type="text/javascript"  src="http://10.161.33.114:18080/a_js/crypto-js.js"></script>`
);
document.write(
  `<script    src="http://10.161.33.114:18080/a_js/sm4.js"></script>`
);
document.write(
  `<script type="text/javascript"  src="http://10.161.33.114:18080/a_js/bcrypt.min.js"></script>`
);

//====================================使用接口封装================================================================
// 需要登录才能打电话

function vAutocalloutTelePagenew(params) {
  // 调用呼叫前先获取token
  const form = {
    account: "",
    passWord: "",

    codeId: 0,
    code: "",
  };
  //	    21.76.121.140:8080
  axios
    .post(
      location.protocol +
        "//" +
        location.hostname +
        ":8080" +
        "/callPhone/sysAuth/login_plaintext",
      JSON.stringify(form),
      {
        headers: {
          "Content-Type": "application/json",
          authenticationInformation: JSON.parse(
            sessionStorage.getItem("userinfo")
          ).authenticationInformation,
        },
      }
    )
    .then((res) => {
      if (res.status == 200) {
        if (res.data.code == 200)
          accessToken = "Bearer " + res.data.result.accessToken;
        callOut(params);
      } else {
        console.log("外呼失败！");
      }
    });
}

// 打电话
function callOut(params) {
  console.log(params.phone);
  params.phone.forEach((x, index, array) => {
    array[index] = x.trim().replace(/\s+/g, "");
  });
  params.phone = Array.from(new Set(params.phone));
  params.phone.forEach((item) => {
    const data = {
      //	            taskName: params.taskName, //任务名称 选填
      //	            // startDate: mac.moment().format("YYYY-MM-DD"), //开始呼叫日期 格式必须为: yyyy-MM-dd  必填
      //	            // endDate: mac.moment().format("YYYY-MM-DD"), // 结束呼叫日期 格式必须为: yyyy-MM-dd   必填
      //	            startDate: params.startDate, //开始呼叫日期 格式必须为: yyyy-MM-dd  必填
      //	            endDate: params.endDate, // 结束呼叫日期 格式必须为: yyyy-MM-dd   必填
      //	            startTime1: params.startTime1, //每天首次开始呼叫时间  格式必须为: HH:mm  必填
      //	            endTime1: params.endTime1, //每天首次停止呼叫时间  格式必须为: HH:mm  必填
      //	            startTime2: "", //每天二次开始呼叫时间  内容有值的时候,格式必须为: HH:mm 选填
      //	            endTime2: "", //每天二次停止呼叫时间  内容有值的时候,格式必须为: HH:mm   选填
      //	            startTime3: "", //每天三次开始呼叫时间   内容有值的时候, 格式必须为: HH:mm   选填
      //	            endTime3: "", //每天三次停止呼叫时间  内容有值的时候,格式必须为: HH:mm 选填
      //	            startFlag: 1, //启动呼叫标识：1 表示启动呼叫，0 表示没有启动  必填
      //	            teleCount: 10000, //该任务总共号码个数     必填
      //	            maxChnNum: 6, //该任务总共号码个数           必填
      //	            callerNo: "", // 呼出时送的主叫号码          选填
      //	            maxCallCount: 3, //每个号码最大呼叫次数    必填
      //	            maxAnsCount: 2, //每个号码最大应答次数      必填
      //	            noAnsDelay: 300, //无人应答后再次呼叫间隔时间(秒)     必填
      //	            busyDelay: 180, // 呼叫失败或遇忙后再次呼叫间隔时间(秒)        必填
      //	            playTTsText: "", //呼通后播放语音文字内容，由 TTS 服务转换为语音          选填
      //	            playFilename: "", //呼通后播放的语音文件名称          选填
      //	            toIvrNo: "", //呼通后, 转接的 ivr 号码          选填
      //	            toGroupNo: "", //呼叫指定的坐席组内坐席, 如果为空, 则只要坐席是空闲就呼叫      选填
      //	            params: "", //附加参数      选填
      //	            remark: "", // 备注信息      选填
      //	            exportType: 0, //是否将任务的号码导出  0-直接存放在号码表中(查询任务的统计结果的时候直接从号码表中统计)    1-将任务的号码表导出到号码历史表中(查询任务统计结果的时候从号码历史表中统计)   必填
      //	            callType: 0, //  外呼类型: 0：呼出后播放语音 1：呼出成功后转坐席2：先呼坐席然后呼出3：呼出成功后转 IVR 4：呼出成功后转机器人   必填
      //	            createTime: "", //任务创建时间 可不填
      //	            flowId: 1, //流程 Id需要从页面上下拉填充       选填
      //	            autocalloutTeleList: [
      //	                //为子号码 json 数组 不能为空 最大支持 50 个
      //	                {
      //	                    callerNo: "", //服务号码, 主叫号码。 为空的时候取任务表的主叫号码。    选填
      //	                    calledNo: "0" + item, //客户的号码, 被叫号码。       必填  号码前面必须加0
      //	                    custName: params.custName, //客户名称      必填
      //	                    custNo: "", //客户编号(保留)      选填
      //	                    custType: 1, //客户类型      必填
      //	                    // createTime: mac.moment().format("YYYY-MM-DD HH:mm:ss"), //创建时间       选填
      //	                    createTime: '2024-10-13 09:35:00', //创建时间       选填
      //	                    autoDelete: 0, //自动删除标志,呼叫成功后及呼叫次数完成后是否删除该记录0-不删除(保存在当前表)1-转存到号码历史表并删除当前表记录  必填
      //	                    priorityId: 1, //外呼优先级别，数值越大级别越高    必填
      //	                    dialoutState: 1, //人工记录的状态(保留)      选填
      //	                    params: "", //附加参数    选填
      //	                    lock_serverip: "", //备注信息    选填
      //	                    remark: "", //备注信息 选填
      //	                    ttsContent: params.ttsContent, //要播报的 tts 信息内容   必填
      //	                    deleteTtsFile: 0, //呼叫完成后是否删除 tts 文件      必填
      //	                    confirmDtmf: "1", //确认按键如：123        选填
      //	                    confirmResult: 0, //确认结果 0 未确认 1 确认        选填
      //	                    recvDtmf: "", //接收的 DTMF 按键       选填
      //	                },
      //	            ],
      taskName: params.taskName, //任务名称 选填
      startDate: moment().format("YYYY-MM-DD"), //开始呼叫日期 格式必须为: yyyy-MM-dd  必填
      endDate: moment().format("YYYY-MM-DD"), // 结束呼叫日期 格式必须为: yyyy-MM-dd   必填
      startTime1: "00:00", //每天首次开始呼叫时间  格式必须为: HH:mm  必填
      endTime1: "23:59", //每天首次停止呼叫时间  格式必须为: HH:mm  必填
      startTime2: "", //每天二次开始呼叫时间  内容有值的时候,格式必须为: HH:mm 选填
      endTime2: "", //每天二次停止呼叫时间  内容有值的时候,格式必须为: HH:mm   选填
      startTime3: "", //每天三次开始呼叫时间   内容有值的时候, 格式必须为: HH:mm   选填
      endTime3: "", //每天三次停止呼叫时间  内容有值的时候,格式必须为: HH:mm 选填
      startFlag: 1, //启动呼叫标识：1 表示启动呼叫，0 表示没有启动  必填
      teleCount: 10000, //该任务总共号码个数     必填
      maxChnNum: 6, //该任务总共号码个数           必填
      callerNo: "", // 呼出时送的主叫号码          选填
      maxCallCount: 3, //每个号码最大呼叫次数    必填
      maxAnsCount: 2, //每个号码最大应答次数      必填
      noAnsDelay: 300, //无人应答后再次呼叫间隔时间(秒)     必填
      busyDelay: 180, // 呼叫失败或遇忙后再次呼叫间隔时间(秒)        必填
      playTTsText: "", //呼通后播放语音文字内容，由 TTS 服务转换为语音          选填
      playFilename: "", //呼通后播放的语音文件名称          选填
      toIvrNo: "", //呼通后, 转接的 ivr 号码          选填
      toGroupNo: "", //呼叫指定的坐席组内坐席, 如果为空, 则只要坐席是空闲就呼叫      选填
      params: "", //附加参数      选填
      remark: "", // 备注信息      选填
      exportType: 0, //是否将任务的号码导出  0-直接存放在号码表中(查询任务的统计结果的时候直接从号码表中统计)    1-将任务的号码表导出到号码历史表中(查询任务统计结果的时候从号码历史表中统计)   必填
      callType: 0, //  外呼类型: 0：呼出后播放语音 1：呼出成功后转坐席2：先呼坐席然后呼出3：呼出成功后转 IVR 4：呼出成功后转机器人   必填
      createTime: "", //任务创建时间 可不填
      flowId: 1, //流程 Id需要从页面上下拉填充       选填
      autocalloutTeleList: [
        //为子号码 json 数组 不能为空 最大支持 50 个
        {
          callerNo: "", //服务号码, 主叫号码。 为空的时候取任务表的主叫号码。    选填
          calledNo: "0" + item, //客户的号码, 被叫号码。       必填  号码前面必须加0
          custName: params.name, //客户名称      必填
          custNo: "", //客户编号(保留)      选填
          custType: 1, //客户类型      必填
          createTime: moment().format("YYYY-MM-DD HH:mm:ss"), //创建时间       选填
          autoDelete: 0, //自动删除标志,呼叫成功后及呼叫次数完成后是否删除该记录0-不删除(保存在当前表)1-转存到号码历史表并删除当前表记录  必填
          priorityId: 1, //外呼优先级别，数值越大级别越高    必填
          dialoutState: 1, //人工记录的状态(保留)      选填
          params: "", //附加参数    选填
          lock_serverip: "", //备注信息    选填
          remark: "", //备注信息 选填
          ttsContent: params.content, //要播报的 tts 信息内容   选填
          deleteTtsFile: 0, //呼叫完成后是否删除 tts 文件      必填
          confirmDtmf: "1", //确认按键如：123        选填
          confirmResult: 0, //确认结果 0 未确认 1 确认        选填
          recvDtmf: "", //接收的 DTMF 按键       选填
        },
      ],
    };
    //	        /callPhone/vAutocalloutTask/includeTaskExtTele
    axios
      .post(
        location.protocol +
          "//" +
          location.hostname +
          ":8080" +
          "/callPhone/autocalloutTask/includeTaskExtTele",
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
            authenticationInformation: JSON.parse(
              sessionStorage.getItem("userinfo")
            ).authenticationInformation,
          },
        }
      )
      .then((res) => {
        if (res.data.code == 200) {
          console.log("外呼成功！");
        } else {
          console.log("外呼失败！");
        }
      });
  });
}

// 短息发送
function smsBatchSendSmsByPhoneList(params) {
  params.phoneList.forEach((x, index, array) => {
    array[index] = x.trim().replace(/\s+/g, "");
  });
  params.phoneList = Array.from(new Set(params.phoneList));
  return axios
    .post(
      location.protocol +
        "//" +
        location.hostname +
        ":8080" +
        "/sendSms/sms/batchSendSmsByPhoneList",
      JSON.stringify(params),
      {
        headers: {
          "Content-Type": "application/json",
          authenticationInformation: JSON.parse(
            sessionStorage.getItem("userinfo")
          ).authenticationInformation,
        },
      }
    )
    .then((res) => {
      if (res.status == "200") {
        return res;
        console.log("短信发送成功！");
      }
    });
}

// 监测项写入
function monitorDatawrite(params) {
  return axios
    .post(
      "http://localhost:13313/MonitorServices/setMonitorData",
      JSON.stringify(params),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      console.log("监测项写入成功！");
      // return res.data
    });
}
// 监测项日志写入
function logWrite(params) {
  return axios
    .post(
      "http://localhost:13313/MonitorServices/setMonitorLog",
      JSON.stringify(params),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      // return res.data
      console.log("监测项日志写入成功！");
    });
}
//语音提醒
function audioPlaycommon(audioText) {
  return axios
    .post(
      location.protocol +
        "//" +
        location.hostname +
        ":8080" +
        "/audioText/generate-audio-from-text",
      JSON.stringify({ audioText }),
      {
        headers: {
          "Content-Type": "application/json",
          authenticationInformation: JSON.parse(
            sessionStorage.getItem("userinfo")
          ).authenticationInformation,
        },
        responseType: "blob",
      }
    )
    .then((response) => {
      console.log(response, "ok！");
      if (response.status == 200) {
        var audioUrl = URL.createObjectURL(response.data); // 将文件流转为音频地址
        console.log(audioUrl);
        return {
          status: 200,
          audioUrl: audioUrl,
        };
      }
    });
}
//语音提醒182

function audioPlaycommonnew(audioText) {
  return axios
    .post(
      location.protocol +
        "//" +
        location.hostname +
        ":8080" +
        "/audioText/generate-audio-from-text",
      JSON.stringify({ audioText }),
      {
        headers: {
          "Content-Type": "application/json",
          authenticationInformation: JSON.parse(
            sessionStorage.getItem("userinfo")
          ).authenticationInformation,
        },
        responseType: "blob",
      }
    )
    .then((response) => {
      console.log(response, "ok！");
      if (response.status == 200) {
        var audioUrl = URL.createObjectURL(response.data); // 将文件流转为音频地址
        console.log(audioUrl);
        return {
          status: 200,
          audioUrl: audioUrl,
        };
      }
    });
}

//excelExport

function excelExport(params) {
  return axios
    .post(
      "http://localhost:13313/DocServices/excelaAnalysis/faultDetailsExportXLSX",
      JSON.stringify(params),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      return response.data.data;
    });
}

//excelExport自定义

function excelExportZ(params) {
  return axios
    .post(
      "http://localhost:13313/exportFile/faultDetailsExportXLSX",
      JSON.stringify(params),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      return response.data.data;
    });
}

//docExport
function docExport(params) {
  return axios
    .post(
      "http://localhost:13313/docFiles/exportDocs",
      JSON.stringify(params),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      console.log(response);

      return response.data.data.url;
    });
}
//导出doc  图片
function docImageExport(params) {
  return axios
    .post(
      "http://localhost:13313/imgDocs/exportImageDocs",
      JSON.stringify(params),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      console.log(response.data.data.url);

      return response.data.data.url;
    });
}

// 登录接口
function systemLogin(isPage, locationUrl, list, sysIdFlag, num) {
  sgBrowserExcuteJsCode(
    location.host + "/#/monitorQueue",
    `window.mac.getLogint(${isPage},${locationUrl},${list},${sysIdFlag},${num})`
  );

  window.mac.loginStatusFlushed = function loginStatusFlushed(obj) {
    return obj;
  };
}

//======================================数据库操作问题处理========================================================

// 新增表
function addTable(params) {
  return axios
    .post(
      "http://localhost:13313/configServices/addTable",
      JSON.stringify(params),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      // return res.data
      console.log("新增表成功！");
    });
}

// 执行SQL
function exeSQL(params) {
  return axios
    .post(
      "http://localhost:13313/configServices/exeSql",
      JSON.stringify(params),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      // return res.data
      console.log("执行SQL成功！");
    });
}

//   查询数据
function queryList(params) {
  return axios
    .post(
      "http://localhost:13313/configServices/selectData",
      JSON.stringify(params),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      // return res.data
      console.log("查询数据成功！");
    });
}

// 分页查询数据
function queryPage(params) {
  return axios
    .post(
      "http://localhost:13313/configServices/selectDataPage",
      JSON.stringify(params),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      // return res.data
      console.log("分页查询数据成功！");
    });
}

// 新增数据
function addData(params) {
  return axios
    .post(
      "http://localhost:13313/configServices/addData",
      JSON.stringify(params),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      // return res.data
      console.log(" 新增数据成功！");
    });
}

// 删除数据
function deleteid(params) {
  return axios
    .post(
      "http://localhost:13313/configServices/delete",
      JSON.stringify(params),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      // return res.data
      console.log("删除数据成功！");
    });
}

// 修改数据
function update(params) {
  return axios
    .post(
      "http://localhost:13313/configServices/update",
      JSON.stringify(params),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      // return res.data
      console.log("修改数据成功！");
    });
}

//=========================================数据成功================================================================

//加密
function encrypt(word, keyStr) {
  keyStr = keyStr ? keyStr : "XXXXXXXXXXXXX"; //判断是否存在ksy，不存在就用定义好的key
  var key = CryptoJS.enc.Utf8.parse(keyStr);
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}
//解密
function listdecrypt(word, keyStr) {
  keyStr = keyStr ? keyStr : "XXXXXXXXXXXXX";
  var key = CryptoJS.enc.Utf8.parse(keyStr);
  var decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

//风控加密
function FK_SM4_decrypt(userId, a) {
  let obj = {
    key: userId + "11HDESaAhiHHugDz",
    cipherType: "base64",
    mode: "ecb",
  };
  let sm = new SM4(obj);
  if (sm.decrypt(a)) {
    return JSON.parse(sm.decrypt(a));
  } else {
    return "";
  }
}
