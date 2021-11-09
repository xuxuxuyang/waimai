const Koa = require('koa');
const app = new Koa();

 //服务启动端口
app.listen(3000);  //端口号不能跟其他程序造成端口冲突

//项目的其他配置
const cors = require('koa-cors');// 解决跨域
const json = require('koa-json');//把响应数据转成json格式
const bodyParser = require('koa-bodyparser'); //获取发起请求传入的参数
app.use(cors());
app.use(json());
app.use(bodyParser());

// 处理全局异常错误
const abnormal = require('./config/abnormal.js')// 引入处理全局异常处理函数
app.use(abnormal)  //注册处理全局异常处理中间件

// mongoose连接数据库
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)// 解决对数据库增删改查出现的警告
const mburl = require('./config/base.js').mburl// 引入数据库地址
// mongoose.connect(mburl, {// 因为mongoose放弃使用一些指令，导致会出现警告
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then((res)=>{
// 	console.log('数据库连接成功')
// })
// .catch((err)=>{
// 	console.log('数据库连接失败',err)
// })

//配置路由
 const router = require('koa-router')()// 路由:()直接实例化
 const banner= require('./routes/backend/optimiz') // 引入optimiz文件里的路由
 const forshop = require('./routes/foreend/foroptimiz.js') // 引入fordden文件里的路由
 const wxuser = require('./routes/wxuser/wxuser.js') // 微信登录
 const wxpay = require('./routes/wxpay/wxpay.js') // 微信支付
 const message = require('./routes/aimessage/aimessage.js') // 评论
 const pcuser = require('./routes/pcuser/pcuser.js') // pc端的注册登录
		// 注册路由中间价
 router.use('/api/banner',banner) // 配置上传商品的接口
 router.use('/api/forshop',forshop) // 配置查询商品的接口
 router.use('/api/wxuser',wxuser) // 配置小程序端微信用户登录接口
 router.use('/api/wxpay',wxpay) // 配置小程序端微信维护
 router.use('/api/message',message) // 配置小程序端评论 
 router.use('/api/pcuser',pcuser) // 配置pc端的注册登录
 app.use(router.routes())//注册路由
 app.use(router.allowedMethods()) //允许路由方法
 
console.log('3000端口服务器启动成功')