## 				node.js使用koa编写后端接口步骤

#### 1.初始化项目 

##### 			新建项目->创建app.js文件

```
npm init				//生成package.json(全部回车即可)
npm install nodemon  	//安装nodemon自动启动项目
npm install koa			//koa
npm install koa-json    //把响应数据转成json格式
npm install koa-router  //koa路由
npm install koa-bodyparser //在ctx获取发起请求传入的参数
```

#### 2.配置+启动node.js服务器（app.js中写入）

```
const Koa = require('koa'); //引入koa
const app = new Koa();		//实例化koa
app.listen(3000); //服务启动端口 不能和其他应用端口冲突

//解决跨域问题
const cors = require('koa-cors');// 解决跨域
app.use(cors());

//启动路由
const router = require('koa-router')() //后面加()直接实例化路由
app.use(router.routes()) 
app.use(router.allowedMethods()) 

//注册把响应数据转成json格式的中间件
const json = require('koa-json')
app.use(json()) 

//注册获取发起请求传入的参数的中间件
const bodyParser = require('koa-bodyparser'); //获取请求数据
app.use(bodyParser());

//注册全局异常处理中间件
const globalerr = require('./config/abnormal.js')// 全局异常处理
app.use(globalerr)

console.log('服务器启动成功')
```

#### 3.连接mongodb数据库（app.js中写入）

```
// 连接阿里云数据库
const mongoose = require('mongoose') //引入mongoose
mongoose.connect('数据库公网地址', {
  useNewUrlParser: true,// 因为mongoose放弃使用一些指令，导致会出现警告
  useUnifiedTopology: true
}).then((res)=>{
	console.log('数据库连接成功')
})
.catch((err)=>{
	console.log('数据库连接失败',err)
})
mongoose.set('useFindAndModify', false)// 解决对数据库增删改查出现的警告
```

#### 4.设计数据库字段，注册对象模型（在路由中使用）

##### 			新建models文件夹->新建Username.js文件

```
const mongoose = require('mongoose') //引入mongoose
const Schema = mongoose.Schema

// 实例化数据模板:注册功能字段
const NameSchema = new Schema({
	// 注册对象模型
	name:{
		type:String,
		require:true
	},
	password:{
		type:String,
		require:true
	},
	openid:{           //商家的唯一标识
		type:String,
		require:true
	}
},
	{
		versionKey:false  //取消数据库自动生成的	"_V"=0 字段
	}
)
module.exports = Username = mongoose.model('mongodb数据库名称',NameSchema)

```

#### 5.创建路由

##### 		   新建router文件夹->新建adduser.js文件

```
const router = require('koa-router')()// 路由:()直接实例化
const Username = require('../../models/username') // 引入Schema注册模型

const initdata = require('../../config/init.js') //处理响应的init.js文件
class initdata{
	constructor(ctx,msg='SUCCESS',data=[],code=200) {
	    this.ctx = ctx
		this.msg = msg
		this.data = data
		this.code = code
	} 
	// 参数正确的响应方法
	listing(){
		this.ctx.body = {
			msg:this.msg,
			data:this.data
		}
		this.ctx.status = this.code
	}
	// 参数出错的响应方法
	tips(tipmsg,codes){
		this.ctx.body = {
			msg:tipmsg
		}
		this.ctx.status = codes
	}
}
module.exports = initdata


//注册路由
router.post('/adduser',async ctx=>{
	console.log(ctx.request.body)
	let{name,password,userid} = ctx.request.body  //解构出用户信息
	//给数据库添加数据
	const user = new Username({			
		name,
		password,
		userid 
	})
	//添加数据前 应该先做校验
	//参数出错的响应
	if(name == ''){
		new initdata(ctx).err('参数填写出错',202)
		return false
	}
	...更具具体情况给出不同的响应
	//参数正确的响应
	await user.save()
	.then((res)=>{  //往数据库中添加数据
		new initdata(ctx,'注册成功').suc()
	)})
	.catch((err)=>{
		new initdata(ctx).err('注册失败',500)
	})
})
module.exports = router.routes()

```

#### 6.使用路由（app.js中写入）

```
 const adduser= require('./routes/adduser') // 引入adduser文件里的路由
 //注册路由中间件
 router.use('/api',adduser) // 配置上传商品的接口
 
 调用此接口获取数据的请求地址为: http://localhost:3000/api/adduser
 


 
 
 
```

#### 7.处理未知的错误

##### 				创建globalerr.js文件

```
// 自定义异常处理中间件
	class Err extends Error{  	//Error是node自带的类
		constructor(msg,code) {
	   	 super()
			this.msg = msg
			this.code = code
		}
	}

 let globalerr = async(ctx,next)=>{
	 try{
	 	await next()
	 }catch(err){
		 const finderr = err instanceof Err //A instanceof B ，返回值为boolean类型，用来判断A是否是B的实例对象或者B子类的实例对象。如果是则返回true,否则返回false。
		 if(finderr){	//node中Error类中包含的已知类型的错误
			 console.log(err)
			 ctx.body = {
				 msg:err.msg
			 }
			 ctx.status = err.code
		 }
		 else{
			 if(err.field){ //自定义的错误
				 ctx.body = {
				 	 msg:'图片参数不正确'
				 }
				 ctx.status = 400
				 return false
			 }
			 //未知类型的错误
			 ctx.body = {
			 	 msg:'服务器发生错误'
			 }
			 ctx.status = 500
		 }
	 }
 }
 module.exports = globalerr
```

















