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
                          对账单：{{comlist.balanceCode}}
                          </Col>
                          <Col span="6">
                          状态：{{comlist.confirmStatusName}}
                          </Col>
                          <Col span="6">
                          对账人：{{comlist.balanceUserName}}
                          </Col>
                      </Row>
                      <Row :gutter="30" class="mt10">
                          <Col span="6">
                          对账完成时间：{{comlist.balanceEndTime}}
                          </Col>
                      </Row>
              </div>
          </Card>
           <div class="condition-row mb15">  
                  <div class="condition-group">
                    <label>单号</label>
                    <Input search placeholder="请输入发药单/出库单" v-model="page.dispensingNo" class="condition-group-ipt" @on-search="dailyDetailListListClick(true)"></Input>
                  </div>
                  <div class="condition-group">
                  <label>名称</label>
                                <Select
                                  v-model="goodsName"
                                  filterable
                                  clearable
                                  remote
                                  placeholder="请选择药品"
                                  :remote-method="queryDrugByListClick"
                                  :loading="loading"  class="condition-group-ipt" @on-change="goodsClick(goodsName)">
                                  <Option v-for="(option, index) in goodsList" :value="option.ctmmParam" :key="index">{{option.ctmmParam}}</Option>
                              </Select>
                  </div>
                  
    </div>
    <h3 class="f16 green-h3 mb10">产品信息</h3>
    <Table :columns="columns" :data="druhList"></Table>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div class="r mt15">
      <Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="dailyDetailListListClick(false)" show-total show-elevator />
     </div>
        
  </div>  
</template>
<script>
import {route}  from '@/api/apiRoute';
export default {
  data () {
              return {
                url:`${route}/a/dailybill/print/printDeliveryDetail`,
               comlist:'',
               loading:false,
               goodsName:'',
               goodsList:[],
               druhList:[],
               spinShow:false,
    columns:[
        {
          type: 'index',
          title: '序号',
          width:'60',
          align: 'center'
        },
         { 
          title: '对账反馈',
          key: 'feedBackRemark',
          align: 'center',
          width:'120',
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
          　　　　　　}, params.row.feedBackRemark),
          　　　　　　h('div', {
          　　　　　　　　slot: 'content',
          　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
          　　　　　　},params.row.feedBackRemark)
          　　　　])
          　　])
          }
        },
        {  
          title: '对账状态',
          key: 'accountStatus',
          width:'120',
          align: 'center'
        },
        { 
          title: '发药确认单',
          key: 'dispensingNo',
          width:'150',
          align: 'center'
        },
         {  
          title: '出库单',
          key: 'backNo',
          width:'150',
          align: 'center'
        },
        { 
          title: '药品名称',
          key: 'ctmmTradeName',
          width:'150',
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
          width:'150',
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
          title: '批准文号',
          key: 'approvalNo',
          width:'150',
          align: 'center'
        },   
        { 
          title: '包装规格',
          key: 'packageSpecification',
          width:'150',
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
          title: '发药单位',
          key: 'replanUnit',
          width:'150',
          align: 'center'
        },
        { 
          title: '发药数量',
          key: 'oEORIDispDrugQuantity',
          width:'100',
          align: 'center'
        },   
        { 
          title: '出库数量',
          key: 'backSumNum',
          width:'100',
          align: 'center'
        },
        { 
          title: '出库货位类别',
          key: 'outStoreName',
          width:'120',
          align: 'center'
        },
        { 
          title: '生产批号',
          key: 'lot',
          width:'100',
          align: 'center'
        },   
        { 
          title: '参考价格',
          key: 'drugPrice',
          width:'100',
          align: 'center'
        },
        { 
          title: '参考金额',
          key: 'totalAmount',
          width:'100',
          align: 'center'
        },
        { 
          title: '生产日期',
          key: 'productDate',
          width:'100',
          align: 'center'
        },   
        { 
          title: '有效期至',
          key: 'validEndDate',
          width:'100',
          align: 'center'
        },
        { 
          title: '发药时间',
          key: 'dispensingDate',
          width:'150',
          align: 'center'
        }
      ],
      page:{
          pageNo:1,
          pageSize:10,
          totalPage:0,
          hisDrugCodeList:[],
          balanceCode:'',
          dispensingNo:''
        },   
    }
  },
  methods: {
    // 头部
    async dailyDetailListClick(){ 
      let datalist = await this.$api.druhStorage.dailyDetailList({'balanceCode':this.$router.history.current.query.id}); 
      this.comlist=datalist.data;
      this.dailyDetailListListClick();
    },
    // 列表
    async dailyDetailListListClick(){
      this.druhList = [];
      this.page.balanceCode = this.$router.history.current.query.id;
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.dailyDetailListList(this.page);
      this.spinShow = false; 
      this.druhList=datalist.data.list;
      this.page.hisDrugCodeList = [];
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
          this.page.hisDrugCodeList.push(this.goodsList[i].bigDrugCode);
        }
      }
      this.dailyDetailListListClick();
    }, 
    // 打印
    async print(){
      window.open(`${this.url}?sendId=${this.$router.history.current.query.id}`, '_blank');
    },
  }, 
  created(){
    // console.log(this.$router.history.current.query.id);
    // 列表
    this.dailyDetailListClick();
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
