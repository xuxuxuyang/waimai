// 路由:()直接实例化
const router = require('koa-router')()
const {log} = console

// 校验
const {
chregister,
chprefer,
chlogin,
chdeleprefer,
chupdataprefer,
choss,
chshopcalss,
chdishes
} = require('../../config/checking.js')
// 转换body
let {obJect} = require('../../config/object.js')
// 响应接收
const initdata = require('../../config/init.js')
// 上传图片
const {upload} = require('../../oss/oss.js')
// 引进uploads文件
const {uploading,modify,variety} = require('../../config/uploads.js')
// token权限
const {Auth} = require('../../config/auth.js')

// 注册模型
const Username = require('../../models/username')
// 为你优选模型
const Perfer = require('../../models/preferen')
// 商家设置
const Business = require('../../models/optimizdata.js')
// 商品分类
const Shopclass = require('../../models/classifica.js')
// 商品数据
const Dishesclass = require('../../models/adddishes.js')


// 为你优选
router.post('/prefer', upload.single('file'),  async ctx=>{
	log('为你优选')//formdata  ：file======>ctx.req.body
	// log(ctx.req.body)
	let {title,lable,file} = ctx.req.body
	
	// 参数校验
	new chprefer(ctx,title,lable).chpreferFun()
	
	let obj = {
		title,
		lable
	}
	await new uploading(ctx,obj,'image',Perfer).resultdata()
})


// 删除为你优选：指定数据
router.post('/deleprefer', async ctx=>{
	let {ids} = obJect(ctx.request.body)
	log(ctx.request.body)
	// 参数校验
	new chdeleprefer(ctx,ids).chdelepreferFun()
	
	try{
		let listdata = await preIng()
		if(listdata.deletedCount === 1){
			log('成功')
			new initdata(ctx).listing()
		}else{
			log('失败')
			new initdata(ctx).tips('删除失败',400)
		}
	}catch(e){
		new initdata(ctx).tips('删除失败',500)
	}
	
	
	function preIng(){
		return new Promise((resolve,reject)=>{
			Perfer.deleteOne({_id:ids},(err,res)=>{
				if(err){
					reject(err)
				}else{
					resolve(res)
				}
			})
		})
	}
	
})


// 更改为你优选
router.post('/updataprefer', upload.single('file'), async ctx=>{
	let {file,title,lable,ids} = ctx.req.body
	// 如果前端上传了图片那么图片在ctx.req.file
	// 参数校验
	new chupdataprefer(ctx,title,lable,ids).chupdatapreferFun()
	
	let obj = { 
		title,
		lable
	}
	if(file === undefined){
		// 商家修改了图片
		log('商家修改了图片')
		await new modify(ctx,obj,'image',Perfer,ids).preference()
	}else{
		log('商家未修改图片')
		await new modify(ctx,obj,'image',Perfer,ids).toupdata(file)
	}
})


// 商家设置的个人信息
router.post('/oss',new Auth().m, upload.single('file'), async ctx=>{
	log('商家设置')
	log(ctx.auth.uid)
	let {shop,file,delivering,physical,capita,types,times,duration,address} = ctx.req.body
	// 校验
	new choss(ctx,shop,delivering,physical,capita,types,times,duration,address).chossFun([delivering,physical,capita,])
	
	let obj = {openid:ctx.auth.uid,shop,delivering,physical,capita,types,times,duration,address}
	await new uploading(ctx,obj,'logo',Business).resultdata()
})


// 商家上传的商品的分类
router.post('/shopcalss',new Auth().m, async ctx=>{
	let {classdata} = obJect(ctx.request.body)
	log(ctx.request.body)
	// 校验
	new chshopcalss(ctx,classdata).chshopcalssFun()
	// 存储到集合
	const newShop = new Shopclass({
		openid:ctx.auth.uid,
		classdata
	})
	await newShop
	.save()
	.then((res)=>{
		new initdata(ctx).listing()
	})
	.catch((err)=>{
		new initdata(ctx).tips('提交失败',500)
	})
})


// 删除当前商家的商品分类
router.post('/deleshopcalss', new Auth().m, async ctx=>{
	let {ids} = obJect(ctx.request.body)
	// 参数校验
	new chdeleprefer(ctx,ids).chdelepreferFun()
	
	try{
		let listdata = await preIng()
		if(listdata.deletedCount === 1){
			log('成功')
			new initdata(ctx).listing()
		}else{
			log('失败')
			new initdata(ctx).tips('删除失败',400)
		}
	}catch(e){
		new initdata(ctx).tips('删除失败',500)
	}
	
	function preIng(){
		return new Promise((resolve,reject)=>{
			Shopclass.deleteOne({_id:ids},(err,res)=>{
				if(err){
					reject(err)
				}else{
					resolve(res)
				}
			})
		})
	}
})


// 上传商品
router.post('/dishes', new Auth().m, upload.single('file'), async ctx=>{
	let {optidata,input,tags,Price,Discount} = ctx.req.body
	// 校验
	new chdishes(ctx,optidata,input,tags,Price,Discount).chdishesFun([Price,Discount])
	let arrtag = JSON.parse(tags)
	let obj={
		openid:ctx.auth.uid,
		optidata,
		"objdis":{
			input,
			tags:arrtag,
			Price,
			Discount
		}
	}
	
	// 提交到集合
	await new variety(ctx,obj,'image',Dishesclass).varietyupta()
})

// 删除当前商家的商品数据
router.post('/deledishes', new Auth().m, async ctx=>{
	let {ids} = obJect(ctx.request.body)
	// 参数校验
	new chdeleprefer(ctx,ids).chdelepreferFun()
	try{
		let listdata = await preIng()
		if(listdata.deletedCount === 1){
			log('成功')
			new initdata(ctx).listing()
		}else{
			log('失败')
			new initdata(ctx).tips('删除失败',400)
		}
	}catch(e){
		new initdata(ctx).tips('删除失败',500)
	}
	
	function preIng(){
		return new Promise((resolve,reject)=>{
			Dishesclass.deleteOne({_id:ids},(err,res)=>{
				if(err){
					reject(err)
				}else{
					resolve(res)
				}
			})
		})
	}
})



module.exports = router.routes()