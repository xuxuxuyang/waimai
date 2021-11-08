class Err extends Error{ //Error是node自带的类
	constructor(msg,code) {
	    super()
		this.msg = msg
		this.code = code
	}
}
 let abnormal = async(ctx,next)=>{
	 try{
	 	await next()
	 }catch(err){
		 const finderr = err instanceof Err //A instanceof B ，返回值为boolean类型，用来判断A是否是B的实例对象或者B子类的实例对象。如果是则返回true,否则返回false。
		 if(finderr){  //node中Error类中包含的已知类型的错误
			 ctx.body = {
				 msg:err.msg
			 }
			 ctx.status = err.code
		 }
		 else{ 
			 if(err.field){
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
 module.exports = abnormal