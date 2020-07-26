/**
 * 药学科接口
 */
import axios from '@/util/featch'
import {getStore} from "@/util/storage";
import {route} from './apiRoute'
const purchase = {
  //药品目录-药品目录-基本信息列表
  drugList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/his/hisctmedicinematerial/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //药品目录-药品目录-数据导出
  //药品目录-部门药品管理-数据导出
  exportDrugList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPost(`${route}/a/his/hisctmedicinematerial/export`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //药品目录-药品目录-明细数据
  drugListDetail(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/his/hisctmedicinematerial/getMedicineInfo`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //药品目录-药品目录-明细数据保存
  saveDrugListDetail(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/his/hisctmedicinematerial/editMedicinalType`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //药品目录-部门药品管理-基本信息列表
  findDepotlist(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/his/hisctmedicinematerial/findDepotlist`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },

  //药品目录-部门药品管理-批量设置上下限-保存
  operDeptDrug(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/depot/druginfo/operDeptDrug`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //药品目录-部门药品管理-新增-查询
  findDepotFilterList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/his/hisctmedicinematerial/findDepotFilterList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //药品目录-部门药品管理-移除
  deleteDeptDrug(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/depot/druginfo/deleteDeptDrug`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //药品目录-部门药品管理-明细
  getDrugInfo(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/depot/druginfo/getDrugInfo`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //药品目录-部门药品管理-明细-保存
  operDeptInfo(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/depot/druginfo/operDeptInfo`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //药品目录-基数药目录管理-信息列表
  findAllCardinalMedicineList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/basemedicinedetail/findAllCardinalMedicineList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //药学科-药品目录-基数药目录管理-明细页-信息列表
  findCardinalMedicineDetail(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/basemedicinedetail/findCardinalMedicineDetail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //药品目录-基数药目录管理-明细页-保存库存基数
  getHisMedicineBound(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/basemedicinedetail/getHisMedicineBound`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //药品目录-基数药目录管理-明细页-删除
  moveCardinalMedicineDetail(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/basemedicinedetail/MoveCardinalMedicineDetail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //药品目录-基数药目录管理-明细页-新增列表查询
  addCardinalMedicine(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/basemedicinedetail/addCardinalMedicine`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //药品目录-基数药目录管理-明细页-新增列表保存
  pitchOnCardinalMedicine(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/basemedicinedetail/pitchOnCardinalMedicine`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //药房-药品目录-基数药目录管理-明细页-信息列表
  findCardinalMedicineList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/basemedicinedetail/findCardinalMedicineList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
         reject(err)
      })
    });
  },
  //药品目录-供应商药品-基础信息列表
  supplierPriceList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/supplier/price/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //药品目录-供应商药品-明细页面列表信息
  getMedicineInfo(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/supplier/price/getMedicineInfo`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //药品目录-供应商药品-明细页面列表信息保存
  updateSupplierRefPrice(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/supplier/price/updateSupplierRefPrice`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //药品目录-药品调价-调价确认基础信息列表
  checkPriceList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/checkprice/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //药品目录-药品调价-新建调价-添加产品-列表查询
  selectDrugCode(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/checkpricedetail/selectDrugCode`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //药品目录-药品调价-新建调价-添加产品-列表查询
  checkPriceDetailConfrim(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/checkpricedetail/confrim`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //药品目录-药品调价-明细页列表数据
  checkPriceDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/checkpricedetail/getList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //药品目录-药品调价-明细页明细数据
  checkPriceGetDetail(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/checkprice/getDetail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  }





};
export default purchase;
