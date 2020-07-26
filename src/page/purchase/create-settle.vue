<template>
  <div class="condition">
  <div class="condition-row">
      <div class="condition-group">
        <label>发药单号</label>
        <Input placeholder="请输入发药单号" v-model="page.dispensingNo" class="condition-group-ipt"></Input>
      </div> 
      <div class="condition-group">
        <label>供应商</label>
        <Select v-model="page.supplierCode" clearable class="big condition-group-ipt">
              <Option v-for="sup in supplierList" :value="sup.ctmaSupplierCode" :key="sup.ctmaSupplierCode">{{ sup.ctmaSupplierName}}</Option>
          </Select>
      </div>
      <div class="condition-group">
        <label>对账单号</label>
         <Input placeholder="请输入对账单号" v-model="page.balanceCode" class="condition-group-ipt"></Input>
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
        <div class="condition-group">
        <label>部　门</label>
        <Select v-model="page.deptCode" clearable class="big condition-group-ipt">
                  <Option v-for="dep in DeptList" :value="dep.id" :key="dep.id">{{ dep.deptName }}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>时间</label>
         <DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
      </div> 
    </div> 
   <div class="condition-row mb15">
   <Button type="default" size="large" @click="generatorSettleListClick()">生成结算单</Button> 
    <Button type="default" size="large" @click="balanceExportListClick()">导出</Button>
    <Button size="large" type="default" icon="ios-search" class="r" @click="balanceDetailListClick(true)">查询</Button>
   </div>
    <h3 class="f16 green-h3 mb10">列表查询</h3>
    <div class="demo-spin-container">
                 <Table :columns="columns" :data="druhList" style="width: 100%" @on-selection-change="handleSelectionChange"></Table>
                 <Spin size="large" fix v-if="spinShow"></Spin>
               </div>
               <div class="r mt15">
                <Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="balanceDetailListClick(false)" show-total show-elevator />
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
                          title: '业务药房',
                          key: 'deptDesc',
                          align: 'center'
                      },
                      {
                          title: '对账单号',
                          key: 'balanceCode',
                          align: 'center'
                      },
                      {
                          title: '发药时间',
                          key: 'dispensingDate',
                          align: 'center',
                          render: (h, params) => {
                               return h("div",this.$moment(params.row.dispensingDate).format('YYYY-MM-DD'))
                          } 
                      },
                      {
                          title: '发药单号',
                          key: 'dispensingNo',
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
                        　　　　　　}, params.row.dispensingNo),
                        　　　　　　h('div', {
                        　　　　　　　　slot: 'content',
                        　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                        　　　　　　},params.row.dispensingNo)
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
                          title: '药品名称',
                          key: 'drugName',
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
                        　　　　　　}, params.row.drugName),
                        　　　　　　h('div', {
                        　　　　　　　　slot: 'content',
                        　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                        　　　　　　},params.row.drugName)
                        　　　　])
                        　　])  
                             } 
                      },
                      {
                          title: '数量',
                          key: 'quantity',
                          align: 'center'
                      },
                      {
                          title: '金额',
                          key: 'price',
                          align: 'center'
                      },
                      {
                          title: '单位',
                          key: 'drugDosUom',
                          align: 'center'
                      },
                      {
                          title: '批号',
                          key: 'batch',
                          align: 'center'
                      },
                      {
                          title: '合计金额',
                          key: 'batch',
                          align: 'amount',
                          fixed:'right'
                      }
                  ],  
                  druhList:[], 
                  DeptList:[],
                  supplierList:[],
                  loading:false,
                  goodsName:'',
                  goodsList:[],
                  page:{
                    pageNo:1,
                    pageSize:10,
                    totalPage:0,
                    supplierCode:'', 
                    deptCode:'',
                    dispensingNo:'',
                    balanceCode:'',
                    hisDrugCode:'',
                    shelfTime:'',
                    startTime:'',
                    endTime:''
                  }, 
                  backGoodsList:[]
              } 
  },
  methods:{
    // 导出
    async balanceExportListClick(){
      if(this.backGoodsList.length == 0){
            this.$Message.error('请勾选订单!');
            return
      }
      let idList = [];
      this.backGoodsList.map(item=>idList.push(item.id));
      let datalist = await this.$api.druhStorage.exportGeneratorSettleList({idList});
      let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
      let fileName = `${this.getCurrentDate()}结算单详情.xls`;
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
      this.backGoodsList =selection;

    },
    // 生成补货计划
    async generatorSettleListClick(){
      if(this.backGoodsList.length == 0){
            this.$Message.error('请勾选订单!');
            return
      }
      let idList = [];
      this.backGoodsList.map(item=>idList.push(item.id));
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.generatorSettleList({idList});
      this.spinShow = false;
      this.backGoodsList = [];
      this.balanceDetailListClick(true);
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
      this.balanceDetailListClick(true);
    },
    // 列表
    async balanceDetailListClick(flag){
      if(flag){
        this.page.pageNo = 1;
      }
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.balanceDetailList(this.page); 
      this.spinShow = false;
      this.druhList=datalist.data.list; 
      this.page.totalPage = datalist.data.count;
    },
    // 供应商
    async supplierAllListClick(){
      let datalist = await this.$api.publics.supplierAllList({'type':'order_status'});
       this.supplierList=datalist.data;
      this.page.supplierCode=this.supplierList[this.supplierList.length-1].ctmaSupplierCode
    },
    // 来源部门
    async getSysDeptByModuleListClick(){
      let datalist = await this.$api.publics.getSysDeptByModuleList({'deptType':3});
      this.DeptList=datalist.data;
    }, 
  },
  async created(){
    // console.log(this.$store.state.currentSelect);
    // 部门
    this.getSysDeptByModuleListClick();
    // 供应商
   await this.supplierAllListClick();
    // 列表
    this.balanceDetailListClick(false);
  }
}
</script>

