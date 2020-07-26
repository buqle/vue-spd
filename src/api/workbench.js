/**
 * 控制台接口
 */
import axios from '@/util/featch'
import {getStore} from "@/util/storage";
import {route} from './apiRoute'
const workbench={
  //待办事项列表查询
  toDoList(){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/common/console/list`)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //待办事项列表明细查询
  toDoListDetail(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/common/console/detail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
};
export  default  workbench;
