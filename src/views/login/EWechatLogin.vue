<template>
  <el-dialog v-model="visible" :title="title" top="220px" width="400px" @closed="visible = false;unWwLogin()" :close-on-click-modal="false">
    <div id="e-wechat-login-qrcode">

    </div>
  </el-dialog>
</template>

<script>
import * as ww from '@wecom/jssdk'
import {useUserStore} from "@/store/userStore.js";
export default {
  name: "EWechatLogin",
  props:{
    type:{
      type: String,
      default: 'login' //login：登录 bind：绑定账号
    }
  },
  data() {
    return {
      user: useUserStore(),
      visible: false,
      callback: null,
      processing: false,
      app_id: 'wwbbb6a7b539f2xxxxx',
      agent_id: 1,
      wwLogin: null,
    }
  },
  computed:{
    title() {
      return this.type === 'login' ? '企业微信扫码登录': '绑定企业微信账号'
    },
    redirect_uri() {
      return window.location.protocol + "//"+ window.location.host + "/login"
    }
  },
  mounted() {
  },
  methods: {
    open(callback){
      this.visible = true
      this.callback = callback
      this.$nextTick(()=>{
        this.wwLogin = ww.createWWLoginPanel({
          el: '#e-wechat-login-qrcode',
          params: {
            login_type: 'CorpApp',
            appid: this.app_id,
            redirect_uri: this.redirect_uri,
            agentid: this.agent_id,
            panel_size: 'small',
            state: this.type,
            redirect_type: 'callback',
          },
          onCheckWeComLogin({ isWeComLogin }) {
            console.log(isWeComLogin)
          },
          onLoginSuccess({ code }) {
            console.log({ code })
            if (this.type==='login'){
              this.doLogin(code)
            }else if (this.type==='bind'){
              this.bindAccount(code)
            }
          },
          onLoginFail(err) {
            console.log(err)
          },
        })
      })
    },
    unWwLogin(){
      this.wwLogin.unmount()
    },
    async doLogin(code) {
      const res = await this.$fly.get("/api/admin-users/social/"+code, {type:'enterprisewechat'}).catch((err)=>{
        console.log('err', err)
      })
      if (res && res.code===0){
        this.unWwLogin()
        await this.user.loginSuccessHandler(res.data.token)
      }
    },
    async bindAccount(code){
      const res = await this.$fly.post("/api/admin-users/social/"+code, {type:'enterprisewechat'}).catch((err)=>{
        console.log('err', err)
      })
      if (res && res.code===0){
        this.visible = false
        this.unWwLogin()
        if (this.callback){
          this.callback(res)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#ding-login-qrcode{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>