import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import styleImport, {VantResolve} from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
    base:"./",
    plugins: [vue(), styleImport({
        resolves: [VantResolve()],
    }),],
    server:{
        host:'0.0.0.0' ,//ip地址
        port: 8000, // 设置服务启动端口号
        open: true, // 设置服务启动时是否自动打开浏览器
    }


})
