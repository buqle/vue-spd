module.exports = {
  proxy: {
    '/api': {
      // target: 'http://61.190.54.189:9001',  // 接口域名
      target: 'http://218.106.118.42:18001',  // 接口域名
      // target: 'http://10.146.8.221:9002',  // 接口域名 院内
      // target: 'http://218.106.118.42:18083',  // 接口域名
      changeOrigin: true,  //是否跨域
      pathRewrite: {
        '^/api': ''   //需要rewrite的,
      }
    }
  }
}
