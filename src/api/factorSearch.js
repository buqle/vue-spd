/**
 * @author QER
 * @date 2019/9/27
 * @Description: 供应商资质-API接口统一管理
*/
import axios from '@/util/featch'
import {getStore} from "@/util/storage";
import {route} from './apiRoute'
const factorSearch={
  depotlicinfoList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/lic/depotlicinfo/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  saveLicList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/lic/depotlicinfo/saveLic`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  batchDeleteList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/lic/depotlicinfo/batchDelete`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
    depotdruglicinfoList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/lic/depotdruglicinfo/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
    batchDeleteLicList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/lic/depotdruglicinfo/batchDelete`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
    saveDrugLicList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/lic/depotdruglicinfo/saveLic`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
};
export  default  factorSearch;
