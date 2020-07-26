<template>
  <div class="condition">   
  <Card dis-hover :bordered="false">
              <p slot="title">
                  单据信息
              </p>
              <div> 
                      <Row :gutter="30">
                          <Col span="6">
                          补登单：{{comlist.makeupCode}}
                          </Col>
                          <Col span="6">
                          异常发药单：{{comlist.storeCode}}
                          </Col>
                          <Col span="6">
                          类型：{{comlist.makeupTypeName}}
                          </Col>
                      </Row>
                      <Row :gutter="30" class="mt10">
                          <Col span="6">
                          状态：{{comlist.makeupStatusName}}
                          </Col>
                          <Col span="6">
                          补登人：{{comlist.createUserName}}
                          </Col>
                          <Col span="6">
                          补登时间：{{comlist.createDate}}
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
            columns:[
          {
            type: 'index',
            title: '序号',
            align: 'center'
          },
         { 
          title: '数量',
          key: 'makeipQuantity',
          align: 'center'
        },
        {  
          title: '单位',
          key: 'replanUnit',
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
          key: 'lot',
          align: 'center'
        },
        { 
          title: '采购方式',
          key: 'purchaseType',
          align: 'center',
          render: (h, params) => {
          　　return h('div', params.row.purchaseType == 1?'零库存':'自采')
          }
        },   
        { 
          title: '生产日期',
          key: 'productDate',
          align: 'center', 
        },
        { 
          title: '有效期至',
          key: 'validEndDate',
          align: 'center'
        }
      ],
      page:{
          hisDrugCodeList:'',
          makeupCode:''
        },   
    }
  },
  methods: {
    // 列表
    async makeDetailListClick(){
      this.druhList = [];
      this.page.makeupCode = this.$router.history.current.query.id;
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.makeDetailList(this.page);
      this.spinShow = false;
      this.comlist=datalist.data;
      this.druhList=datalist.data.list;
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
      this.makeDetailListClick();
    }, 
    // 打印
    // async print(){
    //   window.open(`${this.url}?orderCode=${this.$router.history.current.query.id}`, '_blank');
    // },
  }, 
  created(){
    // console.log(this.$router.history.current.query.id);
    // 列表
    this.makeDetailListClick();
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
