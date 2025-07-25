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


const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,

  publicPath: process.env.NODE_ENV === 'production' ? '/Hozirman/' : '/',

  devServer: {
    port: 5500,
    host: '127.0.0.1',
    https: false, 
    open: true,
    allowedHosts: 'all',
    client: {
      overlay: {
        warnings: false,
        errors: true
      }
    },
    proxy: {
      '/api': {
        target: 'http://217.30.170.22:7000',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug'
      }
    },
    // CORS headers for API requests
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },

  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
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

    config.plugin('html').tap(args => {
      args[0].meta = {
        viewport: 'width=device-width,initial-scale=1,user-scalable=no',
        'theme-color': '#6366f1'
      }
      return args
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

  productionSourceMap: false,

  pwa: {
    name: 'Hi Tech Lab Dashboard',
    themeColor: '#6366f1',
    msTileColor: '#6366f1',
    manifestOptions: {
      background_color: '#6366f1'
    }
  }
})