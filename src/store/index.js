import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions'
import mutations from './mutations';
import {Cookie,Local} from "@/util/storage";
import VuexPersist from 'vuex-persist';//持久化存储

Vue.use(Vuex);
const state = {
  //token:'ea3858d9a86a4d0eb0ffed2482f34dbd',
  //token:Cookie.get('token'),
  loginInfo:{},

  token:Cookie.get('token'),
  httpDone:false,
  iconArr:[
  'alert','shenling','file-search','pie-chart','form','exception','reconciliation','file-protect','schedule','interation','login','audit','retweet','export','select','home','team','tianjiaanniu','experiment','changyongtubiao_xujiguanli','changyongtubiao_yonghusousuo','setting','cluster','laptop','changyongtubiao_jifei','dollar','tool','changyongtubiao_Farmshezhi','changyongtubiao_caozuorizhifuben','changyongtubiao_baobiaofuben'
  ],
  currentSelect: '',
  currentName:'',
  currentType:'',
  activeName:'',
  openNames:'',
  DeptSelect : [
    {value:1,text:'系统设置'},
    {value:2,text:'全院管理'},
    {value:3,text:'药库'},
    {value:4,text:'药房'},
    {value:5,text:'基数药单位'},
    {value:6,text:'抢救车'},
  ],
  backIcon:false,
  searchInfo:[],searchTab:[],totalPage:0,
  spinsShow:false,
  infoTel:false
};
const vuexLocal = new VuexPersist({
  storage: window.localStorage ,//可选，localStorage/indexDB
  reducer: state => ({
    loginInfo: state.loginInfo ,
    currentSelect:state.currentSelect,
    currentName:state.currentName,
    currentType:state.currentType,
    activeName:state.activeName,
    openNames:state.openNames,
  })
})

export default new Vuex.Store({
  state,
  actions,
  mutations,
  plugins:[vuexLocal.plugin]
})
