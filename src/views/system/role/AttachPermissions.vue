<template>
  <el-dialog v-model="visible" :title="title" top="150px" width="40%" @closed="visible = false" :close-on-click-modal="false">
    <el-form ref="role-permission-form" :model="role" label-width="100px" label-position="left">
      <el-form-item label="角色名称">
        {{ role.name }}({{ role.flag }})
      </el-form-item>
      <el-form-item label="关联权限" prop="name" :rules="[{required: true, message: '必须输入'}]">
        <div style="width: 100%;height: 600px">
          <el-tree-v2 :data="permissions" :props="props" show-checkbox :height="600" ref="permission-tree"
                :default-checked-keys="role.permission_ids" :check-on-click-node="true" :check-strictly="true" />
        </div>
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
  name: "AttachPermissions",
  data(){
    return {
      visible: false,
      buttonLoading: false,
      action: 1, // 1：创建 2：编辑
      callback: null,
      permissions:[],
      props:{
        value: 'id',
        label: 'name',
        children: 'children',
      },
      role: {
        id: 0,
        name: '',
        permission_ids: []
      }
    }
  },
  computed: {
    title() {
      return "关联权限"
    }
  },
  mounted() {

  },
  methods: {
    open(id, callback) {
      this.visible = true
      this.callback = callback
      this.$fly.get("/api/permissions/option").then((res)=>{
        this.permissions = res.data
      }).catch((err)=>{})
      this.$fly.get("/api/roles/"+id).then((res)=>{
        this.role = res.data
      }).catch((err)=>{})
      this.$refs["role-permission-form"]?.resetFields()
    },
    close(){
      this.visible = false
      if (this.callback){
        this.callback()
      }
    },
    async save() {
      const permission_ids = this.$refs["permission-tree"].getCheckedKeys()
      console.log('permission_ids',permission_ids)
      this.buttonLoading = true
      const res = await this.$fly.patch("/api/roles/"+this.role.id+"/permissions",
          {
            permission_ids: permission_ids
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