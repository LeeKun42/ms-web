<template>
  <el-dialog v-model="visible" :title="title" top="150px" width="40%" @closed="visible = false" :close-on-click-modal="false">
    <el-form ref="role-create-form" :model="formData" label-width="100px" label-position="left">
      <el-form-item label="角色标识" prop="flag" :rules="[{required: true, message: '必须输入'}]">
        <el-input v-model="formData.flag" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="name" :rules="[{required: true, message: '必须输入'}]">
        <el-input v-model="formData.name" maxlength="64"></el-input>
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
      formData: {
        id: 0,
        flag: '',
        name: ''
      }
    }
  },
  computed: {
    title() {
      return this.action == 1 ? "创建角色":"编辑角色"
    },
    requestMethod() {
      return this.action == 1 ? "POST":"PATCH"
    },
    requestPath() {
      return this.action == 1 ? "/api/roles":"/api/roles/"+this.formData.id
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
        flag: '',
        name: ''
      }
      this.$refs["role-create-form"]?.resetFields()
    },
    close(){
      this.visible = false
      if (this.callback){
        this.callback()
      }
    },
    async save() {
      const valid = await this.$refs["role-create-form"].validate((valid)=>{})
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
      this.buttonLoading = false
      if (res && res.code===0){
        ElMessage.success('保存成功')
        this.close()
      }
    }
  }
}
</script>

<style scoped>

</style>