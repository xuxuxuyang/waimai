const {
    WXPay,
    WXPayUtil,
    WXPayConstants
 } = require('wx-js-utils');
 
 const appId = 'wxe20627eea1fd0743'
 const mchId = '1604030885'
 const key = 'xuyang1203xuyang1203xuyang1203xu'
 const timeout = 10000; // 毫秒
 const sign_type = WXPayConstants.SIGN_TYPE_MD5
 
 const wxpay = new WXPay({
     appId,
     mchId,
     key,
     timeout,
     signType: sign_type,  // 使用 HMAC-SHA256 签名，也可以选择  WXPayConstants.SIGN_TYPE_MD5，小程序默认是 WXPayConstants.SIGN_TYPE_MD
     useSandbox: false   // 不使用沙箱环境
 });
 
 // 实时通讯
 const options = {
     hostname: 'rest-hangzhou.goeasy.io',
     path: '/publish',
     method: 'POST',
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded'
     }
   };
   
   const appkey = 'BC-a78ac17cbfe64a8e9b9cbcb76417bf57';
 
 
 module.exports = {wxpay,key,appId,sign_type,WXPayUtil,options,appkey}