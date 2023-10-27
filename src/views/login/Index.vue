<template>
  <div class="login">
    <div class="box">
      <div class="company">
        company logo
      </div>
      <div class="form">
        <h2>登录</h2>
        <el-form ref="loginForm" :model="accountLoginForm">
          <el-form-item prop="account" :rules="[{required: true, message: '请输入账号'}]">
            <el-input size="large" placeholder="手机 / 邮箱" v-model="accountLoginForm.account">
              <template #prefix>
                <el-icon class="el-input__icon"><icon-ep-user /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item  prop="passwd" :rules="[{required: true, message: '请输入密码'}]" style="margin-top: 30px;">
            <el-input size="large" placeholder="请输入密码" type="password" v-model="accountLoginForm.passwd">
              <template #prefix>
                <el-icon class="el-input__icon"><icon-ep-lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" :loading="buttonLoading"
                       class="login-button" @click="loginHandler" block>登 录</el-button>
          </el-form-item>
          <el-divider class="other-divider">其他方式登录</el-divider>
          <div class="social-login">
<!--            <span title="使用微信账号登录">-->
<!--              <svg class="icon" aria-hidden="true" style="width: 27px;height: 27px;margin-top: 2px">-->
<!--                <use xlink:href="#icon-weixin"></use>-->
<!--              </svg>-->
<!--            </span>-->
            <span title="使用钉钉账号登录">
              <svg class="icon" aria-hidden="true" @click="openDingLoginDialog">
                <use xlink:href="#icon-dingding"></use>
              </svg>
            </span>
            <span title="使用企业微账号登录">
              <svg class="icon" aria-hidden="true" @click="openEWechatLoginDialog">
                <use xlink:href="#icon-a-Enterprisewechat"></use>
              </svg>
            </span>
          </div>
        </el-form>
      </div>
    </div>
    <DingTalkLogin ref="ding-login"  type="login"></DingTalkLogin>
    <EWechatLogin ref="e-wechat-login"  type="login"></EWechatLogin>
  </div>
</template>
<script>
import DingTalkLogin from "./DingTalkLogin.vue";
import EWechatLogin from "./EWechatLogin.vue";
import {useUserStore} from "@/store/userStore.js";

export default {
  name: "Login",
  components:{
    DingTalkLogin,
    EWechatLogin
  },
  data(){
    return {
      buttonLoading: false,
      user: useUserStore(),
      accountLoginForm:{
        account: '13802990402',
        passwd: '123456'
      }
    }
  },
  created() {

  },
  methods: {
    async loginHandler(){
      const valid = await this.$refs.loginForm.validate((valid)=>{})
      if (!valid) {
        return
      }
      this.buttonLoading = true
      const res = await this.$fly.post("/api/admin-users/token", this.accountLoginForm).catch((err)=>{
        console.log('err', err)
      })
      this.buttonLoading = false
      await this.user.loginSuccessHandler(res.data.token)
    },
    openDingLoginDialog() {
      this.$refs["ding-login"].open()
    },
    openEWechatLoginDialog() {
      this.$refs["e-wechat-login"].open()
    }
  }
}
</script>
<style lang="scss">
.login{
  .box{
    .form{
      .other-divider{
        margin-top: 60px;
        margin-bottom: 20px;
        .el-divider__text{
          background-color: transparent;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.login{
  width: 100%;
  height: 100%;
  background-color: $main-color;
  display: flex;
  justify-content: center;

  .box{
    height: 500px;
    width: 800px;
    margin-top: 200px;
    background-color: #E6E8EB;
    box-shadow: 10px 10px 15px rgb(0,0,0,.12);
    display: flex;

    .company{
      width: 240px;
      padding: 30px;
      border-right: 1px solid #CDD0D6;
    }
    .form{
      width: 400px;
      padding: 40px 80px;

      h2 {
        color: $main-color;
        letter-spacing: 5px;
      }

      .login-button{
        margin-top: 10px;
        width: 100%;
        font-size: 18px;
      }
      .social-login{
        display: flex;
        justify-content: center;
        .icon{
          width: 32px;
          height: 32px;
          fill: currentColor;
          overflow: hidden;
          margin-right: 20px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>