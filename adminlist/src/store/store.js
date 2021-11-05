import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const userInfo = {
	token:localStorage.getItem("openid")||''
};

const state = {
	userInfo
}

export default new Vuex.Store({
	state,
	actions:{
		users(user){
//			console.log(user)
			user.commit('usersinfo')
		}
	},
	mutations:{
		usersinfo(state){
			state.userInfo = {
				token:localStorage.getItem("openid")||''
			}
//			console.log(state.userInfo)
		}
	}
})
