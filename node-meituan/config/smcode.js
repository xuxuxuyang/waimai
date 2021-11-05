const Core = require('@alicloud/pop-core');
// 时间
const datetime = require('silly-datetime');
// 响应接收
const initdata = require('./init.js')
const result = require('./resultdata.js')

var client = new Core({
  accessKeyId: '阿里云',
  accessKeySecret: '阿里云',
  endpoint: 'https://dysmsapi.aliyuncs.com',
  apiVersion: '2017-05-25'
});

// 随机生成6位数为短信验证码
let codes = 6 + Math.random().toString().slice(-5)
// 发送验证码
let parfun = function(iphone){
	let params = {
	  "RegionId": "cn-hangzhou",
	  "PhoneNumbers": iphone,
	  "SignName": "爱尚外卖",
	  "TemplateCode": "SMS_196617024",
	  "TemplateParam": `{"code":${codes}}`
	}
	return params
}

// 查询验证码是否正确
let quefun = function(iphone){
	var params = {
	  "RegionId": "cn-hangzhou",
	  "PhoneNumber": iphone,
	  "SendDate": datetime.format(new Date(), 'YYYYMMDD'),
	  "PageSize": "1",
	  "CurrentPage": "1"
	}
	return params
}


var requestOption = {
  method: 'POST'
};


class Smcode{
	constructor(ctx,iphone,codedata) {
		this.ctx = ctx
	    this.iphone = iphone
		this.codedata = codedata
	}
	
	// 发送验证码
	async codeFun(){
		try{
			let codedata = await client.request('SendSms', parfun(this.iphone), requestOption)
			if(codedata.Message == 'OK' && codedata.Code == 'OK'){
				new initdata(this.ctx).listing()
			}else{
				new initdata(this.ctx).tips('验证码发送失败',202)
			}
		}catch(err){
			console.log('出错')
			console.log(err)
			if(err.code == 'isv.BUSINESS_LIMIT_CONTROL'){
				console.log('发送频繁')
				new initdata(this.ctx).tips('验证码发送太频繁',202)
			}else{
				console.log('验证码不正确')
				new initdata(this.ctx).tips('验证码发送失败',202)
			}
		}
	}
	
	// 查询验证码是否正确
	async queryCode(){
		try{
			let query = await client.request('QuerySendDetails', quefun(this.iphone), requestOption)
			console.log(query)
			let{TotalCount,Message,Code,SmsSendDetailDTOs} = query
			if(Message == 'OK' && Code == 'OK'){
				if(TotalCount == 0){
					throw('验证码不正确')
				}
				let smsuu = SmsSendDetailDTOs.SmsSendDetailDTO[0].SendStatus
				if(smsuu == 2){
					throw('验证码发送失败,请重试')
				}
				let sucodes = SmsSendDetailDTOs.SmsSendDetailDTO[0].Content
				let sunum = sucodes.replace(/[^0-9]/ig,"")
				console.log(SmsSendDetailDTOs.SmsSendDetailDTO[0].Content)
				if(sunum != this.codedata){
					throw('验证码填写错误')
				}
			}
			
		}catch(e){
			throw new result(e,202)
		}
	}
}

module.exports = {Smcode}