/**
 * @author QER
 * @date 2019/9/27
 * @Description: 系统管理-API接口统一管理
*/
import axios from '@/util/featch'
import {getStore} from "@/util/storage";
import {route} from './apiRoute'
const system={
  //菜单管理列表查询
  menuListSearch(){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/spd/sys/menu/list`)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //编辑菜单
  menuListEdit(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/spd/sys/menu/detail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //编辑菜单-提交
  menuListSbumit(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/spd/sys/menu/save`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //新建字典提交
  dictSave(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/spd/dict/save`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //重发接口
  interfacelogReSend(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/interfacelog/reSend`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //处理完毕
  interfacelogHandleLog(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/interfacelog/handleLog`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //新建供应商提交
  supplierSave(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/depot/supplier/save`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //部门管理-新建部门提交
  saveOrUpdateDept(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/depot/supplier/save`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //用户管理-保存用户
  operUserInfo(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/his/operUserInfo`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //用户管理-重置密码
  updatePassWord(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/his/updatePassWord`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //角色管理-删除
  deleteRole(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/spd/sys/role/delete`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //菜单管理列表查询
  roleMenuList(){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/spd/sys/menu/allMenuList`)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //角色管理保存
  roleManagSave(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/spd/sys/role/save`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
};
export  default  system;
