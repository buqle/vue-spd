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
        <label>下单日期</label>
         <DatePicker type="daterange" v-model="launchDate" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-clear="clearLaunchDate"></DatePicker>
      </div>
    </div>
   <div class="condition-row mb15">
    <Button size="large" type="default" icon="ios-search" class="r" @click="purchaseorderListClick(true)">查询</Button>
   </div>
    <h3 class="f16 green-h3 mb10">列表查询</h3>
    <div class="demo-spin-container">
                 <Table :columns="columns" :data="druhList" style="width: 100%"></Table>
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
                          type: 'index',
                          title: '序号',
                          align: 'center',
                          width:'80'
                      },
                      {
                          title: '订单号',
                          // key: 'ctmaSupplierName',
                          align: 'left',
                          width:'180',
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
                          width:'150',
                          align: 'center'
                      },
                      {
                          title: '订单类型',
                          key: 'orderTypeName',
                          width:'150',
                          align: 'center'
                      },
                      {
                          title: '供应商',
                          key: 'supplierName',
                          width:'200',
                          align: 'center',
                          render: (h, params) => {
                        　　return h('div', [
                        　　　　h('Tooltip', {
                        　　　　props: { placement: 'top' }
                        　　　　}, [
                        　　　　h('div', {
                        　　　　　　style: {
                        　　　　　　　　width: '120px',
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
                          width:'150',
                          align: 'center'
                      },
                      {
                          title: '下单时间',
                          key: 'createDate',
                          width:'150',
                          align: 'center'
                      },
                      {
                          title: '收货地址',
                          key: 'receiveAddress',
                          width:'200',
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
                          title: '作废人',
                          key: 'cancelUserName',
                          width:'150',
                          align: 'center',
                          fixed: 'right'
                      },
                      {
                          title: '作废时间',
                          key: 'cancelDate',
                          width:'150',
                          fixed: 'right',
                          align: 'center'
                      },
                      {
                          title: '操作',
                          key: '操作',
                          align: 'center',
                          fixed: 'right',
                          width:'150',
                          render: (h, params) => {
                              if(params.row.orderStatus == 2){
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.pass(params.row.orderCode);
                                            }
                                        }
                                    }, '作废')
                                ]);
                              }else{
                                if(params.row.orderCode == 5){
                                  return h('div','已作废');
                                }else{
                                  return h('div','作废');
                                }
                              }
                          }
                      }
                  ], 
                  supplierList:[],
                  typeList:[],
                  stateList:[],   
                  druhList:[],
                  supplierCode:'',
                  launchDate:[],
                  page:{
                    pageNo:1,
                    pageSize:10,
                    totalPage:0,
                    orderCode:'',
                    orderStatus:'',
                    orderType:'',
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
    clearLaunchDate(){
      this.launchDate = [];
      this.page.startTime = "";
      this.page.endTime = "";
    },
    pass(ordercode){
      this.$Modal.confirm({
        title: '提示',
        content:'您确定要执行订单作废操作？',
        onOk: () => {
          this.cancelOrder(ordercode); 
        },
      });
    },
    // 作废
    async cancelOrder(ordercode){
       let item = {
            orderCode: ordercode
      }
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.cancelOrderList(item); 
      this.spinShow = false;
      this.purchaseorderListClick(true);
    },
    // 列表
    async purchaseorderListClick(flag){
      let launchDate = this.launchDate;
        if(launchDate && Array.isArray(launchDate) && launchDate.length > 0 && launchDate[0] && launchDate[1]){
          this.page.startTime = this.$moment(launchDate[0]).format('YYYY-MM-DD');
          this.page.endTime = this.$moment(launchDate[1]).format('YYYY-MM-DD');
        }
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

