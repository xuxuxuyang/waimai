// 处理响应
class initdata{
	constructor(ctx,msg='SUCCESS',data=[],code=200) {
	    this.ctx = ctx
		this.msg = msg
		this.data = data
		this.code = code
	}
	listing(){// 200的正确返回
		this.ctx.body = {
			msg:this.msg,
			data:this.data
		}
		this.ctx.status = this.code
	}
	tips(tipmsg,codes){// 参数不对的响应
		this.ctx.body = {
			msg:tipmsg
		}
		this.ctx.status = codes
	}
}
module.exports = initdata