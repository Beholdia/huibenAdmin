// vite.config.ts
import vue from "file:///D:/project/huibenAdmin/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
import { defineConfig, loadEnv } from "file:///D:/project/huibenAdmin/node_modules/vite/dist/node/index.js";
import viteCompression from "file:///D:/project/huibenAdmin/node_modules/vite-plugin-compression/dist/index.mjs";

// src/utils/build.ts
import importToCDN from "file:///D:/project/huibenAdmin/node_modules/vite-plugin-cdn-import/dist/index.js";
var buildConfig = {
  cdn() {
    return importToCDN({
      prodUrl: "https://unpkg.com/{name}@{version}/{path}",
      modules: [
        // autoComplete('vue'),
        // autoComplete('axios'),
        {
          name: "vue",
          var: "Vue",
          path: "dist/vue.global.js"
        },
        {
          name: "vue-demi",
          var: "VueDemi",
          path: "lib/index.iife.js"
        },
        {
          name: "vue-router",
          var: "VueRouter",
          path: "dist/vue-router.global.js"
        },
        {
          name: "element-plus",
          var: "ElementPlus",
          path: "dist/index.full.js"
        }
        // {
        // 	name: '@element-plus/icons-vue',
        // 	var: 'ElementPlusIconsVue',
        // 	path: 'dist/index.iife.min.js',
        // },
        // {
        // 	name: 'echarts',
        // 	var: 'echarts',
        // 	path: 'dist/echarts.min.js',
        // },
        // {
        // 	name: 'echarts-gl',
        // 	var: 'echarts-gl',
        // 	path: 'dist/echarts-gl.min.js',
        // },
        // {
        // 	name: 'echarts-wordcloud',
        // 	var: 'echarts-wordcloud',
        // 	path: 'dist/echarts-wordcloud.min.js',
        // },
        // {
        // 	name: 'vue-i18n',
        // 	var: 'VueI18n',
        // 	path: 'dist/vue-i18n.global.min.js',
        // },
        // {
        // 	name: 'jsplumb',
        // 	var: 'jsPlumb',
        // 	path: 'dist/js/jsplumb.min.js',
        // },
        // {
        // 	name: 'cropperjs',
        // 	var: 'Cropper',
        // 	path: 'dist/cropper.min.js',
        // },
        // {
        // 	name: 'sortablejs',
        // 	var: 'Sortable',
        // 	path: 'Sortable.min.js',
        // },
        // {
        // 	name: 'qrcodejs2-fixes',
        // 	var: 'QRCode',
        // 	path: 'qrcode.min.js',
        // },
        // {
        // 	name: 'print-js',
        // 	var: 'printJS',
        // 	path: 'dist/print.min.js',
        // },
        // {
        // 	name: '@wangeditor/editor',
        // 	var: 'wangEditor',
        // 	path: 'dist/index.min.js',
        // },
        // {
        // 	name: '@wangeditor/editor-for-vue',
        // 	var: 'WangEditorForVue',
        // 	path: 'dist/index.min.js',
        // },
        // {
        // 	name: 'vue-grid-layout',
        // 	var: 'VueGridLayout',
        // 	path: 'https://cdn.jsdelivr.net/npm/vue-grid-layout@3.0.0-beta1/dist/vue-grid-layout.umd.min.js',
        // },
      ]
    });
  },
  external: [
    "vue",
    // 'axios',
    "vue-router",
    "element-plus"
    // '@element-plus/icons-vue',
    // 'echarts',
    // 'echarts-gl',
    // 'echarts-wordcloud',
    // 'vue-i18n',
    // 'jsplumb',
    // 'cropperjs',
    // 'sortablejs',
    // 'qrcodejs2-fixes',
    // 'print-js',
    // '@wangeditor/editor',
    // '@wangeditor/editor-for-vue',
    // 'vue-grid-layout',
  ]
};

// vite.config.ts
import VueDevTools from "file:///D:/project/huibenAdmin/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import AutoImport from "file:///D:/project/huibenAdmin/node_modules/.store/unplugin-auto-import@0.15.3/node_modules/unplugin-auto-import/dist/vite.js";
import { ElementPlusResolver } from "file:///D:/project/huibenAdmin/node_modules/.store/unplugin-vue-components@0.24.1/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import IconsResolver from "file:///D:/project/huibenAdmin/node_modules/.store/unplugin-icons@0.16.6/node_modules/unplugin-icons/dist/resolver.mjs";
var __vite_injected_original_dirname = "D:\\project\\huibenAdmin";
var pathResolve = (dir) => {
  return resolve(__vite_injected_original_dirname, ".", dir);
};
var alias = {
  "/@": pathResolve("./src/"),
  "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
};
var viteConfig = defineConfig((mode) => {
  const env = loadEnv(mode.mode, process.cwd());
  return {
    plugins: [
      vue(),
      viteCompression({ disable: true }),
      VueDevTools(),
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ["vue"],
        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        resolvers: [
          ElementPlusResolver(),
          // 自动导入图标组件
          IconsResolver({
            prefix: "Icon"
          })
        ]
      })
    ],
    root: process.cwd(),
    resolve: { alias },
    base: mode.command === "serve" ? "./" : env.VITE_PUBLIC_PATH,
    optimizeDeps: { exclude: ["vue-demi"] },
    server: {
      host: "0.0.0.0",
      port: env.VITE_PORT,
      open: JSON.parse(env.VITE_OPEN),
      hmr: true,
      proxy: {
        "/gitee": {
          target: "https://gitee.com",
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/gitee/, "")
        }
      }
    },
    build: {
      outDir: "dist",
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id.toString().match(/\/node_modules\/(?!.pnpm)(?<moduleName>[^\/]*)\//)?.groups.moduleName ?? "vender";
            }
          }
        },
        ...JSON.parse(env.VITE_OPEN_CDN) ? { external: buildConfig.external } : {}
      }
    },
    css: { preprocessorOptions: { css: { charset: false } } },
    define: {
      __VUE_I18N_LEGACY_API__: JSON.stringify(false),
      __VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
      __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
      __NEXT_VERSION__: JSON.stringify(process.env.npm_package_version),
      __NEXT_NAME__: JSON.stringify(process.env.npm_package_name)
    }
  };
});
var vite_config_default = viteConfig;
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL3V0aWxzL2J1aWxkLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxccHJvamVjdFxcXFxodWliZW5BZG1pblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxccHJvamVjdFxcXFxodWliZW5BZG1pblxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovcHJvamVjdC9odWliZW5BZG1pbi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYsIENvbmZpZ0VudiB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJztcclxuaW1wb3J0IHsgYnVpbGRDb25maWcgfSBmcm9tICcuL3NyYy91dGlscy9idWlsZCc7XHJcbmltcG9ydCBWdWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnO1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJztcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XHJcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnO1xyXG5pbXBvcnQgSWNvbnMgZnJvbSAndW5wbHVnaW4taWNvbnMvdml0ZSc7XHJcbmltcG9ydCBJY29uc1Jlc29sdmVyIGZyb20gJ3VucGx1Z2luLWljb25zL3Jlc29sdmVyJztcclxuXHJcbmNvbnN0IHBhdGhSZXNvbHZlID0gKGRpcjogc3RyaW5nKSA9PiB7XHJcblx0cmV0dXJuIHJlc29sdmUoX19kaXJuYW1lLCAnLicsIGRpcik7XHJcbn07XHJcblxyXG5jb25zdCBhbGlhczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcclxuXHQnL0AnOiBwYXRoUmVzb2x2ZSgnLi9zcmMvJyksXHJcblx0J3Z1ZS1pMThuJzogJ3Z1ZS1pMThuL2Rpc3QvdnVlLWkxOG4uY2pzLmpzJyxcclxufTtcclxuXHJcbmNvbnN0IHZpdGVDb25maWcgPSBkZWZpbmVDb25maWcoKG1vZGU6IENvbmZpZ0VudikgPT4ge1xyXG5cdGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZS5tb2RlLCBwcm9jZXNzLmN3ZCgpKTtcclxuXHRyZXR1cm4ge1xyXG5cdFx0cGx1Z2luczogW3Z1ZSgpLFxyXG5cdFx0XHQgdml0ZUNvbXByZXNzaW9uKHtkaXNhYmxlOnRydWV9KSxcclxuXHRcdFx0IFZ1ZURldlRvb2xzKCksXHJcblx0XHRcdCBcclxuXHJcblx0XHRcdEF1dG9JbXBvcnQoe1xyXG5cdFx0XHQgIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBWdWUgXHU3NkY4XHU1MTczXHU1MUZEXHU2NTcwXHVGRjBDXHU1OTgyXHVGRjFBcmVmLCByZWFjdGl2ZSwgdG9SZWYgXHU3QjQ5XHJcblx0XHRcdCAgaW1wb3J0czogWyd2dWUnXSxcclxuXHRcdFx0ICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgRWxlbWVudCBQbHVzIFx1NzZGOFx1NTE3M1x1NTFGRFx1NjU3MFx1RkYwQ1x1NTk4Mlx1RkYxQUVsTWVzc2FnZSwgRWxNZXNzYWdlQm94Li4uIChcdTVFMjZcdTY4MzdcdTVGMEYpXHJcblx0XHRcdCAgcmVzb2x2ZXJzOiBbXHJcblx0XHRcdFx0RWxlbWVudFBsdXNSZXNvbHZlcigpLFxyXG5cdFx0XHRcdC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVx1NTZGRVx1NjgwN1x1N0VDNFx1NEVGNlxyXG5cdFx0XHRcdEljb25zUmVzb2x2ZXIoe1xyXG5cdFx0XHRcdCAgcHJlZml4OiAnSWNvbicsXHJcblx0XHRcdFx0fSksXHJcblx0XHRcdCAgXSxcclxuXHRcdFx0fSksXHJcblxyXG5cdFx0XHRdLFxyXG5cdFx0cm9vdDogcHJvY2Vzcy5jd2QoKSxcclxuXHRcdHJlc29sdmU6IHsgYWxpYXMgfSxcclxuXHRcdGJhc2U6IG1vZGUuY29tbWFuZCA9PT0gJ3NlcnZlJyA/ICcuLycgOiBlbnYuVklURV9QVUJMSUNfUEFUSCxcclxuXHRcdG9wdGltaXplRGVwczogeyBleGNsdWRlOiBbJ3Z1ZS1kZW1pJ10gfSxcclxuXHRcdHNlcnZlcjoge1xyXG5cdFx0XHRob3N0OiAnMC4wLjAuMCcsXHJcblx0XHRcdHBvcnQ6IGVudi5WSVRFX1BPUlQgYXMgdW5rbm93biBhcyBudW1iZXIsXHJcblx0XHRcdG9wZW46IEpTT04ucGFyc2UoZW52LlZJVEVfT1BFTiksXHJcblx0XHRcdGhtcjogdHJ1ZSxcclxuXHRcdFx0cHJveHk6IHtcclxuXHRcdFx0XHQnL2dpdGVlJzoge1xyXG5cdFx0XHRcdFx0dGFyZ2V0OiAnaHR0cHM6Ly9naXRlZS5jb20nLFxyXG5cdFx0XHRcdFx0d3M6IHRydWUsXHJcblx0XHRcdFx0XHRjaGFuZ2VPcmlnaW46IHRydWUsXHJcblx0XHRcdFx0XHRyZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvZ2l0ZWUvLCAnJyksXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0fSxcclxuXHRcdH0sXHJcblx0XHRidWlsZDoge1xyXG5cdFx0XHRvdXREaXI6ICdkaXN0JyxcclxuXHRcdFx0Y2h1bmtTaXplV2FybmluZ0xpbWl0OiAxNTAwLFxyXG5cdFx0XHRyb2xsdXBPcHRpb25zOiB7XHJcblx0XHRcdFx0b3V0cHV0OiB7XHJcblx0XHRcdFx0XHRjaHVua0ZpbGVOYW1lczogJ2Fzc2V0cy9qcy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuXHRcdFx0XHRcdGVudHJ5RmlsZU5hbWVzOiAnYXNzZXRzL2pzL1tuYW1lXS1baGFzaF0uanMnLFxyXG5cdFx0XHRcdFx0YXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW2V4dF0vW25hbWVdLVtoYXNoXS5bZXh0XScsXHJcblx0XHRcdFx0XHRtYW51YWxDaHVua3MoaWQpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBpZC50b1N0cmluZygpLm1hdGNoKC9cXC9ub2RlX21vZHVsZXNcXC8oPyEucG5wbSkoPzxtb2R1bGVOYW1lPlteXFwvXSopXFwvLyk/Lmdyb3VwcyEubW9kdWxlTmFtZSA/PyAndmVuZGVyJztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdC4uLihKU09OLnBhcnNlKGVudi5WSVRFX09QRU5fQ0ROKSA/IHsgZXh0ZXJuYWw6IGJ1aWxkQ29uZmlnLmV4dGVybmFsIH0gOiB7fSksXHJcblx0XHRcdH0sXHJcblx0XHR9LFxyXG5cdFx0Y3NzOiB7IHByZXByb2Nlc3Nvck9wdGlvbnM6IHsgY3NzOiB7IGNoYXJzZXQ6IGZhbHNlIH0gfSB9LFxyXG5cdFx0ZGVmaW5lOiB7XHJcblx0XHRcdF9fVlVFX0kxOE5fTEVHQUNZX0FQSV9fOiBKU09OLnN0cmluZ2lmeShmYWxzZSksXHJcblx0XHRcdF9fVlVFX0kxOE5fRlVMTF9JTlNUQUxMX186IEpTT04uc3RyaW5naWZ5KGZhbHNlKSxcclxuXHRcdFx0X19JTlRMSUZZX1BST0RfREVWVE9PTFNfXzogSlNPTi5zdHJpbmdpZnkoZmFsc2UpLFxyXG5cdFx0XHRfX05FWFRfVkVSU0lPTl9fOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5ucG1fcGFja2FnZV92ZXJzaW9uKSxcclxuXHRcdFx0X19ORVhUX05BTUVfXzogSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYubnBtX3BhY2thZ2VfbmFtZSksXHJcblx0XHR9LFxyXG5cdH07XHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCB2aXRlQ29uZmlnO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXHByb2plY3RcXFxcaHVpYmVuQWRtaW5cXFxcc3JjXFxcXHV0aWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxwcm9qZWN0XFxcXGh1aWJlbkFkbWluXFxcXHNyY1xcXFx1dGlsc1xcXFxidWlsZC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovcHJvamVjdC9odWliZW5BZG1pbi9zcmMvdXRpbHMvYnVpbGQudHNcIjtpbXBvcnQgaW1wb3J0VG9DRE4gZnJvbSAndml0ZS1wbHVnaW4tY2RuLWltcG9ydCc7XHJcblxyXG4vKipcclxuICogXHU2MjUzXHU1MzA1XHU3NkY4XHU1MTczXHJcbiAqIFx1NkNFOFx1NjEwRiBwcm9kVXJsXHVGRjFBXHU0RjdGXHU3NTI4XHU3Njg0XHU2NjJGIGpzZGVsaXZyIFx1OEZEOFx1NjYyRiB1bnBrZ1x1MzAwMlx1NUI4M1x1NEVFQ1x1NzY4NCBwYXRoIFx1NTNFRlx1ODBGRFx1NEUwRFx1NEUwMFx1ODFGNFxyXG4gKiBcdTY1ODdcdTdBRTBcdTk0RkVcdTYzQTVcdUZGMUFodHRwczovL2Jsb2cuY3Nkbi5uZXQvcXFfMzQ0NTA3NDEvYXJ0aWNsZS9kZXRhaWxzLzEyOTc2NjY3Nlx1RkYwQ1x1NEY3Rlx1NzUyOFx1NzY4NFx1NjYyRiBqc2RlbGl2clxyXG4gKiBAZGVzY3JpcHRpb24gaW1wb3J0VG9DRE4gaHR0cHM6Ly9naXRodWIuY29tL21tZi1mZS92aXRlLXBsdWdpbi1jZG4taW1wb3J0XHJcbiAqIEBkZXNjcmlwdGlvbiBjZG4gXHU1NzI4XHU3RUJGXHU1RjE1XHU1MTY1XHU3Njg0IGNkbiBcdTU3MzBcdTU3NDBcdTkxNERcdTdGNkVcdTMwMDJwYXRoXHVGRjFBaHR0cHM6Ly93d3cuanNkZWxpdnIuY29tLyB8fCBodHRwczovL3VucGtnLmNvbS9cclxuICogQGRlc2NyaXB0aW9uIGV4dGVybmFsIFx1NjI1M1x1NTMwNVx1NjVGNlx1RkYwQ1x1OEZDN1x1NkVFNFx1NTMwNVx1NUJGQ1x1NTE2NVx1MzAwMlx1NTNDMlx1ODAwM1x1RkYxQWh0dHBzOi8vcm9sbHVwanMub3JnL2NvbmZpZ3VyYXRpb24tb3B0aW9ucy8jZXh0ZXJuYWxcclxuICovXHJcbmV4cG9ydCBjb25zdCBidWlsZENvbmZpZyA9IHtcclxuICAgIGNkbigpIHtcclxuICAgICAgICByZXR1cm4gaW1wb3J0VG9DRE4oe1xyXG4gICAgICAgICAgICBwcm9kVXJsOiAnaHR0cHM6Ly91bnBrZy5jb20ve25hbWV9QHt2ZXJzaW9ufS97cGF0aH0nLFxyXG4gICAgICAgICAgICBtb2R1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICAvLyBhdXRvQ29tcGxldGUoJ3Z1ZScpLFxyXG4gICAgICAgICAgICAgICAgLy8gYXV0b0NvbXBsZXRlKCdheGlvcycpLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICd2dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhcjogJ1Z1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogJ2Rpc3QvdnVlLmdsb2JhbC5qcycsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICd2dWUtZGVtaScsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyOiAnVnVlRGVtaScsXHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogJ2xpYi9pbmRleC5paWZlLmpzJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3Z1ZS1yb3V0ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhcjogJ1Z1ZVJvdXRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogJ2Rpc3QvdnVlLXJvdXRlci5nbG9iYWwuanMnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnZWxlbWVudC1wbHVzJyxcclxuICAgICAgICAgICAgICAgICAgICB2YXI6ICdFbGVtZW50UGx1cycsXHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogJ2Rpc3QvaW5kZXguZnVsbC5qcycsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLy8ge1xyXG4gICAgICAgICAgICAgICAgLy8gXHRuYW1lOiAnQGVsZW1lbnQtcGx1cy9pY29ucy12dWUnLFxyXG4gICAgICAgICAgICAgICAgLy8gXHR2YXI6ICdFbGVtZW50UGx1c0ljb25zVnVlJyxcclxuICAgICAgICAgICAgICAgIC8vIFx0cGF0aDogJ2Rpc3QvaW5kZXguaWlmZS5taW4uanMnLFxyXG4gICAgICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgICAgIC8vIHtcclxuICAgICAgICAgICAgICAgIC8vIFx0bmFtZTogJ2VjaGFydHMnLFxyXG4gICAgICAgICAgICAgICAgLy8gXHR2YXI6ICdlY2hhcnRzJyxcclxuICAgICAgICAgICAgICAgIC8vIFx0cGF0aDogJ2Rpc3QvZWNoYXJ0cy5taW4uanMnLFxyXG4gICAgICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgICAgIC8vIHtcclxuICAgICAgICAgICAgICAgIC8vIFx0bmFtZTogJ2VjaGFydHMtZ2wnLFxyXG4gICAgICAgICAgICAgICAgLy8gXHR2YXI6ICdlY2hhcnRzLWdsJyxcclxuICAgICAgICAgICAgICAgIC8vIFx0cGF0aDogJ2Rpc3QvZWNoYXJ0cy1nbC5taW4uanMnLFxyXG4gICAgICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgICAgIC8vIHtcclxuICAgICAgICAgICAgICAgIC8vIFx0bmFtZTogJ2VjaGFydHMtd29yZGNsb3VkJyxcclxuICAgICAgICAgICAgICAgIC8vIFx0dmFyOiAnZWNoYXJ0cy13b3JkY2xvdWQnLFxyXG4gICAgICAgICAgICAgICAgLy8gXHRwYXRoOiAnZGlzdC9lY2hhcnRzLXdvcmRjbG91ZC5taW4uanMnLFxyXG4gICAgICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgICAgIC8vIHtcclxuICAgICAgICAgICAgICAgIC8vIFx0bmFtZTogJ3Z1ZS1pMThuJyxcclxuICAgICAgICAgICAgICAgIC8vIFx0dmFyOiAnVnVlSTE4bicsXHJcbiAgICAgICAgICAgICAgICAvLyBcdHBhdGg6ICdkaXN0L3Z1ZS1pMThuLmdsb2JhbC5taW4uanMnLFxyXG4gICAgICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgICAgIC8vIHtcclxuICAgICAgICAgICAgICAgIC8vIFx0bmFtZTogJ2pzcGx1bWInLFxyXG4gICAgICAgICAgICAgICAgLy8gXHR2YXI6ICdqc1BsdW1iJyxcclxuICAgICAgICAgICAgICAgIC8vIFx0cGF0aDogJ2Rpc3QvanMvanNwbHVtYi5taW4uanMnLFxyXG4gICAgICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgICAgIC8vIHtcclxuICAgICAgICAgICAgICAgIC8vIFx0bmFtZTogJ2Nyb3BwZXJqcycsXHJcbiAgICAgICAgICAgICAgICAvLyBcdHZhcjogJ0Nyb3BwZXInLFxyXG4gICAgICAgICAgICAgICAgLy8gXHRwYXRoOiAnZGlzdC9jcm9wcGVyLm1pbi5qcycsXHJcbiAgICAgICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICAgICAgLy8ge1xyXG4gICAgICAgICAgICAgICAgLy8gXHRuYW1lOiAnc29ydGFibGVqcycsXHJcbiAgICAgICAgICAgICAgICAvLyBcdHZhcjogJ1NvcnRhYmxlJyxcclxuICAgICAgICAgICAgICAgIC8vIFx0cGF0aDogJ1NvcnRhYmxlLm1pbi5qcycsXHJcbiAgICAgICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICAgICAgLy8ge1xyXG4gICAgICAgICAgICAgICAgLy8gXHRuYW1lOiAncXJjb2RlanMyLWZpeGVzJyxcclxuICAgICAgICAgICAgICAgIC8vIFx0dmFyOiAnUVJDb2RlJyxcclxuICAgICAgICAgICAgICAgIC8vIFx0cGF0aDogJ3FyY29kZS5taW4uanMnLFxyXG4gICAgICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgICAgIC8vIHtcclxuICAgICAgICAgICAgICAgIC8vIFx0bmFtZTogJ3ByaW50LWpzJyxcclxuICAgICAgICAgICAgICAgIC8vIFx0dmFyOiAncHJpbnRKUycsXHJcbiAgICAgICAgICAgICAgICAvLyBcdHBhdGg6ICdkaXN0L3ByaW50Lm1pbi5qcycsXHJcbiAgICAgICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICAgICAgLy8ge1xyXG4gICAgICAgICAgICAgICAgLy8gXHRuYW1lOiAnQHdhbmdlZGl0b3IvZWRpdG9yJyxcclxuICAgICAgICAgICAgICAgIC8vIFx0dmFyOiAnd2FuZ0VkaXRvcicsXHJcbiAgICAgICAgICAgICAgICAvLyBcdHBhdGg6ICdkaXN0L2luZGV4Lm1pbi5qcycsXHJcbiAgICAgICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICAgICAgLy8ge1xyXG4gICAgICAgICAgICAgICAgLy8gXHRuYW1lOiAnQHdhbmdlZGl0b3IvZWRpdG9yLWZvci12dWUnLFxyXG4gICAgICAgICAgICAgICAgLy8gXHR2YXI6ICdXYW5nRWRpdG9yRm9yVnVlJyxcclxuICAgICAgICAgICAgICAgIC8vIFx0cGF0aDogJ2Rpc3QvaW5kZXgubWluLmpzJyxcclxuICAgICAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgICAgICAvLyB7XHJcbiAgICAgICAgICAgICAgICAvLyBcdG5hbWU6ICd2dWUtZ3JpZC1sYXlvdXQnLFxyXG4gICAgICAgICAgICAgICAgLy8gXHR2YXI6ICdWdWVHcmlkTGF5b3V0JyxcclxuICAgICAgICAgICAgICAgIC8vIFx0cGF0aDogJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vdnVlLWdyaWQtbGF5b3V0QDMuMC4wLWJldGExL2Rpc3QvdnVlLWdyaWQtbGF5b3V0LnVtZC5taW4uanMnLFxyXG4gICAgICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBleHRlcm5hbDogW1xyXG4gICAgICAgICd2dWUnLFxyXG4gICAgICAgIC8vICdheGlvcycsXHJcbiAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxyXG4gICAgICAgICdlbGVtZW50LXBsdXMnLFxyXG4gICAgICAgIC8vICdAZWxlbWVudC1wbHVzL2ljb25zLXZ1ZScsXHJcbiAgICAgICAgLy8gJ2VjaGFydHMnLFxyXG4gICAgICAgIC8vICdlY2hhcnRzLWdsJyxcclxuICAgICAgICAvLyAnZWNoYXJ0cy13b3JkY2xvdWQnLFxyXG4gICAgICAgIC8vICd2dWUtaTE4bicsXHJcbiAgICAgICAgLy8gJ2pzcGx1bWInLFxyXG4gICAgICAgIC8vICdjcm9wcGVyanMnLFxyXG4gICAgICAgIC8vICdzb3J0YWJsZWpzJyxcclxuICAgICAgICAvLyAncXJjb2RlanMyLWZpeGVzJyxcclxuICAgICAgICAvLyAncHJpbnQtanMnLFxyXG4gICAgICAgIC8vICdAd2FuZ2VkaXRvci9lZGl0b3InLFxyXG4gICAgICAgIC8vICdAd2FuZ2VkaXRvci9lZGl0b3ItZm9yLXZ1ZScsXHJcbiAgICAgICAgLy8gJ3Z1ZS1ncmlkLWxheW91dCcsXHJcbiAgICBdLFxyXG59O1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBQLE9BQU8sU0FBUztBQUMxUSxTQUFTLGVBQWU7QUFDeEIsU0FBUyxjQUFjLGVBQTBCO0FBQ2pELE9BQU8scUJBQXFCOzs7QUNIb1AsT0FBTyxpQkFBaUI7QUFValMsSUFBTSxjQUFjO0FBQUEsRUFDdkIs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
