const multer = require('koa-multer');
const OSS = require('ali-oss');


let client = new OSS({
  region: 'oss-cn-beijing',
  //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
  accessKeyId: 'LTAI5tLDp6SWdxVJNeRxhkQ9',
  accessKeySecret: 'S1FCy24rX1HH5ZRKUBeKoBClXobC3K',
  bucket: 'gaoxiaofuwupingtai',
});
// 图片类上传后后端文件夹  diskStorage:存储
let storage = multer.diskStorage({
	// 图片存储路径
	destination:(req,file,cb)=>{
		cb(null,'public/uploads/')
	},
	// 修改文件名称，也防止同名文件产生
	filename:(req,file,cb)=>{
		let fileFormat = (file.originalname).split(".")
		// 时间戳Date.now():1970-1-1-00:00:00到现在的毫秒数
		cb(null,Date.now() + "." + fileFormat[fileFormat.length -1])
	}
})
// 配置multer
let upload = multer({storage})

//上传图片到oss
let uploadimg = function(image){
	return new Promise((resolve,reject)=>{
		client.put('meituanoss/' + image,image)
		.then((res)=>{ 
			resolve(res.url)
		})
		.catch((err)=>{
			reject(err)
		})
	})
}


module.exports = {upload,uploadimg}