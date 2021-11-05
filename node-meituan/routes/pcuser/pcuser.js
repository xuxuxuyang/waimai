// 路由:()直接实例化
const router = require('koa-router')()
const {log} = console

// 校验
const {chregister,codeing,chlogin} = require('../../config/checking.js')
// 转换body
let {obJect} = require('../../config/object.js')
// 短信
const {Smcode} = require('../../config/smcode.js')
// 响应接收
const initdata = require('../../config/init.js')
// 密码加密
const {pWd,contrast,gentoken} = require('../../config/user')
// token
const {Auth} = require('../../config/auth.js')
// 注册模型
const Username = require('../../models/username')
// 查询数据库是否有了商家数据
const {Queryuser} = require('../../config/queryuser.js')

// 注册的路由new Auth().m, 
router.post('/register', async ctx=>{   
	log('这是注册')
	let {name,password,code} = obJect(ctx.request.body)
	// 1.参数校验
	new chregister(ctx,name,password,code).chregisterFun()
	// 2.查询数据库之前是否注册过
	await new Queryuser(name).queryUser()
	log('123')
	// return false
	// 3.验证验证码是否正确
	await new Smcode(ctx,name,code).queryCode()
	log('通过')
	// 4.生成用户唯一标识uid
	let uid = new Date().getTime()
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
		log('成功')
		new initdata(ctx,'SUCCESS',gentoken(uid)).listing()
	})
	.catch((e)=>{
		log('失败')
		new initdata(ctx).tips('注册失败',500)
	})
})

// 登录的路由
router.post('/login', async ctx=>{
	let {name,password} = obJect(ctx.request.body)
	// 参数校验
	new chlogin(ctx,name,password).chloginFun()
	// 登录查询
	await new Queryuser(name,password,ctx).queryLogin()
})

// 发送验证码
router.post('/smcode',async ctx=>{
	let {name} = obJect(ctx.request.body)
	// 参数校验
	new codeing(ctx,name).codeIng()
	// 发送验证码
	await new Smcode(ctx,name).codeFun()
	
})


module.exports = router.routes()