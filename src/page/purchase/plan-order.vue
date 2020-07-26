<template>
  <div class="condition">
    <div class="condition-row">
      <div class="condition-group">
        <label>订单号</label>
        <Input placeholder="请输入计划单号" v-model="page.orderCode" class="condition-group-ipt"></Input>
      </div>
      <div class="condition-group">
        <label>订单状态</label>
        <Select v-model="page.orderStatus" clearable class="big condition-group-ipt">
                  <Option v-for="sta in stateList" :value="sta.value" :key="sta.value">{{ sta.label }}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>订单类型</label>
        <Select v-model="page.orderType" clearable class="big condition-group-ipt">
              <Option v-for="type in typeList" :value="type.value" :key="type.value">{{ type.label}}</Option>
          </Select>
      </div> 
    </div>
    <div class="condition-row">
     <div class="condition-group">
        <label>供应商</label>
        <Select v-model="supplierCode" clearable class="big condition-group-ipt">
              <Option v-for="sup in supplierList" :value="sup.ctmaSupplierCode" :key="sup.ctmaSupplierCode">{{ sup.ctmaSupplierName}}</Option>
          </Select>
      </div> 
      <div class="condition-group">
        <label>日期范围</label>
         <DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
      </div>
    </div>
   <div class="condition-row mb15">
    <Button type="default" size="large" @click="sendOrder2SupplierListClick()">发送订单</Button> 
    <Button type="default" size="large" @click="closeOrderListClick()">取消订单</Button> 
    <Button size="large" type="default" icon="ios-search" class="r" @click="purchaseorderListClick(true)">查询</Button>
   </div>
    <h3 class="f16 green-h3 mb10">列表查询</h3>
    <div class="demo-spin-container">
                 <Table :columns="columns" :data="druhList" style="width: 100%" @on-selection-change="handleSelectionChange"></Table>
                 <Spin size="large" fix v-if="spinShow"></Spin>
               </div>
               <div class="r mt15">
                <Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="purchaseorderListClick(false)" show-total show-elevator />
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
                        width:'80'
                      },
                      {
                          type: 'index',
                          title: '序号',
                          align: 'center',
                          width:'80'
                      },
                      {
                          title: '订单号',
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
                                              this.$router.push({path: "/purchase/replenishment/planOrder/details", query:{id:params.row.orderCode}})
                                          }
                                      }
                                  },params.row.orderCode), 
                                  h('p', {
                                      props: {
                                          // type: 'primary',
                                          // size: 'small'
                                      },
                                      style: {float:'left',color:'#ffffff',padding:'0 5px',backgroundColor: 'red',marginTop:'-17px',marginLeft:'110px',borderRadius:'20px'},
                                  },params.row.purChaseOrderDetailItemCount),
                              ]);
                          }
                      },
                      {
                          title: '订单状态',
                          key: 'orderStatusName',
                          align: 'center'
                      },
                      {
                          title: '订单类型',
                          key: 'orderTypeName',
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
                          title: '下单人',
                          key: 'createUserName',
                          align: 'center'
                      },
                      {
                          title: '下单时间',
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
                  ], 
                  supplierList:[],
                  typeList:[],
                  stateList:[],   
                  druhList:[],
                  supplierCode:'',
                  page:{
                    pageNo:1,
                    pageSize:10,
                    totalPage:0,
                    orderCode:'',
                    orderStatus:'',
                    orderType:'', 
                    shelfTime:'',
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
              this.backGoodsList.push(selection[i].orderCode);
        }  
    },
    // 生成补货计划
    async sendOrder2SupplierListClick(){
      if(this.backGoodsList.length == 0){
            this.$Message.error('请勾选订单!');
            return
      }
       let item = {
            orderCodeList: this.backGoodsList
      }
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.sendOrder2SupplierList(item); 
      this.spinShow = false;
      this.backGoodsList = [];
      this.purchaseorderListClick(true);
    },
    // 关闭订单
    async closeOrderListClick(){
      if(this.backGoodsList.length == 0){
            this.$Message.error('请勾选订单!');
            return
      }
       let item = {
            orderCodeList: this.backGoodsList
      }
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.closeOrderList(item); 
      this.spinShow = false;
      this.backGoodsList = [];
      this.purchaseorderListClick(true);
    },
    // 列表
    async purchaseorderListClick(flag){
      if(flag){
        this.page.pageNo = 1;
      }
      if(this.supplierCode){
        this.page.supplierCodeList.push(this.supplierCode);
      } 
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.purchaseorderList(this.page); 
      this.spinShow = false;
      this.druhList=datalist.data.list;
      this.page.supplierCodeList = [];
      for (var i = 0; i < this.druhList.length; i++) {
        if (this.druhList[i].orderStatus != 1) {
          this.druhList[i]['_disabled'] = true
        }
      }
      this.page.totalPage = datalist.data.count;
    },
    // 供应商
    async supplierAllListClick(){
      let datalist = await this.$api.publics.supplierAllList({'type':'order_status'});
      this.supplierList=datalist.data;
    },
    // 状态
    async stateListClick(){
      let datalist = await this.$api.publics.typeList({'type':'order_status'});
      this.stateList=datalist.data;
    },
    // 类型
    async typeListClick(){
      let datalist = await this.$api.publics.typeList({'type':'order_type'});
      this.typeList=datalist.data;
    },
  },
  created(){
    // console.log(this.$store.state.currentSelect);
    // 供应商
    this.supplierAllListClick();
    // 状态
    this.stateListClick();
    // 状态
    this.typeListClick();
    // 列表
    this.purchaseorderListClick(false);
  }
}
</script>

