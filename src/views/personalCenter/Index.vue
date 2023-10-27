<template>
<div>
  <h3>个人信息</h3>
  <el-form label-width="100px" label-position="left">
    <el-form-item label="手机号码">
      {{user.mobile}}
    </el-form-item>
    <el-form-item label="邮箱">
      {{user.email}}
    </el-form-item>
    <el-form-item label="姓名">
      {{user.name}}
    </el-form-item>
  </el-form>
  <h3>第三方账号绑定</h3>
  <el-form label-width="100px" label-position="left">
    <el-form-item label="钉钉" v-if="dingAccount">
      <svg class="icon" aria-hidden="true" @click="openDingLoginDialog">
        <use xlink:href="#icon-dingding"></use>
      </svg>
      <template v-if="dingAccount.unionid">
        <el-link type="danger" @click="unBindDingAccount">解绑</el-link>
      </template>
      <template v-else>
        <el-link type="primary" @click="openDingAccount">绑定</el-link>
      </template>
    </el-form-item>
    <el-form-item label="企业微信" v-if="eWechat">
      <svg class="icon" aria-hidden="true" @click="">
        <use xlink:href="#icon-a-Enterprisewechat"></use>
      </svg>
      <template v-if="eWechat.unionid">
        <el-link type="danger" @click="unBindEWechatAccount">解绑</el-link>
      </template>
      <template v-else>
        <el-link type="primary" @click="openEWechatAccount">绑定</el-link>
      </template>
    </el-form-item>
  </el-form>
  <DingTalkLogin ref="ding-login" type="bind"></DingTalkLogin>
  <EWechatLogin ref="e-wechat" type="bind"></EWechatLogin>
</div>
</template>

<script>
import fly from "@/lib/flyio.js";
import DingTalkLogin from "@/views/login/DingTalkLogin.vue";
import EWechatLogin from "@/views/login/EWechatLogin.vue";
import {useUserStore} from "@/store/userStore.js";

export default {
  name: "Index",
  components: {DingTalkLogin, EWechatLogin},
  data() {
    return {
      dingAccount: null,
      user: useUserStore(),
      eWechat: null,
    }
  },
  created() {
    this.user.pull(true)
    this.getDingAccount()
    this.getEWechatAccount()
  },
  methods: {
    async getDingAccount(){
      const res = await fly.get("/api/admin-users/social",{type: 'dingtalk'}).catch((err)=>{
        console.log('err', err)
      })
      this.dingAccount = res.data
    },
    async unBindDingAccount() {
      const confirm = await ElMessageBox.confirm(
          '确定解绑钉钉账号？',
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            type: 'warning',
          }
      ).catch((err)=>{})
      if (confirm!=='confirm'){
        return
      }
      const res = await fly.delete("/api/admin-users/social/dingtalk").catch((err)=>{
        console.log('err', err)
      })
      if (res && res.code ===0 ){
        ElMessage.success("解绑钉钉账号成功")
        this.dingAccount = {}
      }
    },
    openDingAccount() {
      this.$refs["ding-login"].open((res)=>{
        this.dingAccount = res.data
        ElMessage.success("绑定钉钉账号成功")
      })
    },
    async getEWechatAccount(){
      const res = await fly.get("/api/admin-users/social",{type: 'enterprisewechat'}).catch((err)=>{
        console.log('err', err)
      })
      this.eWechat = res.data
    },
    openEWechatAccount() {
      this.$refs["e-wechat"].open((res)=>{
        this.eWechat = res.data
        ElMessage.success("绑定企业微信账号成功")
      })
    },
    async unBindEWechatAccount() {
      const confirm = await ElMessageBox.confirm(
          '确定解绑企业账号？',
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            type: 'warning',
          }
      ).catch((err)=>{})
      if (confirm!=='confirm'){
        return
      }
      const res = await fly.delete("/api/admin-users/social/enterprisewechat").catch((err)=>{
        console.log('err', err)
      })
      if (res && res.code ===0 ){
        ElMessage.success("解绑企业微信账号成功")
        this.eWechat = {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.icon{
  width: 24px;
  height: 24px;
  fill: currentColor;
  overflow: hidden;
  margin-right: 50px;
}
</style>