<template>
  <div class="permission">
    <el-form inline @submit.native.prevent="doSearch">
      <el-form-item label="账号">
        <el-input v-model="searchForm.flag" placeholder="输入权限标识查询"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="searchForm.name" placeholder="输入权限名称查询"></el-input>
      </el-form-item>
      <el-form-item label="权限类型">
        <el-select v-model="searchForm.type">
          <el-option :value="0" label="全部"></el-option>
          <el-option :value="10" label="页面权限"></el-option>
          <el-option :value="20" label="操作权限"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit"><el-icon class="el-icon--left"><icon-ep-search /></el-icon>查询</el-button>
        <el-button @click="reset"><el-icon class="el-icon--left"><icon-ep-refresh /></el-icon>重置</el-button>
        <el-button type="primary" @click="openCreateDialog(1, null)"><el-icon class="el-icon--left"><icon-ep-plus /></el-icon>创建</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="res.data" border class="data-table" v-loading="dataLoading">
      <el-table-column prop="flag" label="权限标识" width="300"/>
      <el-table-column prop="name" label="权限名称" width="300"/>
      <el-table-column prop="desc" label="权限说明"/>
      <el-table-column prop="type_text" label="权限类型" width="120"  align="center"/>
      <el-table-column prop="created_at" label="创建时间" width="220"  align="center"/>
      <el-table-column label="操作" width="160" align="center">
        <template #default="scope">
          <el-button size="small" @click="openCreateDialog(2, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deletePermission(scope.row.id, scope.row.name)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background
                     :current-page="res.meta.page_index"
                     :page-size="res.meta.page_size"
                     :page-count="res.meta.page_count"
                     :total="res.meta.total"
                     :page-sizes="[10, 15, 20, 30, 50]"
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
      />
    </div>

    <Create ref="permission-create"></Create>
  </div>
</template>
<script>
import Create from "./Create.vue"
export default {
  name: "Permission",
  components:{
    Create
  },
  data() {
    return {
      dataLoading: false,
      searchForm:{
        flag: '',
        name: '',
        type: 0,
        parent_id: -1,
        page_index: 1,
        page_size: 15,
      },
      res:{
        meta: {
          page_index: 1,
          page_size: 15,
          page_count: 1,
          total: 0
        },
        data: [],
      },
    }
  },
  created() {
    this.doSearch()
  },
  methods: {
    doSearch() {
      this.searchForm.page_index = 1
      this.getListData()
    },
    async getListData(){
      this.dataLoading = true
      const res = await this.$fly.get("/api/permissions", this.searchForm).catch((err)=>{})
      this.res.meta = res.data.meta
      this.res.data = res.data.data
      this.dataLoading = false
    },
    reset(){
      this.searchForm = {
        flag: '',
        name: '',
        type: 0,
        parent_id: -1,
        page_index: 1,
        page_size: 15,
      }
      this.getListData()
    },
    handleSizeChange(number){
      this.searchForm.page_size = number
      this.getListData()
    },
    handleCurrentChange(number){
      this.searchForm.page_index = number
      this.getListData()
    },
    openCreateDialog(action, data){
      this.$refs["permission-create"].open(action, data, this.getListData)
    },
    async deletePermission(id, name) {
      const confirm = await ElMessageBox.confirm(
          '确定删除权限【'+name+'】？',
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
      const res = await this.$fly.delete("/api/permissions/"+id).catch((err)=>{})
      if (res && res.code===0){
        ElMessage.success('删除成功')
        await this.getListData()
      }
    }
  }
}
</script>
<style scoped>

</style>