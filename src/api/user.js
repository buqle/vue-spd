import axios from '@/util/featch'
import {getStore} from "@/util/storage";
import {route} from './apiRoute'
const user={
  //检查密码
  checkPassword(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/entryPass/entryptPassword`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //登录
  userLogin(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/login`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //退出
  userOut(){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/logout`)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //修改密码
  updatePassword(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/his/updatePassWordById`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //设置当前系统，系统切换
  cacheCurrentDept(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/cacheCurrentDept/${params.id}`)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  }

}
export default user;

