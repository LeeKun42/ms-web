import { defineStore } from 'pinia'
import fly from '@/lib/flyio.js'
import Storage from "@/lib/utils/storage.js";
import constants from "@/config/constants.js";
import router from "@/router/router.js";
import {ElMessage} from "element-plus";

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            mobile: '',
            avatar: '',
            email: '',
            name: '', //用户姓名
            permissions: [], //用户所有权限
            roles: [],
        }
    },
    actions: {
        async loginSuccessHandler(token) {
            Storage.set(constants.TOKEN_KEY, token)
            ElMessage.success("登录成功")
            //跳转到管理后台首页
            router.replace("/")
        },
        async pull(forced){
            forced = forced || false
            // if (this.mobile!='' && !forced){
            //     return
            // }
            const res = await fly.get("/api/admin-users/0").catch((err)=>{
                console.log('err', err)
            })
            this.mobile = res.data.mobile
            this.email = res.data.email
            this.avatar = res.data.avatar
            this.name = res.data.name
            this.permissions = res.data.permissions
            this.roles = res.data.roles
        },
        hasPermission(permission){
            return this.permissions?.indexOf(permission)>=0
        }
    }
})