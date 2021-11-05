<template>
  <div id="backcont">
  <!-- logo -->
  <div class="meituan-content">
    <div class="logos">
      <img src="../../images/logo.svg" />
    </div>
      <div class="login-cont">
        <div class="meituan-title">美团商家中心</div>
        <div class="meituan-user">
           <img src="../../images/zhanghao.svg" />
           <el-input v-model="name" placeholder="请输入手机号码"></el-input>
        </div>
        <div class="meituan-user">
          <img src="../../images/mima.svg" />
         <el-input v-model="password" placeholder="请输入密码" show-password auto-complete="new-password"></el-input>
        </div>
        <!-- 验证码 -->
        <div class="meituan-user codelist" v-if="hideing">
          <img src="../../images/mima.svg" />
         <el-input v-model="codedata" placeholder="请输入验证码"></el-input>
         <div class="codeing" @click="prevent && codeName()">{{codename}}</div>
        </div>
        <!-- 注册 -->
        <div class="register">
          <p @click="regiSter()">{{codetext}}</p>
        </div>
        <!-- 登录 -->
        <div v-if="!hideing" class="meituan-btn" @click="btNs()">登录</div>
        <!-- 注册 -->
        <div v-if="hideing" class="meituan-btn" @click="btNregi()">注册</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {home} from '../../api/api.js'
  // 请求地址
  import {loginurl,rejisturl,codeurl} from '../../api/request.js'
  export default {
      data() {
        return {
           name: '',
           password:'',
           codedata:'',
           // ----以上要提交的注册三个值
           hideing:false,
           codetext:'注册',
           codename:'获取验证码',
           prevent:true,//禁止验证码按钮点击
        }
      },

      methods:{
        // 注册登录切换
        regiSter(){
          if(this.codetext == '登录'){
            this.empty()
            this.codetext = '注册'
            this.hideing = false
          }else if(this.codetext == '注册'){
            this.empty()
            this.codetext = '登录'
            this.hideing = true
          }
        },

        // 清空三个输入框
        empty(){
          this.name = '',
          this.password = '',
          this.codedata = ''
        },

        // 发送验证码
        codeName(){
          if(this.name == '') return false
          //时间
          let that = this
          var countdown = 60;
          codetime();
          function codetime(){
          	if(countdown == 0){
          		that.codename = "获取验证码";
          		countdown = 60;
              that.prevent = true;
          		return;
          	}else{
              that.prevent = false;
          		countdown--;
          		that.codename = "" + countdown + "秒后重发";
          	}
          	setTimeout(()=>{
          		codetime();
          	},1000)
          }

          // 发送请求{验证码}
          console.log('注册')
          let username = {
            "name":this.name
          }
          home(username,codeurl)
          .then(res=>{
            console.log(res)
            if(res.data.msg == 'SUCCESS'){
              new this.mytitle(this.$message,'success','验证码发送成功').funtitle()
            }else{
              new this.mytitle(this.$message,'warning',res.data.msg).funtitle()
            }
          })
          .catch(err=>{
            new this.mytitle(this.$message,'warning','验证码发送失败').funtitle()
          })
        },

        // 注册
        btNregi(){
          console.log('注册')
          let username = {
            "name":this.name,
            "password":this.password,
            "code":this.codedata
          }
          home(username,rejisturl)
          .then(res=>{
            console.log(res)
            if(res.data.msg == 'SUCCESS'){
              new this.mytitle(this.$message,'success','注册成功').funtitle()
              localStorage.setItem("openid", res.data.data)
              //跳转页面
              this.$router.push({name:'home'})
            }else{
              new this.mytitle(this.$message,'warning',res.data.msg).funtitle()
            }
          })
          .catch(err=>{
            console.log(err)
          })
        },

        // 登录
        btNs(){
          let username = {
            "name":this.name,
            "password":this.password
          }
          home(username,loginurl)
          .then((res)=>{
            console.log(res)
            if(res.data.msg == 'SUCCESS'){
              console.log('登录成功')
              // 存储到本地
              localStorage.setItem("openid", res.data.data)
              //跳转页面
              this.$router.push({name:'home'})
            }else{
              new this.mytitle(this.$message,'warning',res.data.msg).funtitle()
            }

          })
          .catch((err)=>{
            console.log(err)
            new this.mytitle(this.$message,'info','服务器错误，请稍后再试').funtitle()
          })
        },

      },

      beforeCreate() {
        console.log('登录页')
        let ids = localStorage.getItem("ids")
        if(!ids || ids != 1){
          localStorage.setItem("ids", 1)
        }
      },

      watch:{
        name(newvalue,oldvalue){
          console.log(newvalue)
          let phone = /^1[3456789]\d{9}$/
          if(!phone.test(newvalue)){
          	console.log('手机号码不正确')
            this.prevent = false
          }else{
            this.prevent = true
          }
        }
      }

    }
</script>

<style scoped="scoped">
  #backcont{background-image: url(../../images/beijing.jpg);
  background-attachment: fixed;
      background-repeat: no-repeat;
      background-size: cover;
     -webkit-background-size: cover;
      -moz-background-size: cover;
      min-height: 100vh;
      }
  .meituan-content{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .login-cont{
        width: 500px;
        height: 330px;
        background: #ffc700;
        border-radius: 5px;
  }

  .logos{width: 80px; height: 80px; margin: 0 auto; padding-bottom: 10px;}
  .logos img{width: 80px; height: 80px;}
  .meituan-title{text-align: center; color: white; font-size: 25px;
  padding-top: 20px;
  font-family: Arial, Helvetica, sans-serif;}
  .meituan-user{width: 400px; margin: 0 auto; padding-top: 20px; height: 40px;
  display: flex;
  align-items: center;
  }
  .meituan-user img{width: 25px; height: 25px; padding-right: 10px;}
  .meituan-btn{width: 200px; height: 40px; background: #409EFF;
  display: flex; align-items: center; justify-content: center; margin: 20px auto 0 auto;
  border-radius: 5px; font-size: 20px; color: white;
  cursor:pointer}
  .register p{
  width: 133px; height: 20px; line-height: 20px;
  text-align: center;
  margin-top: 10px;
  color: white;
  cursor:pointer}
  .register{display: flex; justify-content: flex-end;}
  .codeing{width: 180px; height: 40px; text-align: center;
  line-height: 40px;
  background: #00FF00;
  cursor:pointer}
  .codelist .el-input__inner{border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;}
  .input{border: none !important;}
</style>
