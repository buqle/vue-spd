<template>
  <div class="condition">
    <div class="condition-row">
      <div class="condition-group">
        <label>汇总单</label>
        <Input placeholder="请输入汇总单" v-model="page.balanceCode" class="condition-group-ipt"></Input>
      </div> 
      <div class="condition-group">
        <label>日期范围</label>
         <DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
      </div>
      <div class="condition-group">
        <label>状态</label>
        <Select v-model="page.balanceStatus" clearable class="big condition-group-ipt">
                  <Option v-for="sta in stateList" :value="sta.value" :key="sta.value">{{ sta.label }}</Option>
        </Select>
      </div>
    </div> 
   <div class="condition-row mb15">
     <Button type="default" size="large" @click="add">生成对账单</Button>
    <Button type="default" size="large" @click="balanceExportListClick()">导出</Button>
    <Button size="large" type="default" icon="ios-search" class="r" @click="dailyListClick(true)">查询</Button>
   </div>
    <h3 class="f16 green-h3 mb10">列表查询</h3>
    <div class="demo-spin-container">
                 <Table :columns="columns" :data="druhList" style="width: 100%"></Table>
                 <Spin size="large" fix v-if="spinShow"></Spin>
               </div>
               <div class="r mt15">
                <Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="dailyListClick(false)" show-total show-elevator />
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
                          type: 'index',
                          title: '序号',
                          align: 'center'
                      },
                      {
                          title: '对账单',
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
                                              this.$router.push({path: "/purchase/settlementMgt/dayStatements/details", query:{id:params.row.balanceCode}})
                                          }
                                      }
                                  },params.row.balanceCode)
                              ]);
                          }
                      },
                      {
                          title: '状态',
                          key: 'confirmStatusName',
                          align: 'center',
                          render: (h, params) => {
                             if(params.row.colorStatus==1){
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
                                                    color:'red',
                                                    cursor:'pointer'
                        　　　　　　},
                        　　　　　　},params.row.confirmStatusName),
                        　　　　　　h('div', {
                        　　　　　　　　slot: 'content',
                        　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                        　　　　　　},'该单据处于对账中状态已超过3日，请注意核实是否异常。')
                        　　　　])
                        　　])
                             }else{
                                  return h('div',params.row.confirmStatusName)
                             }
                        　　
                        }
                      },
                      {
                          title: '总金额',
                          key: 'detailAmount',
                          align: 'center'
                      },
                      {
                          title: '数据起止时间',
                          key: 'dataTime',
                          align: 'center'
                      },
                      {
                          title: '实际发送时间',
                          key: 'createDate',
                          align: 'center'
                      },
                      {
                          title: '明细数量',
                          key: 'detailCount',
                          align: 'center'
                      },
                      {
                          title: '对账人',
                          key: 'balanceUserName',
                          align: 'center'
                      },
                      {
                          title: '对账完成时间',
                          key: 'balanceEndTime',
                          align: 'center'
                      }
                  ],  
                  druhList:[], 
                  stateList:[],
                  page:{
                    pageNo:1,
                    pageSize:10,
                    totalPage:0,
                    balanceCode:'', 
                    balanceStatus:'',
                    shelfTime:'',
                    startTime:'',
                    endTime:'',
                  }, 
              } 
  },
  methods:{
    //新建
    add(){
      this.$skip.goAdd(this.$router, '/purchase/settlementMgt/dayStatements/add')
    },
    // 导出
    async balanceExportListClick(){
      let datalist = await this.$api.druhStorage.balanceExportList();
      let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
      let fileName = `${this.getCurrentDate()}日对账单详情.xls`;
      let objectUrl = URL.createObjectURL(blob); 
      const link = document.createElement('a')
      link.download = fileName;
      link.href = objectUrl;
      link.click();

      // let objectUrl = URL.createObjectURL(blob); 
      // // window.location.href = objectUrl;
      // window.open(objectUrl);
    },
    getDateStartEnd(){
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
    // 列表
    async dailyListClick(flag){
      if(flag){
        this.page.pageNo = 1;
      }
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.dailyList(this.page); 
      this.spinShow = false;
      this.druhList=datalist.data.list; 
      this.page.totalPage = datalist.data.count;
    },
    // 状态
    async stateListClick(){
      let datalist = await this.$api.publics.typeList({'type':'balance_status'});
      this.stateList=datalist.data;
    }
  },
  created(){
    // console.log(this.$store.state.currentSelect);
    // 状态
    this.stateListClick();
    // 列表
    this.dailyListClick(false);
  }
}
</script>

