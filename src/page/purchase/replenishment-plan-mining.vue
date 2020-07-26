<template>
  <div class="condition">
    <div class="condition-row">
      <div class="condition-group">
        <label>计划单号</label>
        <Input placeholder="请输入计划单号" v-model="page.planCode" class="condition-group-ipt"></Input>
      </div>
      <div class="condition-group">
        <label>状态</label>
        <Select v-model="page.auditStatus" clearable class="big condition-group-ipt">
                  <Option v-for="(sta,index) in stateList" :value="sta.value" :key="index">{{ sta.label }}</Option>
        </Select>
      </div> 
      <div class="condition-group">
        <label>发起时间</label>
         <DatePicker type="daterange" v-model="launchDate" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-clear="clearLaunchDate"></DatePicker>
      </div> 
    </div> 
     <div class="condition-row">
      <div class="condition-group">
            <label>药品名称</label>
            <Select
                          v-model="goodsName"
                          filterable
                          clearable
                          remote
                          placeholder="请选择药品"
                          :remote-method="queryDrugByListClick"
                          :loading="loading" @on-change="goodsClick(goodsName)" class="big condition-group-ipt">
                          <Option v-for="(option, index) in goodsList" :value="option.ctmmParam" :key="index">{{option.ctmmParam}}</Option>
                      </Select>
          </div>
    </div> 
     <div class="condition-row mb15">
      <Button type="default" size="large" class="l" @click="add()">新建采购计划</Button>
      <Button type="default" size="large" class="l ml10" @click="deleteListClick()">删除</Button>
      <Button size="large" type="default" icon="ios-search" class="r" @click="depotplanListClick(true)">查询</Button>
     </div>
    <Modal v-model="modal" fullscreen  title="新建退货" :loading="loading1">
      <div class="condition">
        <div class="condition-row mb15">
          <Button type="default" size="large" class="l" @click="addGoods()">一键添加低库存产品</Button>
          <Button type="default" size="large" class="l ml10" @click="batchDeleteListClick()">删除</Button>
          <div class="condition-group ml130">
            <label>补货部门</label>
             <Select v-model="page1.deptCode" clearable class="big condition-group-ipt">
                      <Option v-for="(sta,index) in depList" :value="sta.id" :key="index">{{ sta.deptName }}</Option>
            </Select>
          </div>
        </div>
         <h3 class="f16 green-h3 mb10">产品信息</h3>
         <Table :columns="columns2" :data="backGoodsLists"  @on-selection-change="handleGoodsChange"></Table>
                 </div>
        <div slot="footer">
            <Button type="default" @click="submit()">确定</Button>
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
    <h3 class="f16 green-h3 mb10">列表查询</h3>
    <div class="demo-spin-container">
                 <Table :columns="columns" :data="druhList" @on-selection-change="handleListChange"></Table>
                 <Spin size="large" fix v-if="spinShow"></Spin>
               </div>
               <div class="r mt15">
                <Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="depotplanListClick(false)" show-total show-elevator />
               </div>
  </div>
</template>
<script>
export default {
  data () {
              return { 
                spinShow:false,
                modal:false,
                modalGoods:false,
                loading:false,
                loading1:true,
               goodsName:'',
               goodsName1:'',
               goodsList:[],
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
               columns: [
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
                          title: '计划单号',
                          // key: 'ctmaSupplierName',
                          align: 'left',
                          render: (h, params) => {
                              return h('div', [
                                  h('div', {
                                      props: {
                                          // type: 'primary',
                                          // size: 'small'
                                      },
                                      style: {color:'blue',cursor:'pointer',float:'left',},
                                      on: {
                                          click: () => {
                                              // this.show(params.row.guid)
                                              // this.$router.replace('/warehousingAcceptanceDetail/'+params.row.ctmaSupplierName) 
                                              this.$router.push({path: "/purchase/sinceMining/replenishmentPlan/details", query:{id:params.row.planCode}})
                                          }
                                      }
                                  },params.row.planCode), 
                                  h('p', {
                                      props: {
                                          // type: 'primary',
                                          // size: 'small'
                                      },
                                      style: {float:'left',color:'#ffffff',padding:'0 5px',backgroundColor: 'red',position:'absolute',marginLeft:'8%',borderRadius:'20px'},
                                  },params.row.depotPlanDetailItemsCount),
                              ]);
                          }
                      },
                      {
                          title: '状态',
                          key: 'statusName',
                          align: 'center'

                      }, 
                      {
                          title: '发起人',
                          key: 'createUserName',
                          align: 'center'
                      },
                      {
                          title: '发起时间',
                          key: 'createDate',
                          align: 'center'
                      },
                      {
                          title: '收货地址',
                          key: 'receiveAddress',
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
                          　　　　　　}, params.row.receiveAddress),
                          　　　　　　h('div', {
                          　　　　　　　　slot: 'content',
                          　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                          　　　　　　},params.row.receiveAddress)
                          　　　　])
                          　　])
                          }
                      },
                      {
                          title: '驳回原因',
                          key: 'note',
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
                          　　　　　　}, params.row.note),
                          　　　　　　h('div', {
                          　　　　　　　　slot: 'content',
                          　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                          　　　　　　},params.row.note)
                          　　　　])
                          　　])
                          }
                      }
                  ], 
                  depList:[],
                  stateList:[],
                  druhList:[],
                  goodsLists:[],
                  backGoodsList:[],
                  backGoodsLists:[],
                  goodsSumList:[],
                  delList:[],
                  launchDate:[],
                  page:{
                      pageNo:1,
                      pageSize:10,
                      totalPage:0,
                      planType:3,
                      purchaseType:2,
                      // queryType:1,
                      planCode:'', 
                      auditStatus:'',
                      hisDrugCode:'',
                      startTime:'',
                      endTime:'',
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
              }
  },
  methods:{
    handleListChange(selection) {
       for (let i = 0; i < selection.length; i++) {
        this.delList.push(selection[i].planCode);
      }
    },
    // 删除
    async deleteListClick(){
      if(this.delList.length == 0){
        this.$Message.error('请勾选单据!');
        return
      }
      let datalist = await this.$api.druhStorage.updateStatusList({'list':this.delList,'opType':'1'});
      this.depotplanListClick(true);
    },
    add(){
      this.modal=true;
    },
    addGoods(){
      if(!this.page1.deptCode){
        this.$Message.error('请选择补货部门!');
        return
      }
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
    submit(){
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
          id:'',
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
    async backSubmit(){ 
        let item = {
          auditStatus:2,
          list:this.goodsSumList,
          deptCode:this.page1.deptCode,
          id:'',
          planType:'3',
          purchaseType:2
        }
        console.log(item);
        let datalist = await this.$api.druhStorage.saveDepotPlanDrugList(item);
        this.modal=false;
        this.goodsSumList = [];
        this.backGoodsLists = [];
        this.backGoodsList = [];
        this.$Message.success('提交采购计划成功!');
        this.page1.deptCode = '';
        this.page1.existDrugCodeList = [];
        this.depotplanListClick(true); 
    },
    backModal(){
      this.modal=false;
    },
    modalReset(){
      this.modalGoods=false;
    },
    clearLaunchDate(){
      this.launchDate = [];
      this.page.startTime = "";
      this.page.endTime = "";
    },
    // 药品
    async queryDrugByListClick(query){
      let item = {
        paramName:query,
        queryType:3,
      }
      this.goodsList = '';
      this.loading = true;
      let datalist = await this.$api.publics.queryDrugByList(item);
      this.loading = false;
      this.goodsList=datalist.data;
    },
    // 药品检索
    goodsClick(name){
      this.page.hisDrugCode = [];
      for (let i = 0; i < this.goodsList.length; i++) {
         if(name == this.goodsList[i].ctmmParam){
          this.page.hisDrugCode = this.goodsList[i].bigDrugCode;
        }
      }
      this.depotplanListClick(true);
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
    // 列表
    async depotplanListClick(flag){
      let launchDate = this.launchDate;
      if(launchDate && Array.isArray(launchDate) && launchDate.length > 0 && launchDate[0] && launchDate[1]){
        this.page.startTime = this.$moment(launchDate[0]).format('YYYY-MM-DD');
        this.page.endTime = this.$moment(launchDate[1]).format('YYYY-MM-DD');
      }
      if(flag){
        this.page.pageNo = 1;
      }
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.depotplanList(this.page);
      this.spinShow = false;
      if(datalist.code == 200){
        this.druhList=datalist.data.list;
        for (var i = 0; i < this.druhList.length; i++) {
          if (this.druhList[i].auditStatus != '1') {
            this.druhList[i]['_disabled'] = true
          }
        }
        this.page.totalPage = datalist.data.count;
        this.page.hisDrugCode = [];
      }
    },
    // 状态
    async stateListClick(){
      let datalist = await this.$api.publics.typeList({'type':'plan_status'});
      this.stateList=datalist.data;
    },
     // 补货部门
    async getSysDeptByModuleListClick(){
      let datalist = await this.$api.publics.getSysDeptByModuleList({'deptType':3});
      this.depList=datalist.data;
    },
  },
  created(){
    // console.log(this.$store.state.currentSelect); 
    // 补货部门
    this.getSysDeptByModuleListClick();
    // 状态
    this.stateListClick();
    // 列表
    this.depotplanListClick(false);
  }
}
</script>

