<template>
  <div class="condition">
    <div class="condition-row">
      <div class="condition-group">
        <label>汇总单</label>
        <Input placeholder="请输入汇总单" v-model="page.settleBillNo" class="condition-group-ipt"></Input>
      </div> 
      <div class="condition-group">
        <label>日期范围</label>
         <DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
      </div>
    </div> 
   <div class="condition-row mb15">

    <Button type="default" size="large" @click="settleExportListClick()">导出</Button>
    <Button size="large" type="default" icon="ios-search" class="r" @click="settleListClick(true)">查询</Button>
   </div>
    <h3 class="f16 green-h3 mb10">列表查询</h3>
    <div class="demo-spin-container">
                 <Table :columns="columns" :data="druhList" style="width: 100%"></Table>
                 <Spin size="large" fix v-if="spinShow"></Spin>
               </div>
               <div class="r mt15">
                <Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="settleListClick(false)" show-total show-elevator />
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
                          title: '结算单',
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
                                              this.$router.push({path: "/purchase/settlementMgt/statements/details", query:{id:params.row.settleBillNo}})
                                          }
                                      }
                                  },params.row.settleBillNo)
                              ]);
                          }
                      },
                      {
                          title: '供应商',
                          key: 'ctmaSupplierName',
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
                        　　　　　　}, params.row.ctmaSupplierName),
                        　　　　　　h('div', {
                        　　　　　　　　slot: 'content',
                        　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                        　　　　　　},params.row.ctmaSupplierName)
                        　　　　])
                        　　])
                        }
                      },
                      {
                          title: '状态',
                          key: 'settleStatusName',
                          align: 'center'
                      },
                      {
                          title: '结算总金额',
                          key: 'settleSumamount',
                          align: 'center'
                      },
                      {
                          title: '结算时间',
                          key: 'settleDate',
                          align: 'center'
                      }
                  ],  
                  druhList:[], 
                  page:{
                    pageNo:1,
                    pageSize:10,
                    totalPage:0,
                    settleBillNo:'', 
                    shelfTime:'',
                    startTime:'',
                    endTime:'',
                  }, 
              }
  },
  methods:{

    // 导出
    async settleExportListClick(){
      let datalist = await this.$api.druhStorage.balanceExportList();
      let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
      let fileName = `${this.getCurrentDate()}日对账单表详情.xls`;
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
    async settleListClick(flag){
      if(flag){
        this.page.pageNo = 1;
      }
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.settleList(this.page); 
      this.spinShow = false;
      this.druhList=datalist.data.list; 
      this.page.totalPage = datalist.data.count;
    },
  },
  created(){
    // console.log(this.$store.state.currentSelect);
    // 列表
    this.settleListClick(false);
  }
}
</script>

