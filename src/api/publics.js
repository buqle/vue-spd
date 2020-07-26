/**
 * @author QER
 * @date 2019/9/27
 * @Description: 入库管理-API接口统一管理
*/
import axios from '@/util/featch'
import {getStore} from "@/util/storage";
import {route} from './apiRoute'
const publics={
    //下拉框 时间 天数
  getTimeList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/ypjxq/statics/getTimeList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //下拉框 类型
  typeList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/spd/dict/type`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //下拉框 供应商
  supplierAllList(){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/depot/supplier/all`)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
//药学科 统计分析 库存结存查询 存储地点
findDeptsList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/statics/storeBalance/findDepts`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
//药学科 统计分析 同比环比统计 部门
reportFormDeptList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/reportform/back/getdeptList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
//药学科 统计分析 财务指标 部门
queryHisDeptList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/sys/sysdept/queryHisDept`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
//药学科 统计分析 绩效信息表 部门
operationLogDeptList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/operationlog/dept`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
//药学科 统计分析 药品台账 部门
findMedicineStandingDeptsList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/statics/medicineStanding/getDepts`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
//药学科 统计分析 库存结存查询 供应商
findSuppliersList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/statics/storeBalance/findSuppliers`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
//药学科 盘点审核 下拉框 来源部门
getDeptInfoNoAdminList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/sys/sysdept/getDeptInfoNoAdmin`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
//药学科 盘点审核 下拉框 来源部门
getDeptInfoList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/sys/sysdept/getDeptInfo`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
     //药学科 召回审核 下拉框 来源部门
getDeptInfoAndStoreList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/sys/sysdept/getDeptInfoAndStore`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
   //下拉框 来源部门
  findOriginDeptList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/checkaccept/findOriginDept`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
     //下拉框 收货部门
  findAllDeptsList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/common/outstore/findAllDepts`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
       //下拉框 申领部门
  applyDeptList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/commondistribute/applyDeptList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
//发药科 发药单补登 部门下拉框
  getDeptByParamDeptList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/sys/sysdept/getDeptByParam`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    })
 },
         //下拉框 申领部门  拣货下架  待核实
  pickFindAllDeptsList(params){ 
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/common/pickingorder/findAllDepts`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //下拉框 收货部门 带出库类型
  findAllDeptsAndTypeList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/common/outstore/findAllDeptsAndType`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //下拉框 系统部门
  getAllSysDept(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/depot/druginfo/getAllSysDept`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
     //下拉框 补货部门
  getSysDeptByModuleList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/sys/sysdept/getByModule`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //基础单位
  getUnitInfo(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/depot/druginfo/getUnitInfo`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //供应商-部门药品管理，药品目录明显展现供应商
  getSupplier(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/depot/supplier/getSupplier`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //药学科-基数药目录管理-部门
  findAllCardinalMedicineDeptList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/basemedicinedetail/findAllCardinalMedicineDeptList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //药房-基数药目录管理-部门
  findBaseMedicineDeptlist(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/basemedicinedetail/findBaseMedicineDeptlist`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //获取基数药部门名称
  getDeptNameByCode(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/basemedicinedetail/getDeptNameByCode`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //按药品名称搜索
  queryDrugByList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/common/queryDrugByList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
  //基数药台账-供应商查询
  getBasicSupplier(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/statics/medicineStanding/getSuppliers`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  // 召回审核 添加产品 列表  货位下拉列表 
   queryTargetLocationList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/roomlocadjust/queryTargetLocation`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
   //下拉框 抢救车货位
  rescuecarDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/rescuecardetail/findDeptlist`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },
     //新增盘点 货位
queryDeptLocationInfoList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/dept/queryDeptLocationInfo`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
      })
    });
  },


  record_search_list(params){
    if(params.method&&params.method=='get'){
      return new Promise((resolve,reject)=>{
        axios.get(`${route}${params.url}`,params.infos?params.infos:params)
            .then(res=>{
              resolve(res)
            }).catch(err=>{
              reject(err)
            })
      });
    }else  if(params.method&&params.method=='postJson'){
      return new Promise((resolve,reject)=>{
        axios.postJson(`${route}${params.url}`,params.infos?params.infos:params)
          .then(res=>{
            resolve(res)
          }).catch(err=>{
          reject(err)
        })
      });
    }else {
      return new Promise((resolve,reject)=>{
        axios.post(`${route}${params.url}`,params.infos?params.infos:params)
          .then(res=>{
            resolve(res)
          }).catch(err=>{
          reject(err)
        })
      });
    }
  },

};
export  default  publics;
