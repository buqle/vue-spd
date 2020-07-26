import types from "./mutationsTypes";
import {Cookie,Session,Local} from "@/util/storage";
export  default {
  //存储token
  [types.RECORD_USERINFO](state,info){
    state.token = info.data.token;
    state.loginInfo = info.data;
    Cookie.set({
      token:info.data.token
    })
  },

  [types.RECORD_INFOTEL](state,info){
    if(info==1){
      state.infoTel=true
      Cookie.set({
        infoTel:state.infoTel
      })
    }else {
      state.infoTel=false;
      Cookie.remove('infoTel');
    }


  },

  //清除token
  [types.CLEAR_USERINFO](state){
    state.token = "";
    state.loginInfo = "";
    Cookie.remove('token');
    Local.remove('vuex');
  },
  //设置当前选中主菜单
  [types.SET_SELECTED_MENU](state, value) {
    state.currentSelect = value
  },
  //设置当前选中主菜单名称
  [types.SET_SELECTED_NAME](state, value) {
    state.currentName = value
  },
  //设置当前选中主菜单部门类型
  [types.SET_SELECTED_TYPE](state, value) {
    state.currentType = value
  },
  //设置当前选中的左侧菜单
  [types.SET_ACTIVENAME](state, value) {
    state.activeName = value
  },
  //设置当前展开的左侧菜单
  [types.SET_OPENNAMES](state, value) {
    state.openNames = value
  },
  //查询界面
  [types.RECORD_SEARCH](state,info){
      state[info.name]=info;

  },
  //查询列表
  [types.RECORD_TAB](state,info){
    state.searchTab=info.data.list;
    state.totalPage=info.data.count;
    console.log(state.totalPage)
  }
}
