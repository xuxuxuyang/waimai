// 获取解密token
var basicAuth = require('basic-auth')
// token
const jwt = require('jsonwebtoken');
// token过期时间
const security = require('./tokentime.js').security
// 响应接收
const initdata = require('./init.js')
const result = require('./resultdata.js')

class Auth{
	constructor() {
	    
	}
	
	get m(){
		return async(ctx,next)=>{
			const token = basicAuth(ctx.req)
			console.log(token)
			if(!token || !token.name){
				throw new result('没有访问权限',401)
			}
			try{
				var authcode = jwt.verify(token.name,security.secretkey)
			}catch(error){
				console.log(error)
				if(error.name == 'TokenExpiredError'){
					throw new result('token过期',401)
				}
				throw new result('没有访问权限',401)
			}
			
			ctx.auth = {
				uid:authcode.uid,
				scope:authcode.scope
			}
			await next()
		}
	}
}

module.exports = {Auth}