/**
 * @author QER
 * @date 2019/9/23
 * @Description: API前缀路径配置
*/

/*以下为后端本地环境部署路径*/
//export  const route=`http://6i3fx5.natappfree.cc/medicinal-supplier/weChat`;
let route=''
//判断开发环境or生产环境请求前缀
if (process.env.NODE_ENV == 'development') {
  route=`api/medicinal-web`;//
}else {
   // route=`http://60.174.197.140:9001/medicinal-web`//spd测试
   route=`http://218.106.118.42:18001/medicinal-web`//spd测试
}
export {route}

