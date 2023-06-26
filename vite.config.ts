import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'  // 编辑器提示path模块找不到。下载 npm install @types/node --dev 就可

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    include: [/\.vue$/],
  })],
  resolve:{
    alias:{
      '@':resolve(__dirname,'src') // 配置别名：将 @ 指向'src'目录
    }
  },
  server:{
    host: '0.0.0.0', // 解决vite use--host to expose
    port: 5173, // 设置端口号
    open: false // 服务启动后自动打开浏览器
  },
})
