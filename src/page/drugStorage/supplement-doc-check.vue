<template>
  <div class="condition">
    <div class="condition-row">
      <div class="condition-group">
        <label>单号</label>
        <Input placeholder="请输入单号" v-model="page.makeupCode" class="condition-group-ipt"></Input>
      </div>
      <div class="condition-group">
        <label>审核时间</label>
         <DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
      </div>
      <div class="condition-group">
        <label>状态</label>
        <Select v-model="page.makeupStatus" clearable class="big condition-group-ipt">
                  <Option v-for="sta in stateList" :value="sta.value" :key="sta.value">{{ sta.label }}</Option>
        </Select>
      </div>
    </div>
    <div class="condition-row">
      <div class="condition-group">
        <label>类型</label>
        <Select v-model="page.makeupType" clearable class="big condition-group-ipt">
              <Option v-for="type in typeList" :value="type.value" :key="type.value">{{ type.label}}</Option>
          </Select>
      </div>
      <div class="condition-group">
        <label>补登时间</label>
         <DatePicker type="daterange" v-model="page.shelfTime1" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd1"></DatePicker>
      </div>
    </div>
   <div class="condition-row mb15">
    <Button type="default" size="large" @click="pass(1)">批量通过</Button> 
    <Button type="default" size="large" @click="pass(2)">批量驳回</Button> 
    <Button size="large" type="default" icon="ios-search" class="r" @click="makeUpListClick(true)">查询</Button>
   </div>
    <h3 class="f16 green-h3 mb10">列表查询</h3>
    <div class="demo-spin-container">
                 <Table :columns="columns" :data="druhList" style="width: 100%" @on-selection-change="handleSelectionChange"></Table>
                 <Spin size="large" fix v-if="spinShow"></Spin>
               </div>
               <div class="r mt15">
                <Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="makeUpListClick(false)" show-total show-elevator />
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
                        width:'60'
                      },
                      {
                          type: 'index',
                          title: '序号',
                          align: 'center',
                          width:'60'
                      },
                      {
                          title: '补登单号',
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
                                              this.$router.push({path: "/purchase/supplementDoc/supplementDocCheck/details", query:{id:params.row.makeupCode}})
                                          }
                                      }
                                  },params.row.makeupCode), 
                                  h('p', {
                                      props: {
                                          // type: 'primary',
                                          // size: 'small'
                                      },
                                      style: {float:'left',color:'#ffffff',padding:'0 5px',backgroundColor: 'red',position:'absolute',marginLeft:'7%',borderRadius:'20px'},
                                  },params.row.makeupDetailItemCount),
                              ]);
                          }
                      },
                      {
                          title: '入库/出库单',
                          key: 'storeCode',
                          align: 'center'
                      },
                      {
                          title: '状态',
                          key: 'makeupStatusName',
                          align: 'center'
                      },
                      {
                          title: '部门',
                          key: 'deptName',
                          align: 'center'
                      },
                      {
                          title: '类型',
                          key: 'makeupTypeName',
                          align: 'center'
                      },
                      {
                          title: '补登原因',
                          key: 'makeupCause',
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
                          　　　　　　}, params.row.makeupCause),
                          　　　　　　h('div', {
                          　　　　　　　　slot: 'content',
                          　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                          　　　　　　},params.row.makeupCause)
                          　　　　])
                          　　])
                          }
                      },
                      {
                          title: '补登人',
                          key: 'createUserName',
                          align: 'center'
                      },
                       {
                          title: '补登时间',
                          key: 'createDate',
                          align: 'center'
                      },
                       {
                          title: '审核人',
                          key: 'reviewUserName',
                          align: 'center'
                      },
                       {
                          title: '审核时间',
                          key: 'reviewDate',
                          align: 'center'
                      },
                  ], 
                  typeList:[],
                  stateList:[],   
                  druhList:[],
                  page:{
                    pageNo:1,
                    pageSize:10,
                    totalPage:0,
                    type:1,
                    makeupCode:'',
                    makeupStatus:'2',
                    makeupType:'', 
                    shelfTime:'',
                    reviewstartTime:'',
                    reviewendTime:'',
                    shelfTime1:'',
                    startTime:'',
                    endTime:'',
                  }, 
                  backGoodsList:[],
              }
  },
  methods:{
    // 导出
    // async exportDifferenceListClick(){
    //   let datalist = await this.$api.druhStorage.exportDifferenceList();
    //   let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
    //   let fileName = `${this.getCurrentDate()}配送缺货表.xls`;
    //   let objectUrl = URL.createObjectURL(blob); 
    //   const link = document.createElement('a')
    //   link.download = fileName;
    //   link.href = objectUrl;
    //   link.click();

    //   // let objectUrl = URL.createObjectURL(blob); 
    //   // // window.location.href = objectUrl;
    //   // window.open(objectUrl);
    // },
    getDateStartEnd(){
      let startdate = new Date(this.page.shelfTime[0]);
      let year = startdate.getFullYear();
      let month = startdate.getMonth() + 1;
      let data = startdate.getDate();
      this.page.reviewstartTime = year + '-' + month + '-' + data;

      var enddata = new Date(this.page.shelfTime[1]);
      let year1 = enddata.getFullYear();
      let month1 = enddata.getMonth() + 1;
      let data1 = enddata.getDate();
      this.page.reviewendTime = year1 + '-' + month1 + '-' + data1;
      if(!this.page.shelfTime[0]){
        this.page.reviewstartTime = '';
        this.page.reviewendTime = '';
      }
    },
    getDateStartEnd1(){
      let startdate = new Date(this.page.shelfTime[0]);
      let year = startdate.getFullYear();
      let month = startdate.getMonth() + 1;
      let data = startdate.getDate();
      this.page.startTime = year + '-' + month + '-' + data;

      var enddata = new Date(this.page.shelfTime[1]);
      let year1 = enddata.getFullYear();
      let month1 = enddata.getMonth() + 1;
      let data1 = enddata.getDate();
      this.page.endTime = year1 + '-' + month1 + '-' + data1;
      if(!this.page.shelfTime[0]){
        this.page.startTime = '';
        this.page.endTime = '';
      }
    },
    handleSelectionChange(selection) {
      this.backGoodsList = [];
      // this.backGoodsList = selection;
      for (let i = 0; i < selection.length; i++) {
             let item = {
              makeupCode:selection[i].makeupCode
             }
              this.backGoodsList.push(item);
        }  
    },
      pass(flg){
        if(this.backGoodsList.length == 0){
              this.$Message.error('请勾选单据!');
              return
        }
        this.$Modal.confirm({
          title: '提示',
          content:'确定执行此操作？',
          onOk: () => {
            this.makeupSumitListClick(flg); 
          },
        });
      },
    // 生成补货计划
    async makeupSumitListClick(flg){
              let item = {
                    type: flg,
                    makeuplist: this.backGoodsList
              }
              this.spinShow = true;
              let datalist = await this.$api.druhStorage.makeupSumitList(item); 
              this.spinShow = false;
              this.backGoodsList = [];
              this.makeUpListClick(true); 
    },
    // 列表
    async makeUpListClick(flag){
      if(flag){
        this.page.pageNo = 1;
      }
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.makeUpList(this.page); 
      this.spinShow = false;
      this.druhList=datalist.data.list;
      this.page.totalPage = datalist.data.count;
    },
    // 状态
    async stateListClick(){
      let datalist = await this.$api.publics.typeList({'type':'makeup_status'});
      this.stateList=datalist.data;
    },
    // 类型
    async typeListClick(){
      let datalist = await this.$api.publics.typeList({'type':'makeup_type'});
      this.typeList=datalist.data;
    },
  },
  created(){
    // console.log(this.$store.state.currentSelect);
    // 状态
    this.stateListClick();
    // 类型
    this.typeListClick();
    // 列表
    this.makeUpListClick(false);
  }
}
</script>

