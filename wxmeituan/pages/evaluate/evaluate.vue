<template>
	<view>
		<view class="Comment-text">
			<textarea  :placeholder="place" v-model="Comment"   show-confirm-bar="false" focus="true"/>
		</view>
		<!-- 发表按钮 -->
		<view class="published" @click="btnlist && bTn()">
			发表
		</view>
		<!-- 提示组件 -->
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
	</view> 
</template>

<script>
	var {log} = console
	// 引入提示组件
	import HMmessages from "@/components/HM-messages/HM-messages.vue"
	// post
	import {publicing} from '../../api/api.js'
	// 地址
	import {commenturl} from '../../api/request.js'
	export default{
		components: {HMmessages},
		data() {
			return {
				btnlist:true,// 是否禁掉按钮点击
				Comment:'',
				place:'',
				ide:'',
				userdata:{}
			}
		},
		
		methods:{
			bTn(){
				if(this.Comment == ''){
					let succ = '评论不能为空'
					let ico = 'error'
					this.tIps(succ,ico)
					return false
				}
				this.btnlist = false
				this.messAge()
			},
			messAge(){// 请求-评论
				let data = {
					messages:this.Comment,
					avatarUrl:this.userdata.avatarUrl,
					nickName:this.userdata.nickName,
					openid:this.userdata.openid,
					merchantid:this.ide
				}
				publicing(commenturl,data)
				.then((res)=>{
					this.Comment = ''
					let succ = '评论成功'
					let ico = 'success'
					this.tIps(succ,ico)
					this.btnlist = true
				})
				.catch((err)=>{
					log(err)
				})
			},
			tIps(succ,ico){		// 提示
				this.HMmessages.show(succ,{icon:ico,fontColor:"#ffffff",iconColor:"#ffffff",background:"rgba(102,0,51,0.8)"})
			}
		},
		onLoad(e) {
			this.place = '写下你对商家' + e.body + '的评价'// 商家名称
			this.ide = e.ide	// 商家标识
			this.userdata = uni.getStorageSync('usermen')// 用户信息
		}
		
	}
</script>

<style>
	page{background: #F1F1F1;}
	.Comment-text textarea{width: 100%; color: #808080 !important; font-size: 30upx;
							padding: 8upx;}
	.Comment-text{background: #FFFFFF;}
	.published{font-size: 35upx; background: #ffdd00;
				width: 300upx;
				text-align: center;
				margin: 20upx auto;
				padding: 10upx 0;
				border-radius: 10upx;}
</style>
