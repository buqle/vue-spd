<template>
  <div class="condition">   
  <Card dis-hover :bordered="false">
              <p slot="title">
                  单据信息
              </p>
              <p slot="extra" class="btn-style">
                  <Button type="primary" @click="print()">打印</Button>
              </p> 
              <div> 
                      <Row :gutter="30">
                          <Col span="6">
                          订单号：{{comlist.orderCode}}
                          </Col>
                          <Col span="6">
                          计划单号：{{comlist.planCode}}
                          </Col>
                          <Col span="6">
                          状态：{{comlist.orderStatusName}}
                          </Col>
                      </Row>
                      <Row :gutter="30" class="mt10">
                          <Col span="6">
                          类型：{{comlist.orderTypeName}}
                          </Col>
                          <Col span="6">
                          供应商：{{comlist.supplierName}}
                          </Col>
                          <Col span="6">
                          下单人：{{comlist.createUserName}}
                          </Col>
                      </Row> 
                      <Row :gutter="30" class="mt10">
                          <Col span="6">
                          下单时间：{{comlist.createDate}}
                          </Col>
                          <Col span="6">
                          收货地址：{{comlist.receiveAddress}}
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
    <h3 class="f16 green-h3 mb10 mt15">配送单信息</h3>
    <Table :columns="columns1" :data="sendList"></Table>
    <Spin size="large" fix v-if="spinShow"></Spin> 
        
  </div>  
</template>
<script>
import {route}  from '@/api/apiRoute';
export default {
  data () {
              return {
                url:`${route}/a/orderdetail/print/printDetail`,
               comlist:'',
               loading:false,
               goodsName:'',
               goodsList:[],
               druhList:[],
               sendList:[],
               spinShow:false,
               columns1:[
                {
                  type: 'index',
                  title: '序号',
                  align: 'center'
                }, 
                {  
                  title: '配送单号',
                  key: 'distributeCode',
                  align: 'center'
                },
                {  
                  title: '订单号',
                  key: 'orderCode',
                  align: 'center'
                },
                {  
                  title: '验收时间',
                  key: 'receptionTime',
                  align: 'center'
                },
                {  
                  title: '验收人',
                  key: 'receptionUserName',
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
          title: '包装规格',
          key: 'packageSpecification',
          align: 'center'
        },
        { 
          title: '单位',
          key: 'replanUnit',
          align: 'center', 
        },
        { 
          title: '需求数量',
          key: 'demandQuantity',
          align: 'center'
        },
        { 
          title: '配送数量',
          key: 'distributeQuantity',
          align: 'center',
          render: (h, params) => {
          　　return h('div', params.row.distributeQuantity == undefined || params.row.distributeQuantity == null ? '0': params.row.distributeQuantity)
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
          title: '计划单号',
          key: 'planCode',
          align: 'center'
        }
      ],
      page:{
          hisDrugCodeList:'',
          orderCode:''
        },   
    }
  },
  methods: {
    // 列表
    async planDrugDetailListClick(){
      this.druhList = [];
      this.page.orderCode = this.$router.history.current.query.id;
      // this.page.hisDrugCode = this.$router.history.current.query.id;
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.purchaseorderDetailList(this.page);
      this.spinShow = false;
      this.comlist=datalist.data;
      this.druhList=datalist.data.list;
      this.sendList=datalist.data.acceptCheckList;
      this.page.hisDrugCodeList = '';
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
          this.page.hisDrugCodeList = this.goodsList[i].bigDrugCode;
        }
      }
      this.planDrugDetailListClick();
    }, 
    // 打印
    async print(){
      window.open(`${this.url}?orderCode=${this.$router.history.current.query.id}`, '_blank');
    },
  }, 
  created(){
    // console.log(this.$router.history.current.query.id);
    // 列表
    this.planDrugDetailListClick();
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
