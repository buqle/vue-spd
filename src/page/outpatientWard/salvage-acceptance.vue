<template>
  <div class="condition">
    <div class="condition-row">
      <div class="condition-group">
        <label>单号</label>
        <Input placeholder="请输入单号" v-model="page.distributeCode" class="condition-group-ipt"></Input>
      </div>
      <div class="condition-group">
        <label>发起时间</label>
         <DatePicker type="daterange" v-model="launchDate" placement="bottom-end" class="condition-group-ipt" placeholder="请选择发起时间范围" @on-clear="clearLaunchDate"></DatePicker>
      </div>
      <div class="condition-group">
        <label>抢救车货位</label>
        <Select v-model="page.deptCode" clearable class="big condition-group-ipt">
                  <Option v-for="dep in DeptList" :value="dep.id" :key="dep.id">{{ dep.deptName }}</Option>
        </Select>
      </div>
    </div>
    <div class="condition-row">
            <div class="condition-group">
              <label>状态</label>
              <Select v-model="page.auditStatus" clearable class="big condition-group-ipt">
                        <Option v-for="(sta,index) in stateList" :value="sta.value" :key="index">{{ sta.label }}</Option>
              </Select>
            </div>
            <div class="condition-group">
              <label>验收时间</label>
               <DatePicker type="daterange" v-model="checkDate" placement="bottom-end" class="condition-group-ipt" placeholder="请选择验收时间范围" @on-clear="clearCheckDate"></DatePicker>
            </div>
          </div>
               <div class="condition-row mb15">
                <Button type="default" size="large" class="l" @click="add()">新建验收</Button>
                <Button size="large" type="default" icon="ios-search" class="r" @click="druhStorageListClick(true)">查询</Button>
               </div>
    <Modal v-model="modal" fullscreen footer-hide title="新建验收">
       <Input search v-model="billNo" placeholder="扫描或输入配送单" style="width: 500px;" @on-search="druhStorageDetailHeadClick"/>
          <!-- <div class="condition-group ml130">
            <label>备注</label>
             <Input placeholder="请输入备注" v-model="page.distributeCode" class="condition-group-ipt"></Input>
          </div> -->
          <Button type="default" size="large" class="r" v-if="nameSh == 1 && comlist.auditStatus ==1" @click="examDetailCheckListListClick()">确认验收</Button>
      <Card dis-hover :bordered="false" style="margin-top: 10px;">
                <p slot="title">
                    单据信息
                </p>
                <div> 
                        <Row :gutter="30">
                            <Col span="6">
                            出库单：{{comlist.distributeCode}}
                            </Col>
                            <Col span="6">
                                申领单：{{comlist.applyCode}}
                            </Col>
                            <Col span="6">
                                状态：{{comlist.statusName}}
                            </Col>
                        </Row>
                        <Row :gutter="30" class="mt10">
                            <Col span="6">
                                配货部门：{{comlist.deptName}}
                            </Col>
                           <Col span="6">
                                发起人：{{comlist.createName}}
                            </Col>
                            <Col span="6">
                                发起时间：{{comlist.createDate}}
                            </Col>
                        </Row> 
                        <Row :gutter="30" class="mt10">
                            <Col span="6">
                                验收时间：{{comlist.receptionTime}} 
                                </Col>
                        </Row> 
                </div>
            </Card>
              <Tabs v-model="nameSh" :animated="false" @on-click="handleTab">
        <TabPane label="待验收" name="1" class="mb10">
          <Table :columns="columns2" :data="druhListSh"  @on-selection-change="handleGoodsChange"></Table>
          <Spin size="large" fix v-if="spinShow"></Spin>
                     <div class="r mt15 mb10">
                      <Page :total="page1.totalPage" :page-size="page1.pageSize" :current.sync="page1.pageNo" @on-change="druhStorageDetailListClick(false)" show-total show-elevator />
                     </div>
        </TabPane>
        <TabPane label="已验收" name="2" class="mb10">
          <Table :columns="columns1" :data="druhListSh"></Table> 
          <Spin size="large" fix v-if="spinShow"></Spin>
                     <div class="r mt15 mb10">
                      <Page :total="page1.totalPage" :page-size="page1.pageSize" :current.sync="page1.pageNo" @on-change="druhStorageDetailListClick(false)" show-total show-elevator />
                     </div>
        </TabPane> 
      </Tabs>
    </Modal>
    <h3 class="f16 green-h3 mb10 mb10">列表查询</h3>
    <div class="demo-spin-container">
                 <Table :columns="columns" :data="druhList"></Table>
                 <Spin size="large" fix v-if="spinShow"></Spin>
               </div>
               <div class="r mt15">
                <Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="druhStorageListClick(false)" show-total show-elevator />
               </div>
  </div>
</template>
<script>
export default {
  data () {
              return { 
                spinShow:false,
                modal:false,
                comlist:'',
                nameSh:'1',
                billNo:'',
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
                        title: '实到数量',
                        key: 'realReceiveQuantiry',
                        align: 'center'
                      },
                      { 
                        title: '需求数量',
                        key: 'realDeliveryQuantiry',
                        align: 'center'
                      },
                      { 
                        title: '单位',
                        key: 'replanUnit',
                        align: 'center'
                      },
                      { 
                        title: '通用名',
                        key: 'ctmmGenericName',
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
                        　　　　　　}, params.row.ctmmGenericName),
                        　　　　　　h('div', {
                        　　　　　　　　slot: 'content',
                        　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                        　　　　　　},params.row.ctmmGenericName)
                        　　　　])
                        　　])
                        }
                      },
                      {  
                        title: '商品名',
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
                        title: '规格',
                        key: 'ctmmSpecification',
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
                        　　　　　　}, params.row.ctmmSpecification),
                        　　　　　　h('div', {
                        　　　　　　　　slot: 'content',
                        　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                        　　　　　　},params.row.ctmmSpecification)
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
                        title: '生产批号',
                        key: 'productBatchNo',
                        align: 'center'
                      },
                      {
                        title: '生产日期',
                        key: 'realProductTime',
                        align: 'center'
                      },
                      {
                        title: '有效期至',
                        key: 'realValidEndDate',
                        align: 'center'
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
                        title: '批准文号',
                        key: 'approvalNo',
                        align: 'center'
                      }
                    ],
               columns1:[
                      {
                        type: 'index',
                        title: '序号',
                        align: 'center'
                      },
                      { 
                        title: '实到数量',
                        key: 'realReceiveQuantiry',
                        align: 'center'
                      },
                      { 
                        title: '需求数量',
                        key: 'realDeliveryQuantiry',
                        align: 'center'
                      },
                      { 
                        title: '单位',
                        key: 'replanUnit',
                        align: 'center'
                      },
                      { 
                        title: '通用名',
                        key: 'ctmmGenericName',
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
                        　　　　　　}, params.row.ctmmGenericName),
                        　　　　　　h('div', {
                        　　　　　　　　slot: 'content',
                        　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                        　　　　　　},params.row.ctmmGenericName)
                        　　　　])
                        　　])
                        }
                      },
                      {  
                        title: '商品名',
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
                        title: '规格',
                        key: 'ctmmSpecification',
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
                        　　　　　　}, params.row.ctmmSpecification),
                        　　　　　　h('div', {
                        　　　　　　　　slot: 'content',
                        　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                        　　　　　　},params.row.ctmmSpecification)
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
                        title: '生产批号',
                        key: 'productBatchNo',
                        align: 'center'
                      },
                      {
                        title: '生产日期',
                        key: 'realProductTime',
                        align: 'center'
                      },
                      {
                        title: '有效期至',
                        key: 'realValidEndDate',
                        align: 'center'
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
                      }
                  ],
               columns: [
                      {
                          type: 'index',
                          title: '序号',
                          align: 'center'
                      },
                      {
                          title: '验收单',
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
                                              this.$router.push({path: "/baseDrug/salvageCar/acceptance/details", query:{id:params.row.distributeCode}})
                                          }
                                      }
                                  },params.row.distributeCode), 
                                  h('p', {
                                      props: {
                                          // type: 'primary',
                                          // size: 'small'
                                      },
                                      style: {float:'left',color:'#ffffff',padding:'0 5px',backgroundColor: 'red',position:'absolute',marginLeft:'7%',borderRadius:'20px'},
                                  },params.row.checkAcceptDetailsItemsCount),
                              ]);
                          }
                      },
                      {
                          title: '申领单',
                          key: 'applyCode',
                          align: 'center'

                      },
                      {
                          title: '申领抢救车',
                          key: 'deptName',
                          align: 'center'

                      },
                      {
                          title: '状态',
                          key: 'statusName',
                          align: 'center'
                      },
                      {
                          title: '出库人',
                          key: 'createName',
                          align: 'center'
                      },
                      {
                          title: '发起时间',
                          key: 'createDate',
                          align: 'center'
                      },
                      {
                          title: '验收时间',
                          key: 'receptionTime',
                          align: 'center'
                      }
                  ],
                  DeptList:[], 
                  stateList:[],
                  druhList:[],
                  druhListSh:[],
                  goodsSumList:[],
                  page:{
                            pageNo:1,
                            pageSize:10,
                            totalPage:0,
                            deptCode:'',
                            distributeCode:'', 
                            checkType:4,
                            startCreateTime:'',
                            endCreateTime:'',
                            receptionStartTime:'',
                            receptionEndTime:'',
                            auditStatus:'', 
                  }, 
                   page1:{
                            pageNo:1,
                            pageSize:10,
                            totalPage:0,
                            distributeCode:'',
                  },
                  launchDate:[],
                  checkDate:[],
              }
  },
  methods:{
    add(){
      this.modal=true;
      // this.handleTab(1);
    },
    handleTab(name){
      this.page1.status = name;
      this.druhStorageDetailListClick(true);
    },
    handleGoodsChange(selection) {
      this.goodsSumList = [];
      for (let i = 0; i < selection.length; i++) {
        let item = {
          id:selection[i].id,
          realReceiveQuantiry:selection[i].realReceiveQuantiry
        }
        this.goodsSumList.push(item);
      } 
    }, 
    //  确认审核
    async examDetailCheckListListClick(){
        if(this.goodsSumList.length == 0){
            this.$Message.error('请勾选数据!');
            return
        }
      let item = {
          checkType:4,
          detailList:this.goodsSumList,
          distributeCode:this.comlist.distributeCode,
        }
      let datalist = await this.$api.druhStorage.examDetailCheckListList(item);
      if(datalist.code == 200){
              this.druhStorageDetailHeadClick();
              this.nameSh = '2';
      }
    },
    //  头部 明细
    async druhStorageDetailHeadClick(){
      if(!this.billNo){
          this.$Message.error('配送单编号不能为空!');
          return;
        }
      let datalist = await this.$api.druhStorage.druhStorageDetailHeadList({'distributeCode':this.billNo}); 
      this.comlist=datalist.data;
      this.druhStorageDetailListClick(true);
    },
    // 列表
    async druhStorageDetailListClick(flag){
      if(flag){
        this.page1.pageNo = 1;
      }
      this.druhListSh = [];
      this.page1.distributeCode = this.billNo;
      this.page1.status = this.nameSh;
      this.page1.distributeCode = this.billNo;
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.druhStorageDetailList(this.page1);
      this.spinShow = false;
      this.druhListSh=datalist.data.list;
      this.page1.totalPage = datalist.data.count;
    },
    // 列表
    async druhStorageListClick(flag){
      let launchDate = this.launchDate,checkDate = this.checkDate;
        if(launchDate && Array.isArray(launchDate) && launchDate.length > 0 && launchDate[0] && launchDate[1]){
          this.page.startCreateTime = this.$moment(launchDate[0]).format('YYYY-MM-DD');
          this.page.endCreateTime = this.$moment(launchDate[1]).format('YYYY-MM-DD');
        }
        if(checkDate && Array.isArray(checkDate) && checkDate.length > 0 && checkDate[0] && checkDate[1]){
          this.page.receptionStartTime = this.$moment(checkDate[0]).format('YYYY-MM-DD');
          this.page.receptionEndTime = this.$moment(checkDate[1]).format('YYYY-MM-DD');
        }
      if(flag){
        this.page.pageNo = 1;
      }
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.druhStorageList(this.page); 
      this.spinShow = false;
      this.druhList=datalist.data.list;
      this.page.totalPage = datalist.data.count;
    },
    clearLaunchDate(){
        this.launchDate = [];
        this.page.launchStartTime = "";
        this.page.launchEndTime = "";
      },
      clearCheckDate(){
        this.checkDate = [];
        this.page.checkStartTime = "";
        this.page.checkEndTime = "";
      },
    // 抢救车货位
    async findOriginDeptListClick(){
      let datalist = await this.$api.publics.rescuecarDetailList();
      this.DeptList=datalist.data;
    },
    // 状态
    async stateListClick(){
      let datalist = await this.$api.publics.typeList({'type':'acceptance_checkVo'});
      this.stateList = datalist.data;
    },
  },
  created(){
    // console.log(this.$store.state.currentSelect); 
    // 抢救车货位
    this.findOriginDeptListClick();
    // 状态
    this.stateListClick();
    // 列表
    this.druhStorageListClick(false);
  }
}
</script>

