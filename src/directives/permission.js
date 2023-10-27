import {useUserStore} from "@/store/userStore.js";

export const permission = {
    mounted: (el, binding) => {
        const flag = binding.value
        console.log('permission binding', binding)
        const user = useUserStore()
        if (!user.hasPermission(flag)){//没有权限
            el.parentNode && el.parentNode.removeChild(el)
        }
    }
}