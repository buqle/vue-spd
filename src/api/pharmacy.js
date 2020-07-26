/**
 * @author QER
 * @date 2019/11/29
 * @Description: 药房api
*/
import axios from '@/util/featch'
import {getStore} from "@/util/storage";
import {route} from './apiRoute'
const  pharmacy={
  //添加产品
  addDrug(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/apply/addDrug`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //提交申领单据
  submitDrug(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/apply/save`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //保存申领单据
  saveDrug(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/apply/saveDraft`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //提交验收单
  submitWareHouseData(params){
  return new Promise((resolve,reject)=>{
    axios.postJson(`${route}/a/examdetail/checkList`,params)
      .then(res=>{
        resolve(res)
      }).catch(err=>{
      reject(err)
    })
  });
},
  //提交上架单
  submitWarePutData(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/checkacceptdetail/finish`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //复核-查询工号id
  getUserId(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/sys/user/findByLoginName`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //复核-提交
  submitOUtReview(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/billoutsotre/confirmDispensing`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //复核-提交
  submitBaseReplen(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/common/outstore/confirmOutStore`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //提交拣货下架单
  submitPickData(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/common/pickingorder/finishPicking`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //提交退库单
  submitRefundData(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/commonback/backdetail/backSubmit`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //退库单-保存草稿
  saveRefundData(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/commonback/backdetail/saveDraft`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //退库单-提交草稿
  submitEditDarft(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/commonback/backdetail/confirmEditDraft`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //补登单据-再次提交
  submitAgain(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/roommakeupdetail/makeupdetail/submitAgain`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //基数药补货基数药补货-删除
  deleteOutBills(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/common/outstore/deleteOutStore`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //补登单据-删除
  deleteBills(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/roommakeup/makeup/delete`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //补登单据-审核
  checkBills(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/roommakeup/makeup/makeupSumit`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //补登入库单添加产品
  addDrugBillIn(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/roommakeupdetail/makeupdetail/queryDrugSuppllier`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //补登入库单-退药单添加产品
  addDrugBillInType4(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/medHisBackDetail/medhisbackdetail/druglist`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //提交补登出入单据 公共
  submitSupOutBill(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/roommakeupdetail/makeupdetail/insertmakeup`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //提交补登入库发药
  submitSupInBill(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/medHisBackDetail/medhisbackdetail/confrimList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //提交异常发药单处理
  submitexceptionBill(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/bill/balance/submitBadFlowList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //药房-复核不通过
  submitOutStore(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/common/outstoredetail/rejectOutStore`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //药房-通过
  submitPassOutStore(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/common/outstoredetail/checkOutStore`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //药房-生成验收单
  submitBuildOutStore(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/common/outstoredetail/buildCheckAccept`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //配货出库
  submitAccept(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/commondistribute/distributeEvent`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //配货出库-获取右侧tab
  getAcceptRight(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/commondistribute/singleQuery`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //配货出库保存-右侧tab数量
  saveRightData(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/commondistribute/singleUpdate`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //锁定-提交
  submitLock(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/roomrecall/createLock`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //锁定-取消
  cancelLock(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/roomrecall/cancelLock`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //锁定-删除
  deleteLockBills(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/roomrecall/delete`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //锁定-批量通过
  passCheckClock(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/roomrecall/batchThroughAuditLock`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //锁定-驳回
  nopassCheckClock(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/roomrecall/rejectLock`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
 //移库-添加提交
  addAdjustBill(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/roomlocadjust/drugInformation`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  seachAdjustLoc(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/roomlocadjust/queryTargetLocation`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //移库单据-提交
  submitAdjust(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/roomlocadjust/confirmAdjust`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //入库查询-导出
  exportList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/billoutsotre/export`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //抢救车增加-检查
  salvageChceck(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/rescuecardetail/pitchOnCardinalMedicine`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //抢救车增加-删除
  salvageDelete(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/rescuecardetail/moveRescuecarMedicineDetail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //抢救车增加-保存
  salvageSave(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/rescuecardetail/getHisMedicineBound`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //基数药增加-检查
  drugsChceck(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/basemedicinedetail/pitchOnCardinalMedicine`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //基数药-保存
  drugsSave(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/basemedicinedetail/getHisMedicineBound`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //基数药-删除
  drugsDelete(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/basemedicinedetail/MoveCardinalMedicineDetail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //批号新增-提交
  submitBatch(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/lot/lotadjust/saveDraft`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //批号调整-提交
  submitDraft(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/lot/lotadjust/submitDraft`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //批号调整-删除
  batchDelete(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/lot/lotadjust/batchDelete`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //批号调整-审核
  batchCheck(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/lot/lotadjust/batchCheck`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //批号调整-导出
  exportBatch(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/lot/lotadjust/export`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
}
export default pharmacy;
