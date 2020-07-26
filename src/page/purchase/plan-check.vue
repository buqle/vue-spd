<template>
  <div class="condition">
    <div class="condition-row">
      <div class="condition-group">
        <label>订单状态</label>
        <Select v-model="page.auditStatus" clearable class="big condition-group-ipt">
                  <Option v-for="sta in stateList" :value="sta.value" :key="sta.value">{{ sta.label }}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>订单类型</label>
        <Select v-model="page.planType" clearable class="big condition-group-ipt">
              <Option v-for="type in typeList" :value="type.value" :key="type.value">{{ type.label}}</Option>
          </Select>
      </div>
      <div class="condition-group">
        <label>发起时间</label>
         <DatePicker type="daterange" v-model="launchDate" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围"  @on-clear="clearLaunchDate"></DatePicker>
      </div>
    </div>
    <div class="condition-row">
      <div class="condition-group">
        <label>计划单号</label>
        <Input placeholder="请输入计划单号" v-model="page.planCode" class="condition-group-ipt"></Input>
      </div>
    </div>
   <div class="condition-row mb15">
    <Button type="default" size="large" @click="updateStatusListClick()">批量通过</Button>
    <!-- <Button type="default" size="large" @click="exportDifferenceListClick()">导出</Button> -->
    <Button size="large" type="default" icon="ios-search" class="r" @click="findDifferenceListClick(true)">查询</Button>
   </div>
    <div class="demo-spin-container">
                 <Table :columns="columns" :data="druhList" style="width: 100%" @on-selection-change="handleSelectionChange"></Table>
                 <Spin size="large" fix v-if="spinShow"></Spin>
               </div>
               <div class="r mt15">
                <Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="findDifferenceListClick(false)" show-total show-elevator />
               </div>

  </div>
</template>
<script>
export default {
  data () {
              return { 
                spinShow:true,
                columns: [
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
                                              this.$router.push({path: "/purchase/replenishment/planCheck/details", query:{id:params.row.planCode}})
                                          }
                                      }
                                  },params.row.planCode), 
                                  h('p', {
                                      props: {
                                          // type: 'primary',
                                          // size: 'small'
                                      },
                                      style: {float:'left',color:'#ffffff',padding:'0 5px',backgroundColor: 'red',position:'absolute',marginLeft:'7%',borderRadius:'20px'},
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
                          title: '类型',
                          key: 'planTypeName',
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
                          title: '审核人',
                          key: 'sheveUserName',
                          align: 'center'
                      },
                      {
                          title: '审核时间',
                          key: 'sheveDate',
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
                  ], 
                  typeList:[],
                  stateList:[],   
                  druhList:[],
                  launchDate:[],
                  page:{
                    pageNo:1,
                    pageSize:10,
                    totalPage:0,
                    queryType:2,
                    purchaseType:1,
                    planCode:'',
                    auditStatus:'',
                    planType:'',
                    startTime:'',
                    endTime:'',
                  }, 
                  backGoodsList:[],
              }
  },
  methods:{
    // 导出
    async exportDifferenceListClick(){
      let datalist = await this.$api.druhStorage.exportDifferenceList();
      let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
      let fileName = `${this.getCurrentDate()}配送缺货表.xls`;
      let objectUrl = URL.createObjectURL(blob); 
      const link = document.createElement('a')
      link.download = fileName;
      link.href = objectUrl;
      link.click();

      // let objectUrl = URL.createObjectURL(blob); 
      // // window.location.href = objectUrl;
      // window.open(objectUrl);
    },
    handleSelectionChange(selection) {
      this.backGoodsList = [];
      // this.backGoodsList = selection;
      for (let i = 0; i < selection.length; i++) {
         this.backGoodsList.push(selection[i].planCode);
        } 
    },
    // 生成补货计划
    async updateStatusListClick(flag){
      if(this.backGoodsList.length == 0){
            this.$Message.error('请勾选计划单!');
            return
      }
       let item = {
            list: this.backGoodsList,
            opType:'4',
            purchaseType:1
      }
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.updateStatusList(item); 
      this.spinShow = false;
      this.backGoodsList = [];
      this.findDifferenceListClick(true);
    },
    clearLaunchDate(){
      this.launchDate = [];
      this.page.startTime = "";
      this.page.endTime = "";
    },
    // 列表
    async findDifferenceListClick(flag){
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
      this.druhList=datalist.data.list;
      for (var i = 0; i < this.druhList.length; i++) {
        if (this.druhList[i].auditStatus == '4') {
          this.druhList[i]['_disabled'] = true
        }
      }
      this.page.totalPage = datalist.data.count;
    },
    // 状态
    async stateListClick(){
      let datalist = await this.$api.publics.typeList({'type':'audit_plan_status'});
      this.stateList=datalist.data;
    },
    // 类型
    async typeListClick(){
      let datalist = await this.$api.publics.typeList({'type':'plan_type','typeValues':'1,2'});
      this.typeList=datalist.data;
    },
  },
  created(){
    // console.log(this.$store.state.currentSelect);
    // 状态
    this.stateListClick();
    // 状态
    this.typeListClick();
    // 列表
    this.findDifferenceListClick(false);
  }
}
</script>

