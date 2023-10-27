<template>
<div class="admin-user">
  <el-form inline @submit.native.prevent="doSearch">
    <el-form-item label="账号">
      <el-input v-model="searchForm.account" placeholder="输入账号查询"></el-input>
    </el-form-item>
    <el-form-item label="姓名">
      <el-input v-model="searchForm.name" placeholder="输入姓名查询"></el-input>
    </el-form-item>
    <el-form-item label="角色">
      <el-select v-model="searchForm.role_id">
        <el-option :value="0" label="全部"></el-option>
        <el-option v-for="role in roles" :value="role.id" :label="role.name"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="账号状态">
      <el-select v-model="searchForm.status">
        <el-option :value="-1" label="全部"></el-option>
        <el-option :value="0" label="禁用"></el-option>
        <el-option :value="1" label="正常"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit"><el-icon class="el-icon--left"><icon-ep-search /></el-icon>查询</el-button>
      <el-button @click="reset"><el-icon class="el-icon--left"><icon-ep-refresh /></el-icon>重置</el-button>
      <el-button type="primary" @click="openCreateDialog(1, null)" v-permission:flag="'system-user-create'"><el-icon class="el-icon--left"><icon-ep-plus  /></el-icon>创建</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="res.data" border class="data-table" v-loading="dataLoading">
    <el-table-column prop="mobile" label="手机号码" width="180" />
    <el-table-column prop="email" label="邮箱" width="180" />
    <el-table-column prop="name" label="姓名" />
    <el-table-column label="角色">
      <template #default="scope">
        <template v-for="(role, index) in scope.row.roles">
          <template v-if="index>0">、</template>
          {{role.name}}
        </template>
      </template>
    </el-table-column>
    <el-table-column prop="status_text" label="状态" width="100"  align="center"/>
    <el-table-column prop="created_at" label="创建时间" width="220"  align="center"/>
    <el-table-column label="操作" width="160" align="center">
      <template #default="scope">
        <el-button size="small" @click="openCreateDialog(2, scope.row)">编辑</el-button>
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
  <Create ref="user-create"></Create>
</div>
</template>
<script>
import Create from './Create.vue'
export default {
  name: "AdminUser",
  components:{
    Create
  },
  data(){
    return {
      dataLoading: false,
      roles: [],
      searchForm:{
        account: '',
        name: '',
        status: -1,
        role_id: 0,
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
      }
    }
  },
  created() {
    this.$fly.get("/api/roles/option").then((res)=>{
      this.roles = res.data
    }).catch((err)=>{})
    this.doSearch()
  },
  methods: {
    doSearch() {
      this.searchForm.page_index = 1
      this.getListData()
    },
    async getListData(){
      this.dataLoading = true
      const res = await this.$fly.get("/api/admin-users", this.searchForm).catch((err)=>{})
      this.res.meta = res.data.meta
      this.res.data = res.data.data
      this.dataLoading = false
    },
    reset(){
      this.searchForm = {
        account: '',
        name: '',
        status: -1,
        role_id: 0,
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
      this.$refs["user-create"].open(action, data, this.getListData)
    }
  }
}
</script>
<style lang="scss" scoped>
.admin-user{

}
</style>