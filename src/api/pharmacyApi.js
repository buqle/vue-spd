/**
 * @author QER
 * @date 2019/11/27
 * @Description: 药房api link
*/
import {route} from './apiRoute'
const pharmacyApi={
  APPLY_SEARCH_LIST:`/a/apply/list`,//药品申领-查询列表
  APPLY_DETAIL_LIST:`/a/apply/detail`,//药品申领-查询列表
  DAYSTATEMENTS_ADD_LIST:`/a/bill/balance/generatorDailyList`,//药学科-生成对账查询
  /**
   * @author BQL
   * @date 2020/3/26
   * @Description: 批号调整功能
  */
  BATCH_LIST:`/a/lot/lotadjust/list`,//批号调整-查询列表
  BATCH_CHECK_LIST:`/a/lot/lotadjust/checkList`,//批号审核-查询列表
  BATCH_LIST_SELECT:`/a/lot/lotadjust/addlist`,//批号调整新增-药品查询列表
  /**
   * @author BQL
   * @date 2020/3/13
   * @Description: 抢救车目录管理
  */
  SALVAFE_DEPT_LIST:`/a/rescuecardetail/findDeptlist`,//部门
  SALVAFE_ROOM_DEPT_LIST:`/a/rescuecardetail/findRoomDeptlist`,//目录
  SALVAFE_LIST:`/a/rescuecardetail/findRescuecarMedicineList`,//列表
  SALVAFE_DETAILHEAD:'/a/rescuecardetail/findCardinalMedicineDetail',//详情
  SALVAFE_ADD_DRUG_LIST:'/a/rescuecardetail/addCardinalMedicine',//查询药品
  /**
   * @author BQL
   * @date 2020/3/13
   * @Description: 基数药目录管理
  */
  CARDINAL_DRUGS_LIST:`/a/basemedicinedetail/findAllCardinalMedicineList`,//药学科-列表
  CARDINAL_DRUGS_DEPT_LIST:`/a/basemedicinedetail/findAllCardinalMedicineDeptList`,//药学科-部门
  ARDINAL_PH_DRUGS_LIST:`/a/basemedicinedetail/findCardinalMedicineList`,//药房-列表
  CARDINAL_DRUGS_DEPTS_LIST:`/a/basemedicinedetail/findBaseMedicineDeptlist`,//药房-部门
  CARDINAL_DRUGS_DETAILHEAD:'/a/basemedicinedetail/findCardinalMedicineDetail',//详情
  CARDINAL_DRUGS_ADD_DRUG_LIST:`/a/basemedicinedetail/addCardinalMedicine`,//查询药品
  /**
   * @author QER
   * @date 2019/11/28
   * @Description: 药品申领-新增部分
  */
  APPLY_SELECT_DEPT:`/a/apply/selectApplyDept`,//补货部门
  APPLY_SELECT_BY_DEPT:`/a/common/queryDrugByDept`,//补货部门
  SEARCH_DRUG_LIST:`/a/common/queryDrugByList`,//查询药品
  APPLY_EDIT_LIST:`/a/apply/editDraft`,//药品申领 - 草稿详情
  /**
   * @author QER
   * @date 2019/12/15
   * @Description: 药房-验收
  */
  DRUG_WARE_HOUSE_LIST:`/a/exam/list`,//查询列表
  DRUG_WARE_HOUSE_DETAILHEAD:`/a/exam/detailhead`,//新建验收-头部查询
  DRUG_WARE_HOUSE_DETAILTAB:`/a/exam/detail`,//新建验收-产品查询
  /**
   * @author QER
   * @date 2019/12/9
   * @Description: 药房-上架
  */
  PUTAWAY_SEARCH_LIST:`/a/checkaccept/shelfList`,//查询列表
  PUTAWAY_DETAILHEAD:`/a/shelfInfo/shelfInfoTitle`,//上架详情头部
  PUTAWAY_DETAILTAB:`/a/shelfInfo/shelfInfoList`,//上架详情列表
/**
 * @author QER
 * @date 2019/12/18
 * @Description: 药房-入库查询
*/
  DRUG_WARE_HOUSE_SEARCH_LIST:`/a/common/instore/list`,//列表
  DRUG_WARE_HOUSE_SEARCH_DETAIL:`/a/common/instore/info`,//单据详情
  /**
   * @author QER
   * @date 2019/12/20
   * @Description: 药房-出库管理功能
  */
  PUTAWAY_OUTSTORAGE_OUTPUT_LIST:`/a/billoutsotre/list`,//复核-查询列表
  PUTAWAY_OUTSTORAGE_OUTPUT_DETAILHEAD:`/a/billoutsotre/detail`,//复核-详情头部
  PUTAWAY_OUTSTORAGE_OUTPUT_DETAILTAB:`/a/billoutsotre/detailList`,//复核-详情列表

  PUTAWAY_OUTSTORAGE_REPLEN_LIST:`/a/common/outstore/list`,//基数药补货-查询列表
  PUTAWAY_OUTSTORAGE_REPLEN_DEPT_LIST:`/a/commondistribute/applyDeptList`,//基数药补货-申领部门
  PUTAWAY_OUTSTORAGE_REPLEN_DETAILINFO:`/a/common/outstoredetail/outStoreDetailInfo`,//基数药补货-详情
  PUTAWAY_ADD_REPLEN_DEPTTYPE:`/a/common/outstore/findAllDeptsAndType`,//基数药补货-新建-接收部门
  PUTAWAY_ADD_REPLEN_DRUGINFO:`/a/common/outstoredetail/getFilterDrugInfo`,//基数药补货-新建-添加药品

  PUTAWAY_OUTSTORAGE_ACCPTDIS_LIST:`/a/commondistribute/list`,//配货出库-查询列表
  PUTAWAY_OUTSTORAGE_ACCPTDIS_DETAILHEAD:`/a/commondistribute/distributeDetail`,//配货出库-详情头部&table

  DRUG_OUTSTORAGE_PICKUNDER_LIST:`/a/common/pickingorder/list`,//拣货下架-查询列表
  DRUG_OUTSTORAGE_PICKUNDER_DETAILHEAD:`/a/common/pickingorderdetail/getPickingDetailPad`,//拣货下架-详情头部
  DRUG_OUTSTORAGE_PICKUNDER_DETAILTAB:`/a/common/pickingorderdetail/detailList`,//拣货下架-详情列表
  /**
   * @author QER
   * @date 2019/12/26
   * @Description: 药房-退库管理
  */
  DRUG_OUTPUT_REFUND_LIST:`/a/commonback/back/list`,//退库管理-查询列表
  DRUG_OUTPUT_REFUND_ADDEPT:`/a/commonback/backdetail/findDepotDeptlist`,//退库管理-新建退库
  DRUG_OUTPUT_REFUND_ADDUG_LIST:`/a/commonback/backdetail/addlist`,//退库管理-新建退库-药品检索
  DRUG_OUTPUT_REFUND_EDITDRAFT_HEAD:`/a/commonback/back/editDraftHead`,//退库管理-新建退库-编辑草稿-头部
  DRUG_OUTPUT_REFUND_EDITDRAFT_TAB:`/a/commonback/backdetail/editDraft`,//退库管理-新建退库-编辑草稿-tab
  DRUG_OUTPUT_REFUND_EDIT_HEAD:`/a/commonback/backdetail/editDraft`,//退库管理-新建退库-编辑单据-详情头部&table
  DRUG_OUTPUT_REFUND_DETAILHEAD:`/a/commonback/back/info`,//退库管理-详情头部&table
  DRUG_OUTPUT_WITHDRAW_DEPT_LIST:`/a/common/pickingorder/findAllDepts`,//基数药补货-申领部门
  /**
   * @author QER
   * @date 2019/12/29
   * @Description: 药房-补登单据
  */
  DRUG_SUPPLEMENTDOC_LIST:`/a/roommakeup/makeup/list`,//补登单据-查询列表
  DRUG_SUPPLEMENTDOC_CHECK_LIST:`/a/common/outstore/list`,//补登单据-复核-查询列表
  DRUG_SUPPLEMENTDOC_DETAILHEAD:`/a/roommakeup/makeup/info`,//补登单据-详情头部&table
  DRUG_SUPPLEMENTDOC_OUTBII_DEPT:`/a/his/dept/getAllDeptByCondition`,//补登出库-获取科室
  DRUG_SUPPLEMENTDOC_OUTBII_DRUG_LIST:`/a/roomlocadjust/roomDrugList`,//补登出库-获取弹窗药品
  DRUG_SUPPLEMENTDOC_INBII_DRUG_LIST:`/a/roommakeupdetail/makeupdetail/addlist`,//补登入库-获取弹窗药品
  DRUG_SUPPLEMENTDOC_INBII_DRUG_LIST2:`/a/medHisBackDetail/medhisbackdetail/selectList`,//补登入库-获取弹窗药品
  DRUG_SUPPLEMENTDOC_MAKE_LIST:`/a/bill/balance/make/list`,//异常发药单处理
  DRUG_SUPPLEMENTDOC_MAKE_DETAILHEAD:`/a/bill/balance/make/detail`,//异常发药单处理-详情头部&table
  DRUG_SUPPLEMENTDOC_MAKE_MODALIST:`/a/bill/balance/billFlowBadVoList`,//异常发药单弹窗
  /**
   * @author QER
   * @date 2020/1/2
   * @Description: 药房-复核
  */
  DRUG_REVIEW_LIST:`/a/common/outstore/list`,//补登单据-查询列表
  DRUG_REVIEW_PRINT:`${route}/a/outStoreDetail/print/printDetail`,//复核-打印
  DRUG_REVIEW_A4_PRINT:`${route}/a/outStoreDetail/print/printDetailA4`,//复核-A4打印
  DRUG_REVIEW_DEPT_LIST:`/a/common/outstore/findAllDepts`,//基数药补货-申领部门
  DRUG_REVIEW_DETAILHEAD:`/a/common/outstoredetail/detailInfo`,//拣货下架-详情头部
  DRUG_REVIEW_DETAILTAB:`/a/common/outstoredetail/outStoreDetailList`,//拣货下架-详情列表
  /**
   * @author QER
   * @date 2020/1/6
   * @Description: 药房-锁定
  */
  DRUG_OUTPUT_LOCKED_LIST:`/a/roomrecall/lockList`,//锁定-查询列表
  DRUG_OUTPUT_LOCKED_CHECK_LIST:`/a/roomrecall/lockSheveList`,//锁定-审核-查询列表
  DRUG_OUTPUT_LOCKED_ADD_DRUG_LIST:`/a/roomrecalldetail/selectLockProduct`,//新建锁定-查询药品
  DRUG_OUTPUT_LOCKED_DETAILHEAD:`/a/roomrecall/getDetail`,//锁定-详情头部&table
  /**
   * @author QER
   * @date 2020/1/8
   * @Description: 药房-货位移动
  */
  GOODS_ADJUST_LIST:`/a/roomlocadjust/list`,//货位移动-查询列表
  GOODS_ADJUST_DETAILHEAD:`/a/roomlocadjust/detail`,//货位移动-查询列表
  GOODS_ADJUST_ADD_DRUG_LIST:`/a/roomlocadjust/roomDrugList`,//新建-货位移动-查询药品
  GOODS_ADJUST_SEARCH_LOC_LIST:`/a/roomlocadjust/queryTargetLocation`
}
export  default  pharmacyApi;
