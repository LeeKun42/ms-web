import * as Fly  from 'flyio/dist/npm/fly'
import Storage from "@/lib/utils/storage.js"
import config from "@/config/config.js"
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import constants from "@/config/constants.js"
import router from "@/router/router.js";
import storage from "@/lib/utils/storage.js";

const fly = new Fly()

const headers = {
    'X-Tag': config.APP_NAME,
    'Accept': 'application/json',
    'ContentType': 'application/json',
}

fly.config.baseURL = config.API_HOST
fly.config.headers = headers

// 请求拦截器
fly.interceptors.request.use(async (request) =>{
    const userToken = Storage.get(constants.TOKEN_KEY)
    request.headers['Authorization'] = 'Bearer ' + userToken
    return request
})

// 响应拦截器
fly.interceptors.response.use(
    (response) =>{
        let data = response.data
        if ( data.code === 0 ){//请求成功
            return data
        }else if ( data.code === 401 ){//登录失效
            Storage.remove(constants.TOKEN_KEY)
            router.replace("/login")
        }else{//请求出错
            ElMessage.error(response.data.message)
            return Promise.reject(response.data.message)
        }
    },
    (error) => {
        //console.error('request error end', error)
        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
        if (error.status===401){
            Storage.remove(constants.TOKEN_KEY)
            router.replace("/login")
        }else if (error.status===403){//权限不足
            router.replace("/")
        }else{
            ElMessage.error(error.message)
            return Promise.reject(error.message)
        }
    }
)

export default fly