import types from "./mutationsTypes";
import api from '@/api' // 导入api接口
import store from '@/store'
export  default {
  async record_search({commit},params,flag){
    if(params.item){
      params=params.item;
      store.state.totalPage=0;
    }else {
      params=params
    }
    if(!params.spin||!params.infoName){
      store.state.spinsShow=true;
    }
      store.state[params.infoName]=[];
      store.state.searchTab=[];
      store.state.spinsShow=true;

      let res=await api.publics.record_search_list(params)
        if(res.code==200&&Array.isArray(res.data.list)){
          if(params.infoName){
            res.name=params.infoName
            commit(types.RECORD_SEARCH,res);
          }else {
            commit(types.RECORD_TAB,res);
          }

          store.state.spinsShow=false;
        }
  },
  async record_search_head({commit},params){

    let res=await api.publics.record_search_list(params)
    if(res.code==200&&Array.isArray(res.data)){
      store.state[params.infoName]=[];
      res.name=params.infoName
      commit(types.RECORD_SEARCH,res);
    }else {
      store.state[params.infoName]='';
      res.name=params.infoName
      commit(types.RECORD_SEARCH,res);
    }
  }
}
