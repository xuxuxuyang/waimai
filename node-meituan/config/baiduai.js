// 百度ai的评论观点抽取
var AipNlpClient = require("baidu-aip-sdk").nlp;

// 设置APPID/AK/SK
var APP_ID = "22954673";
var API_KEY = "kwsmyuqoO75YG3CM4QwarH4E";
var SECRET_KEY = "dQmwDGpejIF19Tnlnwc4l4hPSaB3P8in";

const options = {};
options["type"] = "4";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipNlpClient(APP_ID, API_KEY, SECRET_KEY)

module.exports = {options,client}