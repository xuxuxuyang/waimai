//查询数据库的用户
// 注册模型
const Username = require('../models/username.js')
const result = require('./resultdata.js')
const initdata = require('./init.js')
// 密码比对
const {contrast,gentoken} = require('./user.js')
class Queryuser{
	constructor(name,pass = 0,ctx = 0) {
	  this.name = name
	  this.pass = pass
	  this.ctx = ctx
	}
	// 注册
	async queryUser(){
		let name = this.name
		let listdata = await Username.find({name})
		if(listdata.length === 0){
			console.log('没有注册过')
		}else{
			throw new result('你已经注册过,请选择登录',202)
		}
	}
	// 登录
	async queryLogin(){
		let name = this.name
		let pass = this.pass
		let listdata = await Username.find({name})
		if(listdata.length === 0){
			throw new result('手机号码错误',202)
		}
		if(listdata.length != 0){
			if(contrast(this.pass,listdata[0].password)){
				new initdata(this.ctx,'SUCCESS',gentoken(listdata[0].openid)).listing()
			}else{
				new initdata(this.ctx).tips('密码不对',202)
			}
		}
	}
}

module.exports = {Queryuser}