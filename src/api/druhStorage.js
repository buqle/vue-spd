/**
 * @author QER
 * @date 2019/9/27
 * @Description: 入库管理-API接口统一管理
*/
import axios from '@/util/featch'
import {getStore} from "@/util/storage";
import {route} from './apiRoute'
const druhStorage={
  // 入库验收 列表
  druhStorageList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/exam/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  // 入库验收 列表 明细
  druhStorageDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/exam/detail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
    // 入库验收 列表 明细 头部
  druhStorageDetailHeadList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/exam/detailhead`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
      // 入库验收 列表 导出
  exportAsPrintList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBuffer(`${route}/a/deliver/print/exportAsPrint`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  // 入库上架 列表
  shelfListList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/checkaccept/shelfList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
    // 入库上架 列表 明细 头部
  shelfInfoTitleList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/shelfInfo/shelfInfoTitle`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
     // 入库上架 列表 明细
  shelfInfoList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/shelfInfo/shelfInfoList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  // 入库查询 列表
  instoreList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/common/instore/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
   // 入库查询 列表  明细 头部
  instoreInfoList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/common/instore/info`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  }, 
     // 手工出库 列表 
outstoreList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/common/outstore/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
   // 手工出库 列表 明细 头部
  outStoreDetailInfoList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/common/outstoredetail/detailInfo`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  // 手工出库 列表 明细
  outStoreDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/common/outstoredetail/outStoreDetailList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
   // 手工出库 弹框 商品 列表
  getFilterDrugInfoList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/common/outstoredetail/getFilterDrugInfo`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
     // 手工出库 弹框 商品 列表
  confirmOutStoreList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/common/outstore/confirmOutStore`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  // 配货出库 列表
  commonDistributeList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/commondistribute/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
    //  配货出库 列表  明细 头部
  distributeDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/commondistribute/distributeDetail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  }, 
      //  配货出库 列表  明细 头部
  singleQueryList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/commondistribute/singleQuery`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  }, 
  // 配货出库 列表 明细 配货 取消 生成拣货单
  distributeEventList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/commondistribute/distributeEvent`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
   // 拣货下架 列表
  pickingDrderList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/common/pickingorder/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
 // 拣货下架 明细 列表 头部
  getPickingDetailPadList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/common/pickingorderdetail/getPickingDetailPad`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
 // 拣货下架 明细 列表
  pickingDrderdetailList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/common/pickingorderdetail/detailList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
// 拣货下架 明细  确认拣货
  finishPickingList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/common/pickingorder/finishPicking`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//新建退货 列表
  backList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/commonback/back/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//新建退货 弹框 商品列表
  backdetailList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/commonback/backdetail/addlist`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //新建退货 一级弹框 保存草稿
saveDraftList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/commonback/backdetail/saveDraft`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//新建退货 一级弹框 保存草稿
confirmEditDraftList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/commonback/backdetail/confirmEditDraft`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //新建退货 一级弹框 确定
backSubmitList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/commonback/backdetail/backSubmit`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //新建退货 明细列表
  backInfoList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/commonback/back/info`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
   //新建退货 明细 弹框抬头
editDraftHeadList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/commonback/back/editDraftHead`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
   //新建退货 明细 弹框列表
editDraftList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/commonback/backdetail/editDraft`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
    //新建退货 明细列表 导出
backExportList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/statics/back/export`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //退货下架 列表
 pickingOrderList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/common/pickingorder/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//  出库/退货复核 复核通过
   checkOutStoreList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/common/outstoredetail/checkOutStore`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
//  出库/退货复核  生成验收单
   buildCheckAcceptList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/common/outstoredetail/buildCheckAccept`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 召回
   roomrecallList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/roomrecall/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 召回 添加产品 商品列表
   selectProductList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/roomrecalldetail/selectProduct`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 召回 添加产品 商品列表 确定
   roomrecallCreateList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/roomrecall/create`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 召回 明细 商品列表  
   roomrecallGetDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/roomrecall/getDetail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 召回 商品列表  删除
   roomrecallDeleteList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/roomrecall/delete`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 召回审核 商品列表  
   roomrecallDetailsList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/roomrecall/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 召回审核 明细 通过
   batchThroughAuditList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/roomrecall/batchThroughAudit`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 召回审核 明细 通过
   roomrecallRejectList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/roomrecall/reject`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 货位移动 列表
   roomLocadJustList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/roomlocadjust/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 货位移动 列表 明细
   roomLocadJustDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/roomlocadjust/detail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 召回审核 添加产品
   roomDrugList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/roomlocadjust/roomDrugList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 召回审核 添加产品 确定
   drugInformationList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/roomlocadjust/drugInformation`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 召回审核 添加产品 确认移库
   confirmAdjustList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/roomlocadjust/confirmAdjust`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 盘点审核 列表
   sheveList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/checkbill/sheveList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 盘点审核 确认盘点
   createSheveList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/checkbill/create`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 盘点审核 删除
   delSheveList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/checkbill/delete`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 盘点审核 导出
checkBillSheveExportList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/excessive/statics/checkBillSheveExport`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
// 盘点审核 明细
   checkBillGetList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/checkbill/get`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 盘点审核 明细 列表
   getListByBillNoList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/checkbilldetail/getListByBillNo`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 盘点审核 明细 列表 通过
   auditPassOrNoList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/checkbill/auditPassOrNo`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 盘点调整 列表 
   checkbillList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/checkbill/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 盘点调整 一键处理损益
   handlerProfitAndLossList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/checkbill/handlerProfitAndLoss`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 新建盘点 明细 盘点
   beginCheckList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/checkbill/beginCheck`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 新建盘点 明细 列表 通过
   submitCheckList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/checkbill/submitCheck`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 新建盘点 新增批号
   addNewLotList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/checkbilldetail/addNewLot`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 盘点审核 新增批号 货位
   findLocInfoList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/checkbilldetail/findLocInfo`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 损益记录
   causticExcessiveList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/causticexcessive/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 损益记录 明细 列表
   ExcessiveList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/causticexcessive/getListByBillNo`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
// 损益记录 明细 头部
   ExcessiveGetList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/causticexcessive/get`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
},
  //新建退库 一级弹框 确定
dicineBackSubmitList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/basemedicine/baseBack/backSubmit`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //抢救车库存 列表
rescuecarMedicineList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/rescuecardetail/rescuecarMedicineList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
    //抢救车库存 明细 头部
getRescuecarMedicineDetail(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/rescuecardetail/getRescuecarMedicineDetail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
    //抢救车库存 明细 列表
getRescuecarMedicineDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/rescuecardetail/getRescuecarMedicineDetailList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
      //抢救车台账(新) 列表
newDrugLedgerList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/statics/rescuecar/newDrugLedger`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //抢救车 药品验收 拒收
rejectList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/examdetail/reject`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
    //抢救车 药品验收 确认验收
examDetailCheckListList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/examdetail/checkList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
 //抢救车 新建退库 列表
rescuecarBackList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/rescueCar/rescuecarBack/rescuecarBackList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
   //抢救车 新建退库 添加产品 商品列表
rescuecarBackAddList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/rescueCar/rescuecarBack/addlist`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
   //抢救车 新建退库 确认提交
rescuecarBackSubmitList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/rescueCar/rescuecarBack/backSubmit`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//抢救车 新建退库 明细
rescuecarBackInfoList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/rescueCar/rescuecarBack/rescuecarBackInfo`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//抢救车 新建申领 列表
rescuecarApplyList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/rescuecarapply/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//抢救车 新建申领 列表
queryDrugByDeptList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/rescuecarapply/queryDrugByDept`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //抢救车 新建申领 添加产品 列表 确定
rescuecarapplyAddDrugList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/rescuecarapply/addDrug`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//抢救车 新建申领 添加产品 列表 确定
rescuecarapplySaveList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/rescuecarapply/save`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//抢救车 新建申领 添加产品 列表 确定
rescuecarapplyDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/rescuecarapply/detail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },

//新建补货计划
depotplanList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/depot/depotplan/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//新建补货计划 一键添加低库存产品   商品列表
queryDrugByDeptList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/depot/depotplan/queryDrugByDept`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//新建补货计划 一键添加低库存产品   商品列表 药品名称 选择 提交
depotPlanaddDrugList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/depot/depotplan/addDrug`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//新建补货计划 一键添加低库存产品   商品列表 药品名称 选择 提交补货计划
saveDepotPlanDrugList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/depot/depotplan/save`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //新建补货计划 明细
planDrugDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/depot/depotplan/detail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
    //新建补货计划 明细 导出
planExportList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/depotdetail/depotplandetail/planExport`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
      //新建补货计划 明细 提交
planExportSaveList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/depot/depotplan/save`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
   //欠品补货 生成补货计划
createReplenishmentList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/purchaseorderdetail/createReplenishment`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
    //欠品补货 生成补货计划 导出
exportDifferenceList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/purchaseorderdetail/exportDifference`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
 //采购计划
findDifferenceList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/purchaseorderdetail/findDifference`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
    //采购计划明细 导出
exportList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/depotdetail/depotplandetail/export`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
      //采购计划明细 提交
updateStatusList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/depot/depotplan/updateStatus`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
      //采购计划 审核
updateQtyList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/depot/depotplan/updateQty`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },

//订单发送 列表
purchaseorderList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/purchaseorder/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//订单发送 发送订单
sendOrder2SupplierList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/purchaseorder/sendOrder2Supplier`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//订单发送 关闭订单
closeOrderList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/purchaseorder/closeOrder`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//订单发送 明细
purchaseorderDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/purchaseorder/detail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //订单作废
cancelOrderList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/purchaseorder/cancelOrder`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//结算单
settleList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/settle/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//结算单 导出
settleExportList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/settle/export`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //结算单 明细
settleDetailHeadList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/settle/detail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //结算单 列表
settleDetailListList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/settle/detailList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //日对账单 列表
dailyList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/bill/balance/dailyList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //日对账单 明细
dailyDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/bill/balance/dailyDetail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //日对账单 生成
  dailyListSubmit(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/bill/balance/push2Hrp`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //日对账单 列表
dailyDetailListList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/bill/balance/dailyDetailList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//日对账单 导出
balanceExportList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/bill/balance/export`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //生成结算单 列表
balanceDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/balancedetail/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
    //生成结算单 列表  生成结算单
generatorSettleList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/balancedetail/generatorSettleList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
      //生成结算单 列表  生成结算单 导出
exportGeneratorSettleList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/purchaseorderdetail/exportDifference`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  }, 
    //药库出库/退货复核
rejectOutStoreList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/common/outstoredetail/rejectOutStore`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  }, 
//补登单据复核
makeUpList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/roommakeup/makeup/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//补登单据复核  通过
makeupSumitList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/roommakeup/makeup/makeupSumit`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//补登单据复核  明细
makeupInfoList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/roommakeup/makeup/info`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//发药单补登
makeList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/bill/balance/make/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //发药单补登
makeDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/bill/balance/make/detail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
    //发药单补登 批量发送
pushBadFlow2HrpList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/bill/balance/pushBadFlow2Hrp`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//药学科 召回审核
roomrecallSheveList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/roomrecall/sheveList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//药学科 发票查询
invoiceList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/invoice/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//药学科 发票查询 明细
invoiceDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/invoice/detail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//药学科 发票查询 通过 不通过
depotBackSubmitList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/commonback/backdetail/depotBackSubmit`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 库存查询
queryDrugByDeptAllList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/StoreDetail/queryDrugByDeptAll`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 库存查询
storeSelectExportList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/statics/storeSelect/exportAll`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 库存查询
queryDrugByDeptAllList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/StoreDetail/queryDrugByDeptAll`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //统计分析 库存查询 头部明细
getRoomRepertoryDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/StoreDetail/getRoomRepertoryDetail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //统计分析 库存查询 明细列表
getRoomRepertoryList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/StoreDetail/getRoomRepertoryListAll`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },

  //统计分析 库存结存查询 列表
findBalanceDetailsList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/statics/storeBalance/findBalanceDetails`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 库存结存查询 导出
storeBalanceExportList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/statics/storeBalance/export`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 近效期查询
staticsList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/ypjxq/statics/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //统计分析 近效期查询 导出
staticsExportList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/ypjxq/statics/export`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 损益分析
excessiveList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/excessive/statics/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 损益分析
getStaticSexcessiveList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/excessive/statics/getStatics`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 损益分析 导出
staticsExcessiveExportList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/excessive/statics/staticsExport`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 损益分析 明细
getExcessiveDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/excessive/statics/getDetail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 损益分析 明细
getExcessiveDetailUpList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/excessive/statics/get`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 科室退库分析
getKstkList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/statics/kstk/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 科室退库分析 统计
getListCountList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/statics/kstk/listCount`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 科室退库分析 导出
getKstkExportList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/statics/kstk/export`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 订单执行情况 列表
getOrderExecuteList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/orderexecute/count`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 订单执行情况 导出
getOrderExecuteExportList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/orderexecute/export`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 订单执行情况 明细
getOrderExecuteDetailUpList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/orderexecute/detail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //统计分析 订单执行情况 明细 列表
getOrderExecuteDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/orderexecute/executedetail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 订单执行情况 明细 列表
getnewDrugLedgerList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/statics/medicineStanding/newDrugLedger`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 订单执行情况 导出
getMedicineStandingExportList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/statics/medicineStanding/newExport`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 订单追溯
getOrderTraceExecuteList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/orderexecute/trace`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 订单追溯 导出
getOrderTraceExportTraceList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/orderexecute/exportTrace`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 订单追溯 明细 头部
getOrderTraceExecuteDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/orderexecute/traceDetail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 订单追溯 明细 列表
getOrderTraceExecuteOrderFlowList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/orderexecute/orderflow`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 供应商 列表
getSupplierList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/gysph/statics/supplierlist`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 订单追溯 导出
getSupplierExportList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/gysph/statics/export`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 供应商供货分析 列表
getSupplieroFmaterialList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/orderexecute/supplierofmaterial`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 供应商供货分析 导出
getExportSupplierAnalyzeList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/orderexecute/exportsupplierAnalyze`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 供应商供货分析 列表 统计
getOrderExecuteTotalsList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/orderexecute/totals`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 供应商退货分析 列表
getsupplierReturnList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/statics/supplierReturn/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 供应商退货分析 导出
getsupplierReturnExportList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/statics/supplierReturn/export`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 财务指标 列表
getStaticsList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/statics/store/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 财务指标 导出
getStaticsExportList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/statics/store/export`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 财务指标 列表
operationLogList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/operationlog/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 财务指标 一级菜单
operationLogMenuList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/operationlog/menu`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 财务指标 业务菜单
operationLogSecMenuList(params){
    return new Promise((resolve,reject)=>{
      axios.get(`${route}/a/operationlog/secmenu`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 批号追溯
tracePageList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/common/trace/tracePageList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 批号追溯 明细 头部
getDrugInfoList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/common/trace/getDrugInfo`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 批号追溯 明细 当前库存
getStoreTraceList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/common/trace/getStore`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 批号追溯 明细 采购/验收记录
getPlanAndCheckList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/common/trace/getPlanAndCheck`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 批号追溯 明细 院内流通记录
medCirculateList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/common/trace/medCirculate`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 批号追溯 明细 发药记录
getDispensingList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/common/trace/getDispensing`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 批号追溯 明细 非发药消耗
getMakeUpList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/common/trace/getMakeUp`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 调价查询
getPriceStaticList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/priceStatic/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 调价查询 明细
getPriceStaticDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/priceStatic/getDetail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 调价查询 头部
getPriceStaticUpList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/priceStatic/get`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 患者追溯
getSickGoodsLotReviewList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/reportform/lot/getSickGoodsLotReview`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 患者追溯 当前库存
getMedStoreDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/reportform/lot/getMedStoreDetail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 患者追溯 采购/验收记录
getmMedCommonCheckacceptDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/reportform/lot/getmMedCommonCheckacceptDetail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 患者追溯 院内流通记录
getMedCommonStoreFlowList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/reportform/lot/getMedCommonStoreFlow`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 患者追溯 发药记录
medHisDispensingDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/reportform/lot/medHisDispensingDetail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 同比环比统计
getSickBackReportFormList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/reportform/back/getSickBackReportform`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 同比环比统计 明细
getMedHisBackList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/reportform/back/getMedHisBack`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 同比环比统计 明细
getMedHisBackDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/reportform/back/getMedHisBackDetail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 人员工作统计
getUserWorkCountList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/reportform/userwork/getUserWorkCount`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 人员工作统计 补货单
getPurchaseOrderList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/reportform/userwork/getPurchaseOrderList`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 人员工作统计 补货单 明细
getPurchaseOrderDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/reportform/userwork/getPurchaseOrderDetail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 人员工作统计 验收单明细 明细
getCheckacceptDetailsList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/reportform/userwork/getCheckacceptDetails`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 人员工作统计 下架 明细
getMedCommonPickingOrderDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/reportform/userwork/getMedCommonPickingOrderDetail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 人员工作统计 出库复核 明细
getMedCommonOutStoreDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/reportform/userwork/getMedCommonOutStoreDetail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 人员工作统计 盘点 明细
getMedCommonCheckBillDetailList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/reportform/userwork/getMedCommonCheckBillDetail`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 人员工作统计 盘点 明细
getCheckMedHisDispensingsList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/reportform/userwork/getCheckMedHisDispensings`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
//统计分析 人员工作统计 盘点 明细
getCompareStockList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/comparestock/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //统计分析 财务指标 导出
getCompareStockExportList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/comparestock/export`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //西药库 入库上架 确认上架
getCheckAcceptDetailFinishList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/checkacceptdetail/finish`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
  //统计分析 移库消耗统计
getFindBalanceDetailsList(params){
    return new Promise((resolve,reject)=>{
      axios.post(`${route}/a/statics/storeBalance/findBalanceDetails`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
    //统计分析 移库消耗统计 导出
getStoreBalanceExportList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPost(`${route}/a/statics/storeBalance/export`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
    //统计分析 结算分析
getStaticsList(params){
    return new Promise((resolve,reject)=>{
      axios.postJson(`${route}/a/settle/statics/list`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
    //统计分析 结算分析 导出
getStaticsExportList(params){
    return new Promise((resolve,reject)=>{
      axios.getArrayBufferByPostJson(`${route}/a/settle/statics/export`,params)
        .then(res=>{
          resolve(res)
        }).catch(err=>{
        reject(err)
      })
    });
  },
};
export  default  druhStorage;
