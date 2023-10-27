<template>
  <el-dialog v-model="visible" :title="title" top="150px" width="40%" @closed="visible = false" :close-on-click-modal="false">
    <el-form ref="permissions-create-form" :model="formData" label-width="100px" label-position="left">
      <el-form-item label="权限标识" prop="flag" :rules="[{required: true, message: '必须输入'}]">
        <el-input v-model="formData.flag" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="权限名称" prop="name" :rules="[{required: true, message: '必须输入'}]">
        <el-input v-model="formData.name" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="权限说明" prop="desc">
        <el-input v-model="formData.desc" maxlength="128"></el-input>
      </el-form-item>
      <el-form-item label="权限类型" prop="type"  :rules="[{required: true, message: '必须选择'}]">
        <el-select v-model="formData.type">
          <el-option :value="10" label="页面权限"></el-option>
          <el-option :value="20" label="操作权限"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.type==20" label="父级权限" prop="parent_id" :rules="[{required: true, message: '必须选择'}]">
        <el-select v-model="formData.parent_id">
          <el-option v-for="item in parentOptions" :value="item.id" :label="item.name"></el-option>
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
      parentOptions:[],
      formData: {
        id: 0,
        parent_id: '',
        flag: '',
        name: '',
        desc: '',
        type: 10
      }
    }
  },
  computed: {
    title() {
      return this.action == 1 ? "创建权限":"编辑权限"
    },
    requestMethod() {
      return this.action == 1 ? "POST":"PATCH"
    },
    requestPath() {
      return this.action == 1 ? "/api/permissions":"/api/permissions/"+this.formData.id
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
        parent_id: '',
        flag: '',
        name: '',
        desc: '',
        type: 10
      }
      this.$fly.get("/api/permissions/parent").then((res)=>{
        this.parentOptions = res.data.data
      }).catch((err)=>{})
      this.$refs["permissions-create-form"]?.resetFields()
    },
    close(){
      this.visible = false
      if (this.callback){
        this.callback()
      }
    },
    async save() {
      const valid = await this.$refs["permissions-create-form"].validate((valid)=>{})
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