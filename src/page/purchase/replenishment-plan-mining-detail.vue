<template>
  <div class="condition">   
  <Card dis-hover :bordered="false">
              <p slot="title">
                  单据信息
              </p>
              <p slot="extra" class="btn-style">
                  <Button type="primary"  v-if="comlist.auditStatus == 4" @click="exportAsPrint()">导出execl</Button>
                  <Button type="primary" v-if="comlist.auditStatus == 1 || comlist.auditStatus == 3 && comlist.newFlag == 0" @click="add()">编辑</Button>
                  <Button type="primary" v-if="comlist.auditStatus == 1 || comlist.auditStatus == 3 && comlist.newFlag == 0" @click="submit()">提交</Button>
                  <!-- <Button type="primary" @click="print()" v-else>打印</Button> -->
              </p> 
              <div> 
                      <Row :gutter="30">
                          <Col span="6">
                          计划单号：{{comlist.planCode}}
                          </Col>
                          <Col span="6">
                             类型：{{comlist.planTypeName}}
                          </Col>
                          <Col span="6">
                             状态：{{comlist.statusName}}
                          </Col>
                      </Row>
                      <Row :gutter="30" class="mt10">
                          <Col span="6">
                             发起人：{{comlist.createUserName}}
                          </Col>
                          <Col span="6">
                             发起时间：{{comlist.createDate}}
                          </Col>
                          <Col span="6">
                             联系电话：{{comlist.mobile}}
                          </Col>
                      </Row> 
                      <Row :gutter="30" class="mt10">
                          <Col span="6">
                             收货地址：{{comlist.receiveAddress}}
                          </Col>
                          <Col span="6">
                             审核人：{{comlist.sheveUserName}}
                          </Col>
                          <Col span="6">
                             审核时间：{{comlist.sheveDate}}
                          </Col>
                      </Row> 
                      <Row :gutter="30" class="mt10">
                          <Col span="6">
                             驳回说明：{{comlist.note}}
                          </Col>
                      </Row> 
              </div>
          </Card>
           <div class="condition-row mb15">  
      <div class="condition-group">
        <Select
                      v-model="goodsName"
                      filterable
                      clearable
                      remote
                      placeholder="请选择药品"
                      :remote-method="queryDrugByListClick"
                      :loading="loading"  style="width: 300px" @on-change="goodsClick(goodsName)">

                      <Option v-for="(option, index) in goodsList" :value="option.ctmmParam" :key="index">{{option.ctmmParam}}</Option>
                  </Select>
      </div>
    </div>
    <h3 class="f16 green-h3 mb10">产品信息</h3>
    <Table :columns="columns" :data="druhList"></Table>
    <Spin size="large" fix v-if="spinShow"></Spin>
   <div class="r mt15">
    <Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="planDrugDetailListClick(false)" show-total show-elevator />
   </div>
       <Modal v-model="modal" fullscreen title="编辑退货" :loading="loading1">
      <div class="condition">
        <div class="condition-row mb15">
          <Button type="default" size="large" class="l" @click="addGoods()">一键添加低库存产品</Button>
          <Button type="default" size="large" class="l ml10" @click="batchDeleteListClick()">删除</Button>
          <div class="condition-group ml130">
            <label>补货部门</label>
             <Select v-model="page1.deptCode" clearable class="big condition-group-ipt" disabled>
                      <Option v-for="(sta,index) in depList" :value="sta.id" :key="index">{{ sta.deptName }}</Option>
            </Select>
          </div>
        </div>
         <h3 class="f16 green-h3 mb10">产品信息</h3>
         <Table :columns="columns2" :data="backGoodsLists"  @on-selection-change="handleGoodsChange"></Table>
         <Spin size="large" fix v-if="spinShow"></Spin>
         </div>
         <div slot="footer">
            <Button type="default" @click="submitPlan()">确定</Button>
            <Button type="default" @click ="cancel()">保存</Button>
        </div>
    </Modal>
    <Modal v-model="modalGoods" title="添加产品" width="1200" @on-cancel="modalReset"  @on-ok="asyncOK">
      <div class="condition">
        <div class="condition-row mb15">
          <div class="condition-group">
            <label>药品名称</label>
            <Select
                          v-model="goodsName1"
                          filterable
                          clearable
                          remote
                          placeholder="请选择药品"
                          :remote-method="queryDrugByListClick"
                          :loading="loading"  style="width: 300px" @on-change="goodsClick1(goodsName1)">
                          <Option v-for="(option, index) in goodsList" :value="option.ctmmParam" :key="index">{{option.ctmmParam}}</Option>
                      </Select>
          </div> 
        </div>  
       </div>
       <Table :columns="columns1" :data="goodsLists" @on-selection-change="handleSelectionChange"></Table> 
       <Spin size="large" fix v-if="spinShow"></Spin>
                 <div class="mt15" style="text-align: right;">
                  <Page :total="page1.totalPage" :page-size="page1.pageSize" :current.sync="page1.pageNo" @on-change="queryDrugByDeptListClick(false)" show-total show-elevator />
                 </div> 
    </Modal>
               
  </div>  
</template>
<script>
import {route}  from '@/api/apiRoute';
export default {
  data () {
              return {
                url:`${route}/a/plandetail/print/printDetail`,
               comlist:'',
               loading:false,
               goodsName:'',
               goodsList:[],
               druhList:[],
               depList:[],
               spinShow:false, 
                modal:false,
                modalGoods:false, 
                loading1:true, 
               goodsName1:'',
               backcause:'',
               columns2:[
                  {
        type: 'selection',
        align: 'center',
        width:'100'
      },
      {
        type: 'index',
        title: '序号',
        align: 'center'
      },
       { 
        title: '药品名称',
        key: 'ctmmTradeName',
        align: 'center',
        render: (h, params) => {
        　　return h('div', [
        　　　　h('Tooltip', {
        　　　　props: { placement: 'top' }
        　　　　}, [
        　　　　h('div', {
        　　　　　　style: {
        　　　　　　　　width: '80px',
        　　　　　　　　overflow: 'hidden',
        　　　　　　　　textOverflow: 'ellipsis',
        　　　　　　　　whiteSpace: 'nowrap',
        　　　　　　},
        　　　　　　}, params.row.ctmmTradeName),
        　　　　　　h('div', {
        　　　　　　　　slot: 'content',
        　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
        　　　　　　},params.row.ctmmTradeName)
        　　　　])
        　　])
        }
      },
      {  
        title: '剂型',
        key: 'ctmmDosageFormDesc',
        align: 'center'
      },
      {
        title: '生产厂家',
        key: 'ctmmManufacturerName',
        align: 'center',
        render: (h, params) => {
        　　return h('div', [
        　　　　h('Tooltip', {
        　　　　props: { placement: 'top' }
        　　　　}, [
        　　　　h('div', {
        　　　　　　style: {
        　　　　　　　　width: '80px',
        　　　　　　　　overflow: 'hidden',
        　　　　　　　　textOverflow: 'ellipsis',
        　　　　　　　　whiteSpace: 'nowrap',
        　　　　　　},
        　　　　　　}, params.row.ctmmManufacturerName),
        　　　　　　h('div', {
        　　　　　　　　slot: 'content',
        　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
        　　　　　　},params.row.ctmmManufacturerName)
        　　　　])
        　　])
        }
      },
      {
          title: '供应商',
          center: 'center',
          key:'supplierCode',
          render: (h, params) => {
              return h('Select', {  
                  props:{  
                      value: params.row.supplierCode,
                      transfer:true
                  },  
                  on: {  
                      'on-change':(value) => {
                          this.backGoodsLists[params.index].supplierCode = value;
                          for (let i = 0; i < this.backGoodsLists[params.index].supplierList.length; i++) {
                                 if(this.backGoodsLists[params.index].supplierList[i].ctmaSupplierCode == value){
                                      this.backGoodsLists[params.index].drugPrice = this.backGoodsLists[params.index].supplierList[i].referencePrice
                                 }
                          }
                      }
                  },  
              },  
              this.backGoodsLists[params.index].supplierList.map((obj)=>{
                  return h('Option', {
                      props: {value: obj.ctmaSupplierCode,label: obj.ctmaSupplierName}  
                  });  
              })
              );  
          },  
      },
      {
        title: '包装规格',
        key: 'packageSpecification',
        align: 'center'
      }, 
      { 
        title: '单位',
        key: 'replanUnit',
        align: 'center'
      },
      { 
        title: '需求数量',
        key: 'demandQuantity',
        align: 'center',
         render: (h, params) => {
                      return h('InputNumber', {
                          props: {
                            min:1,
                            // max:params.index.purchaseQuantity,
                               type: 'text',
                               value: this.backGoodsLists[params.index].demandQuantity,
                          },
                          on: { 
            'on-change':(event)=>{
                                  this.backGoodsLists[params.index].demandQuantity = event;
                              }
          },
                      });
                  }, 
      },
      {
        title: '当前库存',
        key: 'usableQuantity',
        align: 'center'
      },
      {
        title: '库存上限',
        key: 'upperQuantity',
        align: 'center'
      }, 
      {
        title: '库存下限',
        key: 'downQuantity',
        align: 'center'
      },  
      {
        title: '批准文号',
        key: 'approvalNo',
        align: 'center'
      }, 
      {
        title: '药品编码',
        key: 'hisDrugCode',
        align: 'center'
      }
                  ],
               columns1:[
                {
        type: 'selection',
        align: 'center',
        width:'50'
      },
      {
        type: 'index',
        title: '序号',
        align: 'center'
      },
      { 
        title: '药品名称',
        key: 'ctmmTradeName',
        align: 'center',
        render: (h, params) => {
        　　return h('div', [
        　　　　h('Tooltip', {
        　　　　props: { placement: 'top' }
        　　　　}, [
        　　　　h('div', {
        　　　　　　style: {
        　　　　　　　　width: '80px',
        　　　　　　　　overflow: 'hidden',
        　　　　　　　　textOverflow: 'ellipsis',
        　　　　　　　　whiteSpace: 'nowrap',
        　　　　　　},
        　　　　　　}, params.row.ctmmTradeName),
        　　　　　　h('div', {
        　　　　　　　　slot: 'content',
        　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
        　　　　　　},params.row.ctmmTradeName)
        　　　　])
        　　])
        }
      },
      { 
        title: '当前库存',
        key: 'usableQuantity',
        align: 'center'
      },
      {  
        title: '剂型',
        key: 'ctmmDosageFormDesc',
        align: 'center'
      },
      {
        title: '包装规格',
        key: 'packageSpecification',
        align: 'center',
        render: (h, params) => {
        　　return h('div', [
        　　　　h('Tooltip', {
        　　　　props: { placement: 'top' }
        　　　　}, [
        　　　　h('div', {
        　　　　　　style: {
        　　　　　　　　width: '80px',
        　　　　　　　　overflow: 'hidden',
        　　　　　　　　textOverflow: 'ellipsis',
        　　　　　　　　whiteSpace: 'nowrap',
        　　　　　　},
        　　　　　　}, params.row.packageSpecification),
        　　　　　　h('div', {
        　　　　　　　　slot: 'content',
        　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
        　　　　　　},params.row.packageSpecification)
        　　　　])
        　　])
        }
      },
      {
        title: '生产厂家',
        key: 'ctmmManufacturerName',
        align: 'center',
        render: (h, params) => {
        　　return h('div', [
        　　　　h('Tooltip', {
        　　　　props: { placement: 'top' }
        　　　　}, [
        　　　　h('div', {
        　　　　　　style: {
        　　　　　　　　width: '80px',
        　　　　　　　　overflow: 'hidden',
        　　　　　　　　textOverflow: 'ellipsis',
        　　　　　　　　whiteSpace: 'nowrap',
        　　　　　　},
        　　　　　　}, params.row.ctmmManufacturerName),
        　　　　　　h('div', {
        　　　　　　　　slot: 'content',
        　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
        　　　　　　},params.row.ctmmManufacturerName)
        　　　　])
        　　])
        }
      },
      {
        title: '批准文号',
        key: 'approvalNo',
        align: 'center'
      },
      {
        title: '药品编码',
        key: 'hisDrugCode',
        align: 'center'
      }
      
 ],

    columns:[
        {
          type: 'index',
          title: '序号',
          align: 'center'
        },
         { 
          title: '药品名称',
          key: 'ctmmTradeName',
          align: 'center',
          render: (h, params) => {
          　　return h('div', [
          　　　　h('Tooltip', {
          　　　　props: { placement: 'top' }
          　　　　}, [
          　　　　h('div', {
          　　　　　　style: {
          　　　　　　　　width: '80px',
          　　　　　　　　overflow: 'hidden',
          　　　　　　　　textOverflow: 'ellipsis',
          　　　　　　　　whiteSpace: 'nowrap',
          　　　　　　},
          　　　　　　}, params.row.ctmmTradeName),
          　　　　　　h('div', {
          　　　　　　　　slot: 'content',
          　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
          　　　　　　},params.row.ctmmTradeName)
          　　　　])
          　　])
          }
        },
        {  
          title: '剂型',
          key: 'ctmmDosageFormDesc',
          align: 'center'
        },
        {  
          title: '包装规格',
          key: 'packageSpecification',
          align: 'center'
        },
              {  
          title: '批准文号',
          key: 'approvalNo',
          align: 'center'
        },
        { 
          title: '生产厂家',
          key: 'ctmmManufacturerName',
          align: 'center',
          render: (h, params) => {
          　　return h('div', [
          　　　　h('Tooltip', {
          　　　　props: { placement: 'top' }
          　　　　}, [
          　　　　h('div', {
          　　　　　　style: {
          　　　　　　　　width: '80px',
          　　　　　　　　overflow: 'hidden',
          　　　　　　　　textOverflow: 'ellipsis',
          　　　　　　　　whiteSpace: 'nowrap',
          　　　　　　},
          　　　　　　}, params.row.ctmmManufacturerName),
          　　　　　　h('div', {
          　　　　　　　　slot: 'content',
          　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
          　　　　　　},params.row.ctmmManufacturerName)
          　　　　])
          　　])
          }
        },
        { 
          title: '供应商',
          key: 'supplierName',
          align: 'center',
          render: (h, params) => {
          　　return h('div', [
          　　　　h('Tooltip', {
          　　　　props: { placement: 'top' }
          　　　　}, [
          　　　　h('div', {
          　　　　　　style: {
          　　　　　　　　width: '80px',
          　　　　　　　　overflow: 'hidden',
          　　　　　　　　textOverflow: 'ellipsis',
          　　　　　　　　whiteSpace: 'nowrap',
          　　　　　　},
          　　　　　　}, params.row.supplierName),
          　　　　　　h('div', {
          　　　　　　　　slot: 'content',
          　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
          　　　　　　},params.row.supplierName)
          　　　　])
          　　])
          }
        },
        { 
          title: '需求数量',
          key: 'demandQuantity',
          align: 'center'
        },
        { 
          title: '当前库存',
          key: 'usableQuantity',
          align: 'center'
        },   
        { 
          title: '单价',
          key: 'drugPrice',
          align: 'center'
        },
        {  
          title: '金额',
          key: 'totalPrice',
          align: 'center'
        },
        { 
          title: '库存上限',
          key: 'upperQuantity',
          align: 'center'
        },
        {  
          title: '库存下限',
          key: 'downQuantity',
          align: 'center'
        },
        {
          title: '药品编码',
          key: 'hisDrugCode',
          align: 'center'
        }
      ],
      page:{
      hisDrugCode:'',
      planCode:''
    },
    page1:{
                  pageNo:1,
                  pageSize:10,
                  totalPage:0,
                  deptCode:'',
                  existDrugCodeList:[],
                  hisDrugCodeList:[], 
                  medDrugType:1,
                  purchaseType:2,
              },
              backGoodsLists:[],
              backGoodsList:[],
              goodsLists:[],
              id:''
    }
  },
  methods: {
    async add(){
      this.modal=true;
      this.page.planCode = this.$router.history.current.query.id;
      // this.page.hisDrugCode = this.$router.history.current.query.id;
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.planDrugDetailList(this.page);
      this.spinShow = false;
      // this.backGoodsLists = datalist.data.list;
      datalist.data.list.forEach((item)=>{
            this.backGoodsLists.push(item);
            this.page1.existDrugCodeList.push(item.drugCode);
     }) 
      this.id = datalist.data.id;
      this.page1.deptCode = datalist.data.deptCode;
    }, 
    addGoods(){
      this.modalGoods=true;
      this.queryDrugByDeptListClick();
    },
    // 列表
    async queryDrugByDeptListClick(flag){
      if(flag){
        this.page1.pageNo = 1;
      }
      this.goodsLists = [];
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.queryDrugByDeptList(this.page1);
      this.spinShow = false;
      this.goodsLists=datalist.data.list;
      this.page1.totalPage = datalist.data.count;
    },
        handleSelectionChange(selection) {
      this.backGoodsList = [];
      // this.backGoodsList = selection;
      for (let i = 0; i < selection.length; i++) {
         this.backGoodsList.push(selection[i].drugCode);
      }
    },
    asyncOK(){
      if(this.backGoodsList.length == 0){
        this.$Message.error('请选择药品!');
        return
      } 
      this.submitGoods();
    },
    async submitGoods(){ 
        let item = {
          addDrugType:2,
          deptCode:this.page1.deptCode,
          drugCodeList:this.backGoodsList
        }
        let datalist = await this.$api.druhStorage.depotPlanaddDrugList(item);
        datalist.data.forEach((item)=>{
            this.backGoodsLists.push(item);
            this.page1.existDrugCodeList.push(item.drugCode);
        }) 
        this.page1.hisDrugCodeList = [];
        this.backGoodsList = [];
    },
    handleGoodsChange(selection) {
      this.goodsSumList = [];
      for (let i = 0; i < selection.length; i++) {
        if(!selection[i].supplierCode){
            this.$Message.error('请选择供应商!');
            return
        }
        if(!selection[i].demandQuantity){
            this.$Message.error('请填写需求数量!');
            return
        }
        let item = {
          bigDrugCode:selection[i].bigDrugCode,
          demandQuantity:selection[i].demandQuantity,
          drugCode:selection[i].drugCode,
          drugPrice:selection[i].drugPrice,
          supplierCode:selection[i].supplierCode,
          hisDrugCode:selection[i].hisDrugCode
        }
        this.goodsSumList.push(item);
      } 
      console.log(this.goodsSumList);
    },
    batchDeleteListClick(){
      for (let i = 0; i < this.backGoodsLists.length; i++) {
         for (let j = 0; j < this.goodsSumList.length; j++) {
          if(this.backGoodsLists[i].drugCode == this.goodsSumList[j].drugCode){
            this.backGoodsLists.splice(i, 1);
          }
        }
      }
      for (let k = 0; k < this.page1.existDrugCodeList.length; k++) {
         for (let l = 0; l < this.goodsSumList.length; l++) {
          if(this.page1.existDrugCodeList[k] == this.goodsSumList[l].drugCode){
            this.page1.existDrugCodeList.splice(k, 1);
          }
        }
      }
    },
    loadingSh(){
      setTimeout(() => {
        this.loading1 = false;
        this.$nextTick(() => {
          this.loading1 = true;
        })
      }, 500)
    },
        async cancel(){
      if(this.goodsSumList == 0){
          this.$Message.error('请勾选药品!');
          this.loadingSh();
          return
      }
      if(!this.page1.deptCode){
        this.$Message.error('请选择补货部门!');
        this.loadingSh();
        return
      }
      let item = {
          auditStatus:1,
          list:this.goodsSumList,
          deptCode:this.page1.deptCode,
          id:this.id,
          planType:'3',
          purchaseType:2
        }
        console.log(item);
        let datalist = await this.$api.druhStorage.saveDepotPlanDrugList(item);
        this.modal=false;
        this.goodsSumList = [];
        this.backGoodsLists = [];
        this.backGoodsList = [];
        this.$Message.success('保存采购计划成功!');
        this.page1.deptCode = '';
        this.page1.existDrugCodeList = [];
        this.depotplanListClick(true); 
    },
    submitPlan(){
      if(this.goodsSumList == 0){
          this.$Message.error('请勾选药品!');
          this.loadingSh();
          return
      }
      if(!this.page1.deptCode){
        this.$Message.error('请选择补货部门!');
        this.loadingSh();
        return
      }
      this.$Modal.confirm({
        title: '提示',
        content:'是否确定采购？',
        onOk: () => {
          this.backSubmit(); 
        },
      });
    },
    async backSubmit(){ 
        let item = {
          auditStatus:2,
          list:this.goodsSumList,
          deptCode:this.page1.deptCode,
          id:this.id,
          planType:'3',
          purchaseType:2
        }
        console.log(item);
        let datalist = await this.$api.druhStorage.saveDepotPlanDrugList(item);
        this.modal=false;
        this.goodsSumList = [];
        this.backGoodsLists = [];
        this.backGoodsList = [];
        this.$Message.success('提交补货计划成功!');
        this.page1.existDrugCodeList = [];
        this.planDrugDetailListClick(true); 
    },
    backModal(){
      this.modal=false;
    },
    modalReset(){
      this.modalGoods=false;
    },
    // 列表
    async submit(){
      let goods = [];
      for (var i = 0; i < this.druhList.length; i++) {
         let good = {
            bigDrugCode:this.druhList[i].bigDrugCode,
            demandQuantity:this.druhList[i].demandQuantity,
            drugCode:this.druhList[i].drugCode,
            drugPrice:this.druhList[i].drugPrice,
            hisDrugCode:this.druhList[i].hisDrugCode,
            supplierCode:this.druhList[i].supplierCode
          }
          goods.push(good);
      }
      let item = {
            auditStatus:2,
            deptCode:this.comlist.deptCode,
            id:this.comlist.id,
            planType:1,
            list:goods
          }
      // this.page.hisDrugCode = this.$router.history.current.query.id;
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.planExportSaveList(item);
      this.spinShow = false;
      this.$Message.success('提交补货计划成功!');
      this.planDrugDetailListClick();
    },
    // 列表
    async planDrugDetailListClick(){
      this.druhList = [];
      this.page.planCode = this.$router.history.current.query.id;
      // this.page.hisDrugCode = this.$router.history.current.query.id;
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.planDrugDetailList(this.page);
      this.spinShow = false;
      this.comlist=datalist.data;
      this.druhList=datalist.data.list;
      this.page.hisDrugCode = '';
    },
    // 药品
    async queryDrugByListClick(query){
      let item = {
        paramName:query,
        queryType:3,
      }
      this.loading = true;
      let datalist = await this.$api.publics.queryDrugByList(item);
      this.loading = false;
      this.goodsList=datalist.data;
    },
    // 药品检索
    goodsClick(name){
      for (let i = 0; i < this.goodsList.length; i++) {
         if(name == this.goodsList[i].ctmmParam){
          this.page.hisDrugCode = this.goodsList[i].bigDrugCode;
        }
      }
      this.planDrugDetailListClick();
    },
    // 弹框 药品检索
    goodsClick1(name){
      this.page1.hisDrugCodeList = [];
      for (let i = 0; i < this.goodsList.length; i++) {
         if(name == this.goodsList[i].ctmmParam){
          this.page1.hisDrugCodeList.push(this.goodsList[i].bigDrugCode);
        }
      }
      this.queryDrugByDeptListClick(true);
    },
    // 打印
    async print(){
      window.open(`${this.url}?planCode=${this.$router.history.current.query.id}`, '_blank');
    },
    // 导出
    async exportAsPrint(){
      let item = [];
      item.push(this.$router.history.current.query.id);
      let datalist = await this.$api.druhStorage.exportList({'list':item}); 
      let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
      let fileName = `${this.getCurrentDate()}自采补货计划.xls`;
      let objectUrl = URL.createObjectURL(blob); 
      const link = document.createElement('a')
      link.download = fileName;
      link.href = objectUrl;
      link.click();

      // let objectUrl = URL.createObjectURL(blob); 
      // // window.location.href = objectUrl;
      // window.open(objectUrl);
    },
    // 补货部门
    async getSysDeptByModuleListClick(){
      let datalist = await this.$api.publics.getSysDeptByModuleList({'deptType':3});
      this.depList=datalist.data;
    },
  }, 
  created(){
    // console.log(this.$router.history.current.query.id);
    // 列表
    this.planDrugDetailListClick();
    // 补货部门
   this.getSysDeptByModuleListClick();
  },
  watch: { 
   
  },


}
</script> 
<style scoped>
  .c_green_tit {
        color: #2d8cf0;
    }
</style>
