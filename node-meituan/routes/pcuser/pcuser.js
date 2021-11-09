const router = require('koa-router')()// 路由:()直接实例化
const {chregister,codeing,chlogin} = require('../../config/checking.js')// 校验
let {obJect} = require('../../config/object.js')// 转换body
const {Smcode} = require('../../config/smcode.js')// 短信
const initdata = require('../../config/init.js')// 响应接收
const {pWd,contrast,gentoken} = require('../../config/user')// 密码加密
const {Auth} = require('../../config/auth.js')// token
const Username = require('../../models/username')// 注册模型
const {Queryuser} = require('../../config/queryuser.js')// 查询数据库是否有了商家数据

router.post('/register', async ctx=>{   
	let {name,password,code} = obJect(ctx.request.body)
	new chregister(ctx,name,password,code).chregisterFun()// 1.参数校验
	await new Queryuser(name).queryUser()// 2.查询数据库之前是否注册过
	await new Smcode(ctx,name,code).queryCode()// 3.验证验证码是否正确
	let uid = new Date().getTime() // 4.用当前的时间戳作为用户唯一标识uid
	// 5.token生成
	// log(gentoken(uid))
	// new initdata(ctx,'SUCCESS',gentoken('12345',2),200).listing()
	// new initdata(ctx,'注册成功',ctx.auth.scope,200).listing()
	// 6.存入数据库
	const user = new Username({
		name,
		password:pWd(password),
		openid:uid
	})
	await user
	.save()
	.then((res)=>{
		new initdata(ctx,'SUCCESS',gentoken(uid)).listing()
	})
	.catch((e)=>{
		new initdata(ctx).tips('注册失败',500)
	})
})
// 登录的路由
router.post('/login', async ctx=>{
	let {name,password} = obJect(ctx.request.body)
	new chlogin(ctx,name,password).chloginFun()// 参数校验
	await new Queryuser(name,password,ctx).queryLogin()	// 登录查询
})
// 发送验证码
router.post('/smcode',async ctx=>{
	let {name} = obJect(ctx.request.body)
	new codeing(ctx,name).codeIng()// 参数校验
	await new Smcode(ctx,name).codeFun()// 发送验证码
})

module.exports = router.routes()