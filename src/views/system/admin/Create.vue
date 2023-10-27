<template>
  <el-dialog v-model="visible" :title="title" top="150px" width="40%" @closed="visible = false" :close-on-click-modal="false">
    <el-form ref="user-create-form" :model="formData" label-width="100px" label-position="left">
      <el-form-item label="手机号码" prop="mobile" :rules="[{required: true, message: '必须输入'}]">
        <el-input v-model="formData.mobile" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email" :rules="[{required: true, message: '必须输入'}]">
        <el-input v-model="formData.email" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item v-if="action==1"  label="密码" prop="passwd" :rules="[{required: true, message: '必须输入'},{min: 6, message: '密码长度不能低于6'}]">
        <el-input v-model="formData.passwd" type="password" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name" :rules="[{required: true, message: '必须输入'}]">
        <el-input v-model="formData.name" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status"  :rules="[{required: true, message: '必须选择'}]">
        <el-switch
            v-model="formData.status"
            size="large"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
        />
      </el-form-item>
      <el-form-item label="关联角色" prop="roles" :rules="[{required: true, message: '必须选择'}]">
        <el-select v-model="formData.roles" multiple style="width: 100%;">
          <el-option v-for="role in roles" :value="role.id" :label="role.name"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "Create",
  data(){
    return {
      visible: false,
      buttonLoading: false,
      action: 1, // 1：创建 2：编辑
      callback: null,
      roles:[],
      formData: {
        id: 0,
        mobile: '',
        email: '',
        passwd: '',
        name: '',
        status: 0,
        roles: []
      }
    }
  },
  computed: {
    title() {
      return this.action == 1 ? "创建账号":"编辑账号"
    },
    requestMethod() {
      return this.action == 1 ? "POST":"PATCH"
    },
    requestPath() {
      return this.action == 1 ? "/api/admin-users":"/api/admin-users/"+this.formData.id
    }
  },
  mounted() {

  },
  methods: {
    open(action, data, callback) {
      this.action = action
      this.visible = true
      this.callback = callback
      this.formData = JSON.parse(JSON.stringify(data)) || {
        id: 0,
        mobile: '',
        email: '',
        passwd: '',
        name: '',
        status: 0,
        roles: []
      }
      let role_ids = []
      for (const i in this.formData.roles) {
        role_ids.push(this.formData.roles[i].id)
      }
      this.formData.roles = role_ids
      this.$fly.get("/api/roles/option").then((res)=>{
        this.roles = res.data
      }).catch((err)=>{})
      this.$refs["user-create-form"]?.resetFields()
    },
    close(){
      this.visible = false
      if (this.callback){
        this.callback()
      }
    },
    async save() {
      const valid = await this.$refs["user-create-form"].validate((valid)=>{})
      if (!valid) {
        return
      }
      this.buttonLoading = true
      const res = await this.$fly.request(
          this.requestPath,
          this.formData,
          {
            method: this.requestMethod
          }
      ).catch((err)=>{
        console.log('err', err)
        return
      })
      if (res && res.code===0){
        ElMessage.success('保存成功')
        this.close()
      }
      this.buttonLoading = false
    }
  }
}
</script>

<style scoped>

</style>