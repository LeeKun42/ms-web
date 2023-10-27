<template>
  <el-container class="container">
    <el-aside width="260px">
      <el-menu class="app-menu"
               :router="true"
               text-color="#fff"
               active-text-color="#ffd04b"
               background-color="#545c64"
               :default-active="activeMenu"
      >
        <template v-for="menu in menus">
          <el-sub-menu :index="menu.path+''">
            <template #title>
              <span>{{ menu.title }}</span>
            </template>
            <template v-for="subMenu in menu.children">
              <el-menu-item :index="subMenu.path" :route="subMenu.path">
                {{subMenu.title}}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div></div>
        <div class="user-info">
          <el-dropdown @command="handlerCommand">
            <span class="el-dropdown-link">
              {{ user.name }}<el-icon class="el-icon--right"><icon-ep-arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="person">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import {routes} from "@/router/router.js";
import constants from "@/config/constants.js";
import Storage from "@/lib/utils/storage.js";
import {useUserStore} from "@/store/userStore.js";
export default {
  name: "Layout",
  data(){
    return {
      activeMenu:"",
      user: useUserStore(),
      menus:[]
    }
  },
  async created() {
    await this.user.pull(false)
    this.activeMenu = this.$route.path
    this.getMenus()
  },
  methods: {
    getMenus(){ //获取该用户可见菜单列表，固定为二级菜单
      this.menus = [];
      for (const i in routes) {
        const path = routes[i].path
        if (path == '/' || path == '/login'){
          continue
        }
        const menu = {
          path: path,
          title: routes[i].meta.title,
          icon: routes[i].meta.icon,
          children: []
        }
        if (routes[i].children && routes[i].children.length<=0){
          continue
        }
        for (const k in routes[i].children) {
          const childrenItem = routes[i].children[k]
          // 判断登录用户是否拥有该菜单的权限
          if (this.user.hasPermission(childrenItem.meta.permission)){
            const subMenu = {
              path: path+"/"+childrenItem.path,
              title: childrenItem.meta.title,
              icon: childrenItem.meta.icon
            }
            menu.children.push(subMenu)
          }
        }
        if (menu.children.length>0){//有子菜单时，这个一级菜单才显示
          this.menus.push(menu)
        }
      }
    },
    handlerCommand(cmd){
      switch (cmd) {
        case 'person':
          this.$router.push({path:"/personal-center"})
          break
        case 'logout':
          this.$fly.delete("/api/admin-users/token").then((res)=>{
            Storage.remove(constants.TOKEN_KEY)
            this.$router.replace({path:"/login"})
          }).catch((err)=>{
            console.log('err', err)
          })
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.container{
  height: 100%;

  .app-menu{
    height: 100%;
  }

  .header{
    border-bottom: 1px solid #dcdfe6;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;

    .user-info{
      line-height: 40px;

      .el-dropdown-link {
        margin-top: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>