


function openUrlByHideArea(){
    console.log("隐藏域打开供电服务指挥系统")
    //供电服务指挥系统
    BrowserAction('sgHideBrowerserClosePage','http://25.73.0.159:18086/sgpms/#/workbenchs')
    BrowserAction('sgHideBrowerserOpenPage', 'http://25.73.0.159:18086/sgpms')

    //SG-I6000
    BrowserAction('sgHideBrowerserClosePage','http://25.73.0.36/i6000-portal')
    BrowserAction('sgHideBrowerserOpenPage', 'http://25.73.0.36/i6000-portal')

    
}

openUrlByHideArea();