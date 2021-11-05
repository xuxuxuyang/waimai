<template>
	<view>
		<!-- uniapp生成小程序不能使用v-show = display:none -->
		<!-- 商家介绍 -->
		<Business :busidata="busidata"></Business>
		<!-- tab切换 -->
		<Tabs></Tabs>
		<view class="ordering-sceate">
			<!-- 商品下单 -->
			<Ordering :class="[hideing === 0 ? 'actineclass' : 'errorclass']"
			:orderingdata="orderingdata"
			:busidata = "busidata"
			></Ordering>
			<!-- 评价 -->
			<Message :class="[hideing === 1 ? 'actineclass' : 'errorclass']"
			:messagedata="messagedata"
			:tabmessage = "tabmessage"
			:empty = "empty"
			></Message>
			<!-- 商家详情 -->
			<Introduce :busidata="busidata" 
			:class="[hideing === 2 ? 'actineclass' : 'errorclass']"></Introduce>
		</view>
		<!-- loading -->
		<home-load v-if="efinition"></home-load>
	</view>
</template>

<script>
	import Business from './components/business.vue'
	import Tabs from './components/tabs.vue'
	import Ordering from './components/ordering.vue'
	import Message from './components/message.vue'
	import Introduce from './components/introduce.vue'
	// post
	import {publicing} from '../../api/api.js'
	// 请求地址
	import {discussurl,shopurl,getdishesurl} from '../../api/request.js'
	var {log} = console
	export default{
		components:{
			Business,
			Tabs,
			Ordering,
			Message,
			Introduce
		},
		data() {
			return {
				efinition:true,// loading
				hideing: 0,
				busidata:{},// 商家介绍
				orderingdata:[],// 商品数据
				messagedata:[],// 评论数据
				tabmessage:[],// 评论分类的标签
				empty:'',// 没有评论的标识
				ids:''	// 商家唯一标识
			}
		},
		methods:{
			// 被子组件tabs调用的方法
			fatherMethod(index){
				this.hideing = index
			},
			// 请求数据
			takeFun(ids){
				let data = {
					openid:ids
				}
				let disdata = {
					merchantid:ids
				}
				Promise.all([publicing(shopurl,data),publicing(getdishesurl,data),publicing(discussurl,disdata)])
				.then((res)=>{
					this.busidata = res[0].data[0]// 商家介绍
					this.orderingdata = res[1].data// 商品数据
					if(res[2].data.length === 0){// 评论
						this.empty = 'EMPTY'
					}else{
						this.messagedata = res[2].data
						let messageword = res[2].data.map((item)=>{
							return item.classmessage
						})
						let newarr = Array.from(new Set(messageword))// 标签去重
						var newArr = newarr.filter(item => item)// 标签去空值
						this.tabmessage = ['全部', ...newArr]// 取出评论分类标签放在一个数组里
					}
					// loading取消
					this.efinition = false
					
				})
				.catch((err)=>{
					log(err)
				})
			},
			// 被评论子组件调用的函数
			messageMethod(item){
				if(item == '全部'){
					let data = {
						merchantid:this.ids
					}
					this.classifMess(data)
				}else{
					let data = {
						merchantid:this.ids,
						classmessage:item
					}
					this.classifMess(data)
				}
			},
			// 请求评论分类的数据
			classifMess(data){
				publicing(discussurl,data)
				.then((res)=>{
					this.messagedata = res.data
				})
				.catch((err)=>{
					log(err)
				})
			}
		},
		onLoad(e) {
			this.ids = e.id
			this.takeFun(e.id) //进入页面 请求数据
		}
	}
</script>

<style scoped>
	.actineclass{display: block; overflow-y: auto; height: 100%;}
	.errorclass{display: none;}
	.ordering-sceate{position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	top: 230upx;}
</style>
