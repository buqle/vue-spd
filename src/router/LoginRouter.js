import {router} from "./index";
import store from '@/store'
const whiteList = ['/login'];
import {Cookie,Local} from "@/util/storage";
router.beforeEach((to, from, next) => {
  store.state.backIcon=false;
  store.state.infoTel=false
  store.state.spinsShow=true;
  store.state.totalPage=0;
  store.state.searchTab=[];
  if(to.meta.backIcon){
    store.state.backIcon=true
  }

  if (Cookie.get('token')&&store.state.token) { //存在token
    if (to.path === '/login') { //当前页是登录直接跳过进入主页
      next('/')
    }else{
      if (!Cookie.get('token')) { //拉取用户信息
        next({
          path: '/login',
        })
      }else{
        next()
      }
    }
  }else{
    if (whiteList.indexOf(to.path) >= 0) {
      next()
    }else{
      next('/login')
    }

  }

})

router.afterEach((to,from)=>{
  if(Cookie.get('infoTel')){
    store.state.infoTel=true
  }else {
    store.state.infoTel=false
  }
  document.title=to.name;
});

export  default router;
