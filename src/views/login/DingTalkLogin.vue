<template>
  <el-dialog v-model="visible" :title="title" top="220px" width="400px" @closed="visible = false" :close-on-click-modal="false">
    <div id="ding-login-qrcode">

    </div>
  </el-dialog>
</template>

<script>
import {useUserStore} from "@/store/userStore.js";

export default {
  name: "DingTalkLogin",
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
      app_id: 'dingtqqax1cir3uzkxau',
    }
  },
  computed:{
    title() {
      return this.type === 'login' ? '钉钉扫码登录': '绑定钉钉账号'
    },
    redirect_uri() {
      return window.location.protocol + "//"+ window.location.host + "/login"
    }
  },
  mounted() {
  },
  methods: {
    open(callback){
      this.processing = false
      this.visible = true
      this.callback = callback
      this.$nextTick(()=>{
        window.DTFrameLogin(
            {
              id: 'ding-login-qrcode',
              width: 300,
              height: 300,
            },
            {
              redirect_uri: encodeURIComponent(this.redirect_uri),
              client_id: this.app_id,
              scope: 'openid',
              response_type: 'code',
              state: this.type,
              prompt: 'consent',
            },
            (loginResult) => {
              const {redirectUrl, authCode, state} = loginResult;
              console.log('state', state);
              console.log('code', authCode);
              if (this.processing){
                console.log('processing');
                return
              }
              this.processing = true
              if (state=='login'){
                this.doLogin(authCode)
              }else if (state=='bind'){
                this.bindAccount(authCode)
              }
            },
            (errorMsg) => {
              // 这里一般需要展示登录失败的具体原因
              ElMessage.error(errorMsg)
            },
        );
      })
    },
    async doLogin(code) {
      const res = await this.$fly.get("/api/admin-users/social/"+code, {type:'dingtalk'}).catch((err)=>{
        console.log('err', err)
      })
      if (res && res.code===0){
        await this.user.loginSuccessHandler(res.data.token)
      }
    },
    async bindAccount(code){
      const res = await this.$fly.post("/api/admin-users/social/"+code, {type:'dingtalk'}).catch((err)=>{
        console.log('err', err)
      })
      if (res && res.code===0){
        this.visible = false
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