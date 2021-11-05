import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)




const screendata = {
	screenarr:[]// 存储筛选出来的数据
}

const state = {
	screendata
}
export default new Vuex.Store({
	state,
	mutations:{
		screenmuta(state,listdata){
			state.screendata = {
				screenarr:listdata // 存储到数据仓库
			}
		}
	}
})