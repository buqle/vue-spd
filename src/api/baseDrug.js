/**
 * 病区门诊接口
 */
import axios from '@/util/featch'
import {getStore} from "@/util/storage";
import {route} from './apiRoute'
const baseDrug = {
  //基数药查询-基数药目录-基础信息列表
  findMedicineCatalog(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/basemedicinedetail/findMedicineCatalog`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //基数药查询-基数药目录-导出基础信息列表
  baseMedicineExport(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPost(`${route}/a/his/hisctmedicinematerial/export`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //基数药查询-基数药目录-明细页明细信息
  getHisMedicineInfo(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/basemedicinedetail/getHisMedicineInfo`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //基数药查询-基数药目录-明细页列表信息
  getHisMedicineTransfor(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/basemedicinedetail/getHisMedicineTransfor`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //基数药查询-基数药库存-基础信息列表
  baseMedicineList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/basemedicinedetail/baseMedicineList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //基数药查询-基数药库存-导出基础信息列表
  exportBaseDrug(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/statics/storeSelect/exportBaseDrug`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //基数药查询-基数药库存-明细页面明细查询
  getBaseMedicineDetail(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/basemedicinedetail/getBaseMedicineDetail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //基数药查询-基数药库存-明细页面表格查询
  getBaseMedicineDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/basemedicinedetail/getBaseMedicineDetailList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //基数药查询-基数药台账-基础信息数据
  newDrugLedger(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/statics/medicineStanding/newDrugLedger`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //基数药查询-基数药台账-数据导出
  newExport(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPost(`${route}/a/statics/medicineStanding/newExport`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //基数药查询-基数药申领-新建申领基础信息列表
  applyList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/apply/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //基数药查询-基数药申领-新增申领产品列表
  queryDrugByDept(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/baseapply/queryDrugByDept`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //基数药查询-基数药申领-新增申领产品新增确定
  addDrug(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/baseapply/addDrug`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //基数药查询-基数药申领-新增申领产品新增提交
  saveDrug(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/baseapply/save`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //基数药查询-基数药申领-明细页数据
  baseApplyDetail(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/baseapply/detail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },















};
export default baseDrug;
