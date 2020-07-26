// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import "./assets/style/main.less";
import App from './App.vue'
import router from './router/LoginRouter'
//import store from "./store"
//import axios from "./util/axios.js"
//Vue.prototype.axios=axios;
import iView from 'iview'   //引入iview
import 'iview/dist/styles/iview.css'   //引入iview的css样式文件，后面如果需要自己配置也可以新建文件进行修改
import * as filter from './filter/index'
Object.keys(filter).forEach(key => {
  Vue.filter(key, filter[key])
})
import moment from "moment"
Vue.prototype.$moment = moment
// import mixin from './util/mixin'
// Vue.mixin(mixin)


//import * as echarts from 'echarts';




//icon
import './util/iconfont'

import Vstore from './store/index'
Vue.config.productionTip = false
Vue.use(iView)        //use使用这个插件
import skip from './util/skip'
Vue.prototype.$skip = skip;
import { getCurrentDate } from "./util/util";//获取当前时间2019-11-01
Vue.prototype.getCurrentDate = getCurrentDate;
import api from './api' // 导入api接口
Vue.prototype.$api = api; // 将api挂载到vue的原型上
/* eslint-disable no-new */
Vue.prototype.echarts = echarts;
Vue.use(echarts)
Vue.filter('readMore', function (text, length, suffix) {
  return text.substring(0, length) + suffix
})
import components from './components'
Vue.use(components)
new Vue({
  el: '#app',
  router,store:Vstore,
  render:h=>h(App)
})
