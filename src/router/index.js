import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);

const _imports=files=>()=>import(`@/page/${files}.vue`)
export const RouterMap=[
  {
    path: '/login',
    name: '登录',
    component: _imports('login/login')
  },
  {
    path: '/',
    name: '批号调整',
    component: _imports('home/home'),
    iconCls: 'ios-home',
    children: [
      {
        path: 'purchase/batchAdjust/editBatch',
        name: '批号调整',
        component: _imports('purchase/edit-batch')
      },
      {
        path: 'purchase/batchAdjust/editBatch/add',
        name: '批号调整-新增',
        component: _imports('purchase/edit-batch-add'),
        meta: { backIcon:true}//判断返回按钮是否显示
      },
      {
        path: 'purchase/batchAdjust/editBatchCheck',
        name: '批号审核',
        meta: { checkBill:true},
        component: _imports('purchase/edit-batch')
      },
    ],
  },
  {
    path: '/',
    name: '菜单管理',
    component: _imports('home/home'),
    iconCls: 'ios-home',
    children: [
      {
        path: '/sys/menu/menuMgt',
        name: '菜单管理',
        component: _imports('system/menu-management')
      },
      {
        path: 'menu-managementAdd',
        name: '菜单管理-新增',
        component: _imports('system/menu-management-add'),
        meta: { backIcon:true}//判断返回按钮是否显示
      },
      {
        path: 'sys/menu/dictMgt',
        name: '字典管理',
        component: _imports('system/dic-management')
      },
      {
        path: 'sys/menu/interfacelog',
        name: '接口监控',
        component: _imports('system/interfacelog')
      },
    ],
  },
    {
    path: '/',
    name: '组织机构',
    component: _imports('home/home'),
    iconCls: 'ios-home',
    children: [
      {
        path: 'sys/organization/supplierMgt',
        name: '供应商管理',
        component: _imports('system/supplier-list')
      },
      {
        path: 'sys/organization/departmentMgt',
        name: '部门管理',
        component: _imports('system/dept-management')
      },
      {
        path: 'sys/organization/departmentMgt/edit',
        name: '部门管理-详情',
        component: _imports('system/dept-management-edit')
      },
      {
        path: 'sys/organization/userMgt',
        name: '用户管理',
        component: _imports('system/users-management')
      },
      {
        path: 'sys/organization/userMgt/add',
        name: '用户管理-详情',
        component: _imports('system/users-management-add'),
        meta: { backIcon:true}//判断返回按钮是否显示
      },
    ],
  },
  {
    path: '/',
    name: '角色管理',
    component: _imports('home/home'),
    iconCls: 'ios-home',
    children: [
      {
        path: 'sys/role/roleMgt',
        name: '角色管理',
        component: _imports('system/role-management')
      },
      {
        path: '/sys/role/roleMgt/add',
        name: '角色管理-详情',
        component: _imports('system/role-management-add'),
        meta: { backIcon:true}//判断返回按钮是否显示
      },
    ],

  },
  {
    path: '/',
    name: '药房功能',
    component: _imports('home/home'),
    iconCls: 'ios-home',
    children: [
      /**
       * @author QER
       * @date 2019/12/20
       * @Description: 入库部分功能 START
      */

      {
        path: 'pharmacy/wareHouse/drugsFor',
        name: '药品申领',
        component: _imports('pharmacy/drug-apply')
      },
      {
        path: 'pharmacy/wareHouse/drugsFor/add',
        name: '新建申领',
        component: _imports('pharmacy/drug-apply-add'),
        meta: { backIcon:true}//判断返回按钮是否显示
      },
      {
        path: 'pharmacy/wareHouse/drugsFor/detail',
        name: '申领-单据信息',
        component: _imports('pharmacy/drug-apply-detail'),
        meta: { backIcon:true}//判断返回按钮是否显示
      },
      {
        path: 'pharmacy/wareHouse/acceptance',
        name: '入库验收',
        component: _imports('pharmacy/drug-ware-house')
      },
      {
        path: '/pharmacy/wareHouse/acceptance/detail',
        name: '入库验收-单据信息',
        component: _imports('pharmacy/drug-wareHouse-add'),
        meta: { backIcon:true}//判断返回按钮是否显示
      },
      {
        path: 'pharmacy/wareHouse/acceptance/add',
        name: '新建验收',
        component: _imports('pharmacy/drug-wareHouse-add'),
        meta: { backIcon:true}//判断返回按钮是否显示
      },
      {
        path: 'pharmacy/wareHouse/putaway',
        name: '入库上架',
        component: _imports('pharmacy/drug-put-away')
      },
      {
        path: 'pharmacy/wareHouse/putaway/detail',
        name: '入库上架-单据信息',
        component: _imports('pharmacy/drug-wareHousePut-detail'),
        meta: { backIcon:true}//判断返回按钮是否显示
      },
      {
        path: 'pharmacy/wareHouse/newLibrary',
        name: '入库查询',
        component: _imports('pharmacy/drug-wareHouse-search')
      },
      {
        path: 'pharmacy/wareHouse/newLibrary/detail',
        name: '入库查询-单据信息',
        component: _imports('pharmacy/drug-wareHouseSea-detail'),
        meta: { backIcon:true}//判断返回按钮是否显示
      },
      /**
       * @author QER
       * @date 2019/12/20
       * @Description: 出库部分功能 START
       */
      {
        path: 'pharmacy/outStorage/output',
        name: '发药查询',
        component: _imports('pharmacy/drug-output-search'),
        meta: { infoTel:true}//详情组件显示返回按钮
      },
      {
        path: 'pharmacy/outStorage/review',
        name: '发药复核',
        component: _imports('pharmacy/drug-output-review'),
      },
      {
        path: 'pharmacy/outStorage/review/detail',
        name: '发药复核-单据信息',
        component: _imports('pharmacy/drugOut-review-detail'),
      },
      {
        path: 'pharmacy/outStorage/baseReplen',
        name: '基数药补货',
        component: _imports('pharmacy/drug-output-baseReplen'),
        meta: { infoTel:true}//详情组件显示返回按钮
      },
      {
        path: 'pharmacy/outStorage/baseReplen/add',
        name: '新建-基数药补货',
        component: _imports('pharmacy/drug-baseReplen-add'),
        meta: { backIcon:true}//判断返回按钮是否显示
      },
      {
        path: 'pharmacy/outStorage/newOut',
        name: '调拨出库',
        component: _imports('pharmacy/drug-output-baseReplen'),
        meta: { infoTel:true,check:true}//详情组件显示返回按钮
      },
      {
        path: 'pharmacy/outStorage/newOut/add',
        name: '新建-调拨出库单',
        component: _imports('pharmacy/drug-baseReplen-add'),
        meta: { backIcon:true,check:true}//判断返回按钮是否显示
      },
      {
        path: 'pharmacy/outStorage/acceptDistribution',
        name: '配货出库',
        component: _imports('pharmacy/drug-output-acceptDis'),
        meta: { infoTel:true}//详情组件显示返回按钮
      },
      {
        path: 'pharmacy/outStorage/acceptDistribution/detail',
        name: '配货出库-单据信息',
        component: _imports('pharmacy/drug-output-acceptDis-detail'),
        meta: { infoTel:true,backIcon:true}//详情组件显示返回按钮
      },
      {
        path: 'pharmacy/outStorage/pickingUnderShelve',
        name: '拣货下架',
        component: _imports('pharmacy/drug-output-pickingUnder')
      },
      {
        path: 'pharmacy/outStorage/pickingUnder/detail',
        name: '拣货下架-单据信息',
        component: _imports('pharmacy/drug-pickingUnder-detail'),
        meta: { backIcon:true}//判断返回按钮是否显示
      },
      /**
       * @author QER
       * @date 2019/12/25
       * @Description: 退库管理
      */
      {
        path: 'pharmacy/outStorage/refund',
        name: '新建退库',
        component: _imports('pharmacy/drug-output-refund'),
        meta: { infoTel:true}//详情组件显示返回按钮
      },
      {
        path: 'pharmacy/outStorage/refund/add',
        name: '新建退单库',
        component: _imports('pharmacy/drug-outputRefund-add'),
        meta: { backIcon:true}//详情组件显示返回按钮
      },
      {
        path: 'pharmacy/outStorage/withdraw',
        name: '退库下架',
        component: _imports('pharmacy/drug-output-withdraw'),
      },
      {
        path: 'pharmacy/outStorage/withdraw/detail',
        name: '退库下架',
        component: _imports('pharmacy/drug-pickingUnder-detail'),
        meta: {backIcon:true}
      },
      /*退库管理 end*/
      {
        path: 'pharmacy/supplementDoc/supplementDocuments',
        name: '补登单据',
        component: _imports('pharmacy/supplement-documents'),
        meta: { infoTel:true}//详情组件显示返回按钮
      },
      {
        path: 'pharmacy/supplementDoc/supplementDocuments/add',
        name: '添加补登单据',
        component: _imports('pharmacy/supplement-documents-add'),
        meta: {backIcon:true}
      },
      {
        path: 'pharmacy/supplementDoc/exceptionHandling',
        name: '异常发药单处理',
        component: _imports('pharmacy/supplement-exception'),
        meta: { infoTel:true}//详情组件显示返回按钮
      },
      {
        path: 'pharmacy/configMgt/salvageList',
        name: '抢救车目录管理',
        component: _imports('pharmacy/salvage-list'),
        meta: { infoTel:true}//详情组件显示返回按钮
      },
      {
        path: 'pharmacy/configMgt/salvageList/add',
        name: '目录管理',
        component: _imports('pharmacy/salvage-add'),
      },
      //单据复核
      {
        path: 'pharmacy/outStorage/pharmacyReview',
        name: '单据复核',
        component: _imports('pharmacy/drug-review')
      },
      {
        path: 'pharmacy/outStorage/pharmacyReview/detail',
        name: '复核信息',
        component: _imports('pharmacy/drug-review-detail'),
        meta: { backIcon:true}//判断返回按钮是否显示
      },
      //补登单据复核
      {
        path: 'pharmacy/supplementDoc/supplementDocCheck',
        name: '补登单据复核',
        component: _imports('pharmacy/supplement-documents'),
        meta: { infoTel:true,check:true}//详情组件显示返回按钮
      },
      /**
       * @author QER
       * @date 2020/1/2
       * @Description: 盘点审核
      */
      {
        path: 'pharmacy/checkDecrease/newInventory',
        name: '新建盘点',
        component: _imports('drugStorage/new-inventory')
      },
      {
        path: 'pharmacy/checkDecrease/newInventory/details',
        name: '新建盘点明细',
        component: _imports('drugStorage/new-inventory-detail')
      },
      {
        path: 'pharmacy/checkDecrease/inventoryAudit',
        name: '盘点审核',
        component: _imports('drugStorage/inventory-audit')
      },
      {
        path: 'pharmacy/checkDecrease/inventoryAudit/details',
        name: '盘点审核明细',
        component: _imports('drugStorage/inventory-audit-detail')
      },
      {
        path: 'pharmacy/checkDecrease/afterAdjustment',
        name: '盘后调整',
        component: _imports('drugStorage/after-adjustment')
      },
      {
        path: 'pharmacy/checkDecrease/afterAdjustment/details',
        name: '盘后调整明细',
        component: _imports('drugStorage/after-adjustment-detail')
      },
      {
        path: 'pharmacy/checkDecrease/profiLossRecord',
        name: '损益记录',
        component: _imports('drugStorage/profi-loss-record')
      },
      {
        path: 'pharmacy/checkDecrease/profiLossRecord/details',
        name: '损益记录明细',
        component: _imports('drugStorage/profi-loss-record-detail')
      },
      //锁定
      {
        path: 'pharmacy/outStorage/locked',
        name: '锁定',
        component: _imports('pharmacy/drug-output-locked'),
        meta: { infoTel:true}//详情组件显示返回按钮
      },
      {
        path: 'pharmacy/outStorage/locked/add',
        name: '新建-锁定单据',
        component: _imports('pharmacy/drug-output-locked-add'),
        meta: { backIcon:true}//判断返回按钮是否显示
      },
      {
        path: 'pharmacy/outStorage/lockedCheck',
        name: '锁定审核',
        component: _imports('pharmacy/drug-output-locked'),
        meta: { infoTel:true,check:true}//详情组件显示返回按钮
      },
      {
        path: 'pharmacy/goodsAdjust/adjust',
        name: '货位移动',
        component: _imports('pharmacy/goods-adjust'),
        meta: { infoTel:true,check:true}//详情组件显示返回按钮
      },
      {
        path: 'pharmacy/goodsAdjust/adjust/add',
        name: '新建-货位移动',
        component: _imports('pharmacy/goods-adjust-add'),
        meta: { backIcon:true}//详情组件显示返回按钮
      },
      //统计分析
      {
        path: 'purchase/factorSearch/warehousing',
        name: '入库单药品资质查询',
        meta: { drug:true},
        component: _imports('factorSearch/drug-storage-drug')
      },
      {
        path: 'pharmacy/stockMgt/nearlyEffective',
        name: '近效期查询',
        component: _imports('statisticAnalysis/nearly-effective')
      },
      {
        path: 'purchase/statisticAnalysis/stagnantDrugs',
        name: '呆滞库存查询',
        component: _imports('statisticAnalysis/dull-drugs')
      },
      {
        path: 'pharmacy/stockMgt/drugLedger',
        name: '药品台账',
        component: _imports('statisticAnalysis/drug-ledgernew')
      },
      {
        path: 'pharmacy/stockMgt/drugLedgernew',
        name: '药品台账',
        component: _imports('statisticAnalysis/drug-ledgernew')
      },
      {
        path: 'pharmacy/stockMgt/profitLoss',
        name: '损益分析',
        component: _imports('statisticAnalysis/drug-ledgernew')
      },
      {
        path: 'pharmacy/stockMgt/supplierRank',
        name: '供应商排行',
        component: _imports('statisticAnalysis/supplier-rank')
      },
      //西药库
      {
        path: 'drugStorage/stockMgt/nearlyEffective',
        name: '近效期查询',
        component: _imports('statisticAnalysis/nearly-effective')
      },
      {
        path: 'drugStorage/stockMgt/profitLoss',
        name: '损益分析',
        component: _imports('statisticAnalysis/drug-ledgernew')
      },
      {
        path: 'drugStorage/stockMgt/settlementAnalysis',
        name: '结算分析',
        component: _imports('statisticAnalysis/settlement-analysis')
      },
    ],

  },
  {
    path: '/statisticAnalysis',
    name: '统计分析',
    component: _imports('home/home'),
    iconCls: 'ios-paw',
    children: [
      {
        path: '/purchase/statisticAnalysis/stockInquiry',
        name: '库存查询',
        component: _imports('statisticAnalysis/stock-inquiry')
      },
      {
        path: '/purchase/statisticAnalysis/stockInquiry/details',
        name: '库存查询明细',
        component: _imports('statisticAnalysis/stock-inquiry-detail')
      },
      {
        path: '/purchase/statisticAnalysis/stockBalance',
        name: '移库消耗统计',
        component: _imports('statisticAnalysis/stock-balance')
      },
      {
        path: '/purchase/statisticAnalysis/settlementAnalysis',
        name: '结算分析',
        component: _imports('statisticAnalysis/settlement-analysis')
      },
      {
        path: '/purchase/statisticAnalysis/drugLedger',
        name: '药品台账',
        component: _imports('statisticAnalysis/drug-ledgernew')
      },
      {
        path: '/purchase/statisticAnalysis/drugLedgernew',
        name: '药品台账(新)',
        component: _imports('statisticAnalysis/drug-ledgernew')
      },
      {
        path: '/purchase/statisticAnalysis/nearlyEffective',
        name: '近效期查询',
        component: _imports('statisticAnalysis/nearly-effective')
      },
      {
        path: '/purchase/statisticAnalysis/profitLoss',
        name: '损益分析',
        component: _imports('statisticAnalysis/profit-loss')
      },
      {
        path: '/purchase/statisticAnalysis/profitLoss/details',
        name: '损益分析明细',
        component: _imports('statisticAnalysis/profit-loss-detail')
      },
      {
        path: '/purchase/statisticAnalysis/stagnantDrugs',
        name: '呆滞库存查询',
        component: _imports('statisticAnalysis/stagnant-drugs')
      },
      {
        path: '/purchase/statisticAnalysis/reloConsume',
        name: '移库消耗统计',
        component: _imports('statisticAnalysis/relo-consume')
      },
      {
        path: '/purchase/statisticAnalysis/comparison',
        name: '库存对比',
        component: _imports('statisticAnalysis/comparison')
      },
      {
        path: '/purchase/statisticAnalysis/unsettledDrugs',
        name: '未结算对账药品查询',
        component: _imports('statisticAnalysis/unsettled-drugs')
      },
      {
        path: '/purchase/statisticAnalysis/sectionAnalysis',
        name: '科室退库分析',
        component: _imports('statisticAnalysis/section-analysis')
      },
      // {
      //   // path: '/purchase/statisticAnalysis/sectionAnalysis',
      //   path: '/drugStorage/stockMgt/sectionAnalysis',
      //   name: '科室退库分析',
      //   component: _imports('statisticAnalysis/section-analysis')
      // },
      {
        path: '/purchase/statisticAnalysis/orderFulfillment',
        name: '订单执行情况',
        component: _imports('statisticAnalysis/order-fulfillment')
      },
      {
        path: '/purchase/statisticAnalysis/orderFulfillment/details',
        name: '订单执行情况明细',
        component: _imports('statisticAnalysis/order-fulfillment-detail')
      },
      {
        path: '/purchase/statisticAnalysis/orderRetrospect',
        name: '订单追溯',
        component: _imports('statisticAnalysis/order-retrospect')
      },
      {
        path: '/purchase/statisticAnalysis/orderRetrospect/details',
        name: '订单追溯明细',
        component: _imports('statisticAnalysis/order-retrospect-detail')
      },
      {
        path: '/purchase/statisticAnalysis/supplierRank',
        name: '供应商排行',
        component: _imports('statisticAnalysis/supplier-rank')
      },
      {
        path: '/purchase/statisticAnalysis/supplierSupply',
        name: '供应商供货分析',
        component: _imports('statisticAnalysis/supplier-supply')
      },
      {
        path: '/purchase/statisticAnalysis/supplierReturn',
        name: '供应商退货分析',
        component: _imports('statisticAnalysis/supplier-return')
      },
      {
        path: '/purchase/statisticAnalysis/financialTarget',
        name: '财务指标',
        component: _imports('statisticAnalysis/financial-target')
      },
      {
        path: '/purchase/statisticAnalysis/performanceInfo',
        name: '绩效信息表',
        component: _imports('statisticAnalysis/performanceInfo')
      },
      {
        path: '/purchase/statisticAnalysis/batch',
        name: '批号追溯',
        component: _imports('statisticAnalysis/batch')
      },
      {
        path: '/purchase/statisticAnalysis/batch/details',
        name: '批号追溯明细',
        component: _imports('statisticAnalysis/batch-detail')
      },
      {
        path: '/purchase/statisticAnalysis/modifyPrice',
        name: '调价查询',
        component: _imports('statisticAnalysis/modify-price')
      },
      {
        path: '/purchase/statisticAnalysis/modifyPrice/details',
        name: '调价查询明细',
        component: _imports('statisticAnalysis/modify-price-detail')
      },
      {
        path: '/purchase/statisticAnalysis/patientTracing',
        name: '患者追溯',
        component: _imports('statisticAnalysis/patient-tracing')
      },
      {
        path: '/purchase/statisticAnalysis/patientTracing/details',
        name: '患者追溯明细',
        component: _imports('statisticAnalysis/patient-tracing-detail')
      },
      {
        path: '/purchase/statisticAnalysis/statisticsTraceability',
        name: '同比环比统计',
        component: _imports('statisticAnalysis/statistics-traceability')
      },
      {
        path: '/purchase/statisticAnalysis/statisticsTraceability/detailsList',
        name: '同比环比统计明细',
        component: _imports('statisticAnalysis/statistics-traceability-list')
      },
      {
        path: '/purchase/statisticAnalysis/statisticsTraceability/details',
        name: '同比环比统计明细',
        component: _imports('statisticAnalysis/statistics-traceability-list-detail')
      },
      {
        path: '/purchase/statisticAnalysis/personWorkStatistics',
        name: '人员工作统计',
        component: _imports('statisticAnalysis/person-work-statistics')
      },
      {
        path: '/purchase/statisticAnalysis/tracing',
        name: '补货单',
        component: _imports('statisticAnalysis/tracing')
      },
      {
        path: '/purchase/statisticAnalysis/tracing/details',
        name: '补货单明细',
        component: _imports('statisticAnalysis/tracing-detail')
      },
      {
        path: '/purchase/statisticAnalysis/acceptanceTotalList',
        name: '验收单明细',
        component: _imports('statisticAnalysis/acceptance-total-list')
      },
      {
        path: '/purchase/statisticAnalysis/lowerShelf',
        name: '下架',
        component: _imports('statisticAnalysis/lower-shelf')
      },
      {
        path: '/purchase/statisticAnalysis/outgoingReview',
        name: '出库复核',
        component: _imports('statisticAnalysis/outgoing-review')
      },
      {
        path: '/purchase/statisticAnalysis/inventory',
        name: '盘点',
        component: _imports('statisticAnalysis/inventory')
      },
      {
        path: '/purchase/statisticAnalysis/drugRechecking',
        name: '发药复核',
        component: _imports('statisticAnalysis/drug-rechecking')
      },
      ]
  },
  {
    path: '/',
    name: '工作台',
    component: _imports('home/home'),
    iconCls: 'ios-home',
    children: [
      {
        name: '工作台',//药学科-工作台
        path: '/purchase/workbenchMenu/workbench',
        component: _imports('workbenchMenu/workbench')
      },
      {
        path: '/drugStorage/workbenchMenu/workbench',
        name: '工作台',//药库-工作台
        component: _imports('workbenchMenu/workbench')
      },
      {
        path: '/pharmacy/workbenchMenu/workbench',
        name: '工作台',//药房-工作台
        component: _imports('workbenchMenu/workbench')
      }
    ],
  },
  {
    path: '/',
    name: '药品目录',
    component: _imports('home/home'),
    iconCls: 'ios-home',
    children: [
      {
        name: '药品目录',//药学科-药品目录-药品目录
        path: '/sys/drugDirectory/directory',
        component: _imports('drugDirectory/drug-directory')
      },
      {
        name: '药品目录明细',//药学科-药品目录-药品目录明细页面
        path: '/sys/drugDirectory/directory/detail',
        component: _imports('drugDirectory/drug-directory-detail')
      },
      {
        name: '部门药品管理',//药学科-药品目录-部门药品管理
        path: '/sys/deptDrugControl/directory',
        component: _imports('drugDirectory/dept-drug-control')
      },
      {
        name: '部门药品管理明细',//药学科-药品目录-部门药品管理明细页
        path: '/sys/deptDrugControl/directory/detail',
        component: _imports('drugDirectory/dept-drug-control-detail')
      },
      {
        name: '药品目录',//药库-配置管理-药品目录
        path: '/drugStorage/configMgt/drugDirectory',
        component: _imports('drugDirectory/dept-drug-control')
      },
      {
        name: '药品目录',//药房-配置管理-药品目录
        path: '/pharmacy/configMgt/drugDirectory',
        component: _imports('drugDirectory/dept-drug-control')
      },
      {
        name: '基数药目录管理',//药学科-药品目录-基数药目录管理
        path: '/sys/configMgt/baseMgt',
        component: _imports('drugDirectory/base-drug-control'),
        meta: { baseMgt:1}
      },
      {
        name: '基数药目录管理',//药学科-药品目录-基数药目录管理明细页
        path: '/sys/configMgt/baseMgt/detail',
        component: _imports('drugDirectory/base-drug-control-detail')
      },
      {
        name: '基数药目录管理',//药房-配置管理-基数药目录管理
        path: '/pharmacy/configMgt/baseMgt',
        component: _imports('drugDirectory/base-drug-control')
      },
      {
        name: '供应商药品',//药学科-药品目录-供应商药品
        path: '/sys/drugDirectory/supplierDrugs',
        component: _imports('drugDirectory/supplier-drug')
      },
      {
        name: '供应商药品明细',//药学科-药品目录-供应商药品
        path: '/sys/drugDirectory/supplierDrugs/detail',
        component: _imports('drugDirectory/supplier-drug-detail')
      }
    ],
  },
  {
    path: '/',
    name: '药学科菜单',
    component: _imports('home/home'),
    iconCls: 'ios-home',
    children: [
      {
        name: '调价确认',//药学科-药品调价-确认调价
        path: '/purchase/drugPricing/pricingConfirmation',
        component: _imports('purchase/pricing-confirmation')
      },
      {
        name: '调价确认明细',//药学科-药品调价-确认调价明细
        path: '/purchase/drugPricing/pricingConfirmation/detail',
        component: _imports('purchase/pricing-confirmation-detail')
      },
      {
        name: '补货计划',//药学科-补货计划-补货计划
        path: '/purchase/replenishment/replenishmentPlan',
        component: _imports('purchase/replenishment-plan-replenishment')
      },
      {
        name: '补货计划',//药学科-补货计划-补货计划
        path: '/purchase/replenishment/replenishmentPlan/details',
        component: _imports('purchase/replenishment-plan-replenishment-detail')
      },
      {
        name: '目录外补货',//药学科-补货计划-目录外补货
        path: '/purchase/replenishment/outCatalogPurchase',
        component: _imports('purchase/out-catalog-purchase-replenishment')
      },
      {
        name: '欠品补货',//药学科-欠品补货-欠品补货
        path: '/purchase/replenishment/shortage',
        component: _imports('purchase/shortage')
      },
      {
        name: '采购计划',//药学科-自采管理-采购计划
        path: '/purchase/sinceMining/replenishmentPlan',
        component: _imports('purchase/replenishment-plan-mining')
      },
      {
        name: '采购计划明细',//药学科-补货计划-补货计划
        path: '/purchase/sinceMining/replenishmentPlan/details',
        component: _imports('purchase/replenishment-plan-mining-detail')
      },
      {
        name: '目录外采购',//药学科-自采管理-目录外采购
        path: '/purchase/sinceMining/outCatalogPurchase',
        component: _imports('purchase/out-catalog-purchase-mining')
      },
      {
        name: '计划审核',//药学科-计划审核-计划审核
        path: '/purchase/replenishment/planCheck',
        component: _imports('purchase/plan-check')
      },
      {
        name: '计划审核明细',//药学科-计划审核-计划审核
        path: '/purchase/replenishment/planCheck/details',
        component: _imports('purchase/plan-check-detail')
      },
      {
        name: '自采计划审核',//药学科-计划审核-自采计划审核
        path: '/purchase/replenishment/sinceMiningPlanCheck',
        component: _imports('purchase/since-mining-plan-check')
      },
      {
        name: '自采计划审核明细',//药学科-补货计划-补货计划
        path: '/purchase/replenishment/sinceMiningPlanCheck/details',
        component: _imports('purchase/since-mining-plan-check-detail')
      },
      {
        name: '订单发送',//药学科-订单管理-订单发送
        path: '/purchase/replenishment/planOrder',
        component: _imports('purchase/plan-order')
      },
      {
        name: '订单发送明细',//药学科-订单管理-订单发送
        path: '/purchase/replenishment/planOrder/details',
        component: _imports('purchase/plan-order-detail')
      },
      {
        name: '订单作废',//药学科-订单管理-订单发送
        path: '/purchase/replenishment/voidOrder',
        component: _imports('purchase/void-order')
      },
      {
        name: '日对账单',//药学科-结算管理-日对账单
        path: '/purchase/settlementMgt/dayStatements',
        component: _imports('purchase/settlement-day-statements')
      },
      {
        name: '生成对账单',//药学科-结算管理-生成日对账单
        path: '/purchase/settlementMgt/dayStatements/add',
        meta: { backIcon:true},//判断返回按钮是否显示
        component: _imports('purchase/settlement-day-statements-add')
      },
      {
        name: '日对账单明细',//药学科-结算管理-日对账单-明细
        path: '/purchase/settlementMgt/dayStatements/details',
        component: _imports('purchase/settlement-day-statements-detail')
      },
      {
        name: '结算单',//药学科-结算管理-结算单
        path: '/purchase/settlementMgt/statements',
        component: _imports('purchase/settlement-statements')
      },
      {
        name: '结算单',//药学科-结算管理-结算单-明细
        path: '/purchase/settlementMgt/statements/details',
        component: _imports('purchase/settlement-statements-detail')
      },
      {
        name: '生成结算单',//药学科-结算管理-结算单
        path: '/purchase/settlementMgt/createSettle',
        component: _imports('purchase/create-settle')
      },

    ]
   },
   {
    path: '/',
    name: '入库管理',
    component: _imports('home/home'),
    iconCls: 'ios-home',
    children: [
      {
        path: '/drugStorage/wareHouse/psListCheck',
        name: '入库验收',
        component: _imports('drugStorage/warehousing-acceptance')
      },
      // {
      //   path: '/warehousingAcceptanceDetail/:id',
      //   name: '入库验收明细',
      //   component: _imports('drugStorage/warehousing-acceptance-detail')
      // },
      {
        path: '/drugStorage/wareHouse/psListCheck/detail',
        name: '入库验收明细',
        component: _imports('drugStorage/warehousing-acceptance-detail')
      },
      {
        path: '/drugStorage/wareHouse/grounding',
        name: '入库上架',
        component: _imports('drugStorage/warehousing-upper-shelf')
      },
      {
        path: '/drugStorage/wareHouse/grounding/detail',
        name: '入库上架明细',
        component: _imports('drugStorage/warehousing-upper-shelf-detail')
      },
      {
        path: '/drugStorage/wareHouse/wareHouseReceiptMgt',
        name: '入库查询',
        component: _imports('drugStorage/warehousing-inquiries')
      },
      {
        path: '/drugStorage/wareHouse/wareHouseReceiptMgt/detail',
        name: '入库查询明细',
        component: _imports('drugStorage/warehousing-inquiries-detail')
      },
    ],
  },
   {
    path: '/',
    name: '出库管理',
    component: _imports('home/home'),
    iconCls: 'ios-home',
    children: [
      {
        path: '/drugStorage/outStorage/withdraw',
        name: '手工出库',
        component: _imports('outgoingManagement/manual-export')
      },
      {
        path: '/drugStorage/outStorage/withdraw/details',
        name: '手工出库明细',
        component: _imports('outgoingManagement/manual-export-detail')
      },
       {
        path: '/drugStorage/outStorage/acceptDistribution',
        name: '配货出库',
        component: _imports('outgoingManagement/distribution-and-warehousing')
      },
      {
        path: '/drugStorage/outStorage/acceptDistribution/detail',
        name: '配货出库明细',
        component: _imports('outgoingManagement/distribution-and-warehousing-detail')
      },
      {
        path: '/drugStorage/outStorage/pickingUnderShelve',
        name: '拣货下架',
        component: _imports('outgoingManagement/picking-under-shelve')
      },
      {
        path: '/drugStorage/outStorage/pickingUnderShelve/detail',
        name: '拣货下架明细',
        component: _imports('outgoingManagement/picking-under-shelve-detail')
      }
    ],
    // meta: { login: true,keepAlive:true}
  },
   {
    path: '/',
    name: '退供应商',
    component: _imports('home/home'),
    iconCls: 'ios-home',
    children: [
      {
        path: '/drugStorage/outStorage/backStorage',
        name: '新建退货',
        component: _imports('drugStorage/back-storage')
      },
      {
        path: '/drugStorage/outStorage/backStorage/details',
        name: '新建退货明细',
        component: _imports('drugStorage/back-storage-detail')
      },
      {
        path: '/drugStorage/outStorage/acceptAnyReturns',
        name: '退货下架',
        component: _imports('drugStorage/acceptAny-returns')
      },
      {
        path: '/drugStorage/outStorage/acceptAnyReturns/details',
        name: '退货下架明细',
        component: _imports('drugStorage/acceptAny-returns-detail')
      },
    ],
    // meta: { login: true,keepAlive:true}
  },
   {
    path: '/',
    name: '单据复核',
    component: _imports('home/home'),
    iconCls: 'ios-home',
    children: [
     //西药库
      {
        path: '/drugStorage/outStorage/outReceiptMgt',
        name: '出库/退货复核',
        component: _imports('drugStorage/out-receipt-mgt')
      },
      {
        path: '/drugStorage/outStorage/outReceiptMgt/details',
        name: '出库/退货复核明细',
        component: _imports('drugStorage/out-receipt-mgt-detail')
      },
      //药学科
      {
        path: '/purchase/supplementDoc/outReceiptMgt',
        name: '药库出库/退货复核',
        component: _imports('drugStorage/purchase-out-receipt-mgt')
      },
      {
        path: '/purchase/supplementDoc/outReceiptMgt/details',
        name: '药库出库/退货复核明细',
        component: _imports('drugStorage/purchase-out-receipt-mgt-detail')
      },
      //药学科 全院管理
      {
        path: '/purchase/supplementDoc/pharmacyReview',
        name: '出库/退库复核',
        component: _imports('drugStorage/sup-pharmacy-review')
      },
      {
        path: '/purchase/supplementDoc/pharmacyReview/details',
        name: '出库/退库复核明细',
        component: _imports('drugStorage/sup-pharmacy-review-detail')
      },
      {
        path: '/purchase/supplementDoc/supplementDocCheck',
        name: '补登单据复核',
        component: _imports('drugStorage/supplement-doc-check')
      },
      {
        path: '/purchase/supplementDoc/supplementDocCheck/details',
        name: '补登单据复核明细',
        component: _imports('drugStorage/supplement-doc-check-detail')
      },
      {
        path: '/purchase/supplementDoc/dispensing',
        name: '发药单补登',
        component: _imports('drugStorage/dispensing')
      },
      {
        path: '/purchase/supplementDoc/dispensing/details',
        name: '发药单补登明细',
        component: _imports('drugStorage/dispensing-detail')
      },


    ],
    // meta: { login: true,keepAlive:true}
  },

      {
    path: '/',
    name: '补登单据',
    component: _imports('home/home'),
    iconCls: 'ios-home',
    children: [

      {
        path: '/pharmacy/supplementDoc/exceptionHandling',
        name: '异常发药单处理',
        component: _imports('drugStorage/exception-handling')
      },
      {
        path: '/pharmacy/supplementDoc/exceptionHandling/details',
        name: '异常发药单处理明细',
        component: _imports('drugStorage/exception-handling-detail')
      }
    ],
  },
    {
    path: '/',
    name: '供应商资质查询',
    component: _imports('home/home'),
    iconCls: 'ios-home',
    children: [
      {
        path: '/purchase/factorSearch/drug',
        name: '药品资质',
        component: _imports('factorSearch/drug-storage-drug')
      },
      {
        path: '/purchase/factorSearch/supplier',
        name: '企业资质',
        component: _imports('factorSearch/drug-storage-supplier')
      },
      //西药库
      {
        path: '/drugStorage/supplierFactor/drug',
        name: '药品资质',
        component: _imports('factorSearch/drug-storage-drug')
      },
      {
        path: '/drugStorage/supplierFactor/supplier',
        name: '企业资质',
        component: _imports('factorSearch/drug-storage-supplier')
      }
    ],
  },
  {
    path: '/',
    name: '召回',
    component: _imports('home/home'),
    iconCls: 'ios-home',
    children: [
      {
        path: '/drugStorage/outStorage/recallAndLocked',
        name: '召回',
        component: _imports('drugStorage/recall-and-locked')
      },
      {
        path: '/drugStorage/outStorage/recallAndLocked/details',
        name: '召回明细',
        component: _imports('drugStorage/recall-and-locked-detail')
      },
      {
        path: '/drugStorage/outStorage/recallAndLockedCheck',
        name: '召回审核',
        component: _imports('drugStorage/recall-and-locked-check')
      },
      {
        path: '/drugStorage/outStorage/recallAndLockedCheck/details',
        name: '召回审核明细',
        component: _imports('drugStorage/recall-and-locked-check-detail')
      },
      //药学科
      {
        path: '/purchase/outStorage/recallAndLockedCheck',
        name: '召回审核',
        component: _imports('drugStorage/purchase-recall-and-locked-check')
      },
      {
        path: '/purchase/outStorage/recallAndLockedCheck/details',
        name: '召回审核明细',
        component: _imports('drugStorage/purchase-recall-and-locked-check-detail')
      },
    ],
    // meta: { login: true,keepAlive:true}
  },
  {
    path: '/',
    name: '货位移动',
    component: _imports('home/home'),
    iconCls: 'ios-home',
    children: [
      {
        path: '/drugStorage/goodsAdjust/adjust',
        name: '货位移动',
        component: _imports('drugStorage/adjust')
      },
      {
        path: '/drugStorage/goodsAdjust/adjust/details',
        name: '货位移动明细',
        component: _imports('drugStorage/adjust-detail')
      },
    ],
    // meta: { login: true,keepAlive:true}
  },
  {
    path: '/',
    name: '盘点损益',
    component: _imports('home/home'),
    iconCls: 'ios-home',
    children: [
      {
        path: '/drugStorage/checkDecrease/newInventory',
        name: '新建盘点',
        component: _imports('drugStorage/new-inventory')
      },
      {
        path: '/drugStorage/checkDecrease/newInventory/details',
        name: '新建盘点明细',
        component: _imports('drugStorage/new-inventory-detail')
      },
      {
        path: '/drugStorage/checkDecrease/inventoryAudit',
        name: '盘点审核',
        component: _imports('drugStorage/inventory-audit')
      },
      {
        path: '/drugStorage/checkDecrease/inventoryAudit/details',
        name: '盘点审核明细',
        component: _imports('drugStorage/inventory-audit-detail')
      },
      //药学科
      {
        path: '/purchase/checkDecrease/inventoryAudit',
        name: '盘点审核',
        component: _imports('drugStorage/purchase-inventory-audit')
      },
      {
        path: '/purchase/checkDecrease/inventoryAudit/details',
        name: '盘点审核明细',
        component: _imports('drugStorage/purchase-inventory-audit-detail')
      },
      {
        path: '/purchase/checkDecrease/financialAudit',
        name: '财务审核',
        component: _imports('drugStorage/financial-audit')
      },
      {
        path: '/purchase/checkDecrease/financialAudit/details',
        name: '财务审核明细',
        component: _imports('drugStorage/financial-audit-detail')
      },
      {
        path: '/drugStorage/checkDecrease/afterAdjustment',
        name: '盘后调整',
        component: _imports('drugStorage/after-adjustment')
      },
      {
        path: '/drugStorage/checkDecrease/afterAdjustment/details',
        name: '盘后调整明细',
        component: _imports('drugStorage/after-adjustment-detail')
      },
      {
        path: '/drugStorage/checkDecrease/profiLossRecord',
        name: '损益记录',
        component: _imports('drugStorage/profi-loss-record')
      },
      {
        path: '/drugStorage/checkDecrease/profiLossRecord/details',
        name: '损益记录明细',
        component: _imports('drugStorage/profi-loss-record-detail')
      },
    ],
    // meta: { login: true,keepAlive:true}
  },
  {
    path: '/',
    name: '发票查询',
    component: _imports('home/home'),
    iconCls: 'ios-home',
    children: [
      {
        path: '/purchase/invoiceQueryMenu/InvoiceQuery',
        name: '发票查询',
        component: _imports('drugStorage/invoice-query')
      },
      {
        path: '/purchase/invoiceQueryMenu/InvoiceQuery/details',
        name: '发票查询明细',
        component: _imports('drugStorage/invoice-query-detail')
      },
    ],
  },
  // 药学科 退货审核
   {
    path: '/',
    name: '退货审核',
    component: _imports('home/home'),
    iconCls: 'ios-home',
    children: [
      {
        path: '/Purchase/outStorage/backStorage',
        name: '退货审核',
        component: _imports('drugStorage/purchase-back-storage')
      },
      {
        path: '/Purchase/outStorage/backStorage/details',
        name: '退货审核明细',
        component: _imports('drugStorage/purchase-back-storage-detail')
      },
    ],
  },
  {
    path: '/',
    name: '基数药查询',
    component: _imports('home/home'),
    iconCls: 'ios-home',
    children: [
      {
        path: '/baseDrug/drugMgt/drugCatalog',
        name: '基数药目录',
        component: _imports('outpatientWard/drug-catalog')
      },
      {
        path: '/baseDrug/drugMgt/drugCatalog/details',
        name: '基数药目录明细',
        component: _imports('outpatientWard/drug-catalog-detail')
      },
      {
        path: '/baseDrug/stockMgt/stockInquiry',
        name: '基数药库存',
        component: _imports('outpatientWard/stock-inquiry')
      },
      {
        path: '/baseDrug/stockMgt/stockInquiry/details',
        name: '基数药库存明细',
        component: _imports('outpatientWard/stock-inquiry-detail')
      },
      {
        path: '/baseDrug/stockMgt/drugLedgernew',
        name: "基数药台账新",
        component: _imports('outpatientWard/drug-ledgernew')
      },
    ],
  },
  {
    path: '/',
    name: '基数药申领',
    component: _imports('home/home'),
    iconCls: 'ios-home',
    children: [
      {
        path: '/baseDrug/wareHouse/drugApply',
        name: '新建申领',
        component: _imports('outpatientWard/drug-apply')
      },
      {
        path: '/baseDrug/wareHouse/drugApply/details',
        name: '新建申领明细',
        component: _imports('outpatientWard/drug-apply-detail')
      },
      {
        path: '/baseDrug/wareHouse/acceptance',
        name: '药品验收',
        component: _imports('outpatientWard/acceptance')
      },
      {
        path: '/baseDrug/wareHouse/acceptance/details',
        name: '药品验收明细',
        component: _imports('outpatientWard/acceptance-detail')
      },
    ],
  },
  {
    path: '/',
    name: '基药库退货',
    component: _imports('home/home'),
    iconCls: 'ios-home',
    children: [
      {
        path: '/baseDrug/outStorage/refund',
        name: '基药库退货',
        component: _imports('outpatientWard/refund')
      },
      {
        path: '/baseDrug/outStorage/refund/details',
        name: '基药库退货明细',
        component: _imports('outpatientWard/refund-detail')
      },
    ],
  },
      {
    path: '/',
    name: '抢救车',
    component: _imports('home/home'),
    iconCls: 'ios-home',
    children: [
      {
        path: '/baseDrug/salvageCar/salvageCarStock',
        name: '抢救车库存',
        component: _imports('outpatientWard/salvage-car-stock')
      },
      {
        path: '/baseDrug/salvageCar/salvageCarStock/details',
        name: '抢救车库存明细',
        component: _imports('outpatientWard/salvage-car-stock-detail')
      },
      {
        path: '/baseDrug/salvageCar/salvageCarLedgernew',
        name: '抢救车台账',
        component: _imports('outpatientWard/salvage-carLedgernew')
      },
      {
        path: '/baseDrug/salvageCar/drugApply',
        name: '新建申领',
        component: _imports('outpatientWard/salvage-car-drug-Apply')
      },
      {
        path: '/baseDrug/salvageCar/drugApply/details',
        name: '新建申领明细',
        component: _imports('outpatientWard/salvage-car-drug-Apply-detail')
      },
      {
        path: '/baseDrug/salvageCar/acceptance',
        name: '药品验收',
        component: _imports('outpatientWard/salvage-acceptance')
      },
      {
        path: '/baseDrug/salvageCar/acceptance/details',
        name: '药品验收明细',
        component: _imports('outpatientWard/salvage-acceptance-detail')
      },
      {
        path: '/baseDrug/salvageCar/refund',
        name: '新建退库',
        component: _imports('outpatientWard/out-storagere-fund')
      },
      {
        path: '/baseDrug/salvageCar/refund/details',
        name: '新建退库明细',
        component: _imports('outpatientWard/out-storagere-fund-detail')
      },
    ],
  },
];
export const router=new Router({
  routes:RouterMap
});
