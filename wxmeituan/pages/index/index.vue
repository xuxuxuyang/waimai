<template>
	<view class="contenting">
		<Search></Search>
		<Preference :preferdata="preferdata"></Preference>
		<Title></Title>
		<view @click="poll()">
			<Delicacy id="boxFixed" :class="{'is_fixed' : isfixed}"></Delicacy>
		</view>
		<view style="height: 50upx;"></view>
		<Takeout :takeshop="takeshop"></Takeout>
		<home-load v-if="efinition"></home-load>
	</view>
</template>

<script>
	// 引进子组件
	import Search from './components/search.vue'
	import Preference from './components/preference.vue'
	import Title from './components/title.vue'
	import Delicacy from './components/delicacy.vue'
	import Takeout from './components/takeout.vue'
	
	import {listing} from '../../api/api.js'	// 引入发起请求数据接口方法
	import {getpreferurl,wxshopurl} from '../../api/request.js'	// 引入接口数据请求地址	// 引入发起请求数据接口方法

	import {mapState} from 'vuex'// 引入vuex的mapstate
	export default {
		components:{
			Search,
			Preference,
			Title,
			Delicacy,
			Takeout,
		},
		data() {
			return {
				efinition:true,// 控制页面loading显示
				menutop:'', //绑定id的组件距离顶部的距离
				rect:'',//页面滚动的距离
				isfixed:false, //控制组件固定定位样式
				preferdata:[],// 为你优选数据
				takeshop:[],// 商家列表数据
			}
		},
		methods:{
			//请求数据库
			preference(){
				Promise.all([listing(getpreferurl),listing(wxshopurl)]) // 批量并发请求多个接口，Promise.all =>可以并发请求多个接口。并且同时得到多个接口的数据
					.then((res)=>{
						this.preferdata = res[0].data// 为你优选
						this.takeshop = res[1].data// 商家列表
						this.efinition = false// 页面loading隐藏
					})
					.catch((err)=>{
						console.log(err)
					})
			},
			// 回到顶部
			poll(){
				wx.pageScrollTo({
				  scrollTop: this.menutop,
				  duration: 300 //过度时间
				}) 
			},
		},
		onLoad() {
			// 监听绑定id的筛选组件距离顶部的距离
			const query = wx.createSelectorQuery()
			query.select('#boxFixed').boundingClientRect()
			query.exec((res)=>{
				this.menutop = res[0].top
			})
		},
		// 监听页面滚动距离
		onPageScroll(e) {
			this.rect = e.scrollTop
		},
		mounted() {
			this.preference() //进入页面获取数据
		},
		computed:{
			...mapState(['screendata']),
			// 监听筛选组件置顶和不置顶
			namepage(){
				if(this.rect > this.menutop){// 如果页面滚动的高度大于筛选组件距离顶部的高度，那就置顶，反之不置顶
					this.isfixed = true
				}else{
					this.isfixed = false
				}
			},
			// 筛选来的商家数据
			count(){
				this.takeshop = this.screendata.screenarr
			}
		}
		
	}
</script>

<style scoped>
	.contenting{margin: 0 15upx;}
	.is_fixed{position: fixed; left: 0; top: 0; right: 0;}
</style>
