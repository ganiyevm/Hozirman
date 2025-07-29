// const { defineConfig } = require('@vue/cli-service')
// const path = require('path')

// module.exports = defineConfig({
//   transpileDependencies: true,

//   publicPath: process.env.NODE_ENV === 'production' ? '/Hozirman/' : '/',

//   devServer: {
//     port: 5500,
//     host: '127.0.0.1',
//     https: false, 
//     open: true,
//     allowedHosts: 'all',
//     client: {
//       overlay: {
//         warnings: false,
//         errors: true
//       }
//     },
//     proxy: {
//       '/api': {
//         target: 'http://217.30.170.22:7000',
//         changeOrigin: true
//       }
//     }
//   },

//   configureWebpack: {
//     resolve: {
//       alias: {
//         '@': path.resolve(__dirname, 'src')
//       }
//     }
//   },

//   chainWebpack: config => {
//     config.optimization.splitChunks({
//       chunks: 'all',
//       cacheGroups: {
//         vendor: {
//           name: 'vendor',
//           test: /[\\/]node_modules[\\/]/,
//           chunks: 'all',
//           priority: 10
//         }
//       }
//     })

//     config.plugin('html').tap(args => {
//       args[0].meta = {
//         viewport: 'width=device-width,initial-scale=1,user-scalable=no',
//         'theme-color': '#6366f1'
//       }
//       return args
//     })
//   },

//   css: {
//     extract: process.env.NODE_ENV === 'production',
//     loaderOptions: {
//       css: {
//         modules: {
//           auto: true
//         }
//       }
//     }
//   },

//   productionSourceMap: false,

//   pwa: {
//     name: 'Hi Tech Lab Dashboard',
//     themeColor: '#6366f1',
//     msTileColor: '#6366f1',
//     manifestOptions: {
//       background_color: '#6366f1'
//     }
//   }
// })


// vue.config.js - CORS muammosini hal qilish uchun
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/Hozirman/' : '/',

  devServer: {
    port: 5500,
    host: '127.0.0.1',
    https: false,
    open: true,
    allowedHosts: 'all',
    
    // CORS muammosini hal qilish uchun proxy sozlamalari
    proxy: {
      '/api': {
        target: 'https://hozirman.uz',
        changeOrigin: true,
        secure: true,
        logLevel: 'debug',
        pathRewrite: {
          '^/api': '/api' // API yo'lini o'zgartirmaslik
        },
        onProxyReq: function(proxyReq, req, res) {
          // So'rov sarlavhalarini sozlash
          proxyReq.setHeader('Origin', 'https://hozirman.uz');
          proxyReq.setHeader('Referer', 'https://hozirman.uz');
        },
        onProxyRes: function(proxyRes, req, res) {
          // Javob sarlavhalarini sozlash
          proxyRes.headers['Access-Control-Allow-Origin'] = '*';
          proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
          proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Content-Length, X-Requested-With';
        }
      }
    },

    // Umumiy CORS sozlamalari
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },

  // Boshqa sozlamalar...
  configureWebpack: {
    resolve: {
      alias: {
        '@': require('path').resolve(__dirname, 'src')
      }
    }
  },

  chainWebpack: config => {
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: 10
        }
      }
    })
  },

  css: {
    extract: process.env.NODE_ENV === 'production',
    loaderOptions: {
      css: {
        modules: {
          auto: true
        }
      }
    }
  },

  productionSourceMap: false
})