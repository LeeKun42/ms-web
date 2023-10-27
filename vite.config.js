import { defineConfig, loadEnv  } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import {fileURLToPath, URL} from "node:url";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

// https://vitejs.dev/config/
export default defineConfig(({command, mode})=>{
  const envPrefix = "APP_"
  const envDir = "env"
  console.log('vite env', command, mode, process.cwd())
  const config = loadEnv(mode,envDir, envPrefix)
  console.log('vite env load', config)
  return {
    envDir: envDir,
    envPrefix: envPrefix,
    plugins: [
      vue(),
      AutoImport({
        resolvers: [
          ElementPlusResolver({
            importStyle: "sass"
          })
        ],
      }),
      Components({
        resolvers: [
          IconsResolver({
            prefix: 'icon',
            enabledCollections: ['ep'],
          }),
          ElementPlusResolver({
            importStyle: "sass"
          }),
        ],
      }),
      Icons({
        autoInstall: true,
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~/': `${path.resolve(__dirname, 'src')}/`,
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/theme.scss" as *;`,
        }
      }
    },
    server: {
      port: 5173,
      host: "0.0.0.0"
    },
  }
})
