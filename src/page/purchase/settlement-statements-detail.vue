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
                          结算单：{{comlist.settleBillNo}}
                          </Col>
                          <Col span="6">
                          状态：{{comlist.settleStatusName}}
                          </Col>
                          <Col span="6">
                          供应商：{{comlist.ctmaSupplierName}}
                          </Col>
                      </Row>
                      <Row :gutter="30" class="mt10">
                          <Col span="6">
                          开始时间：{{comlist.settleBegindate}}
                          </Col>
                          <Col span="6">
                          结束时间：{{comlist.settleEnddate}}
                          </Col> 
                      </Row>
              </div>
          </Card>
           <div class="condition-row mb15">  
                  <div class="condition-group">
                    <label>单号</label>
                    <Input search placeholder="请输入发药单/出库单" v-model="page.dispensingNo" class="condition-group-ipt" @on-search="settleDetailListListClick(true)"></Input>
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
      <Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="settleDetailListListClick(false)" show-total show-elevator />
     </div>
        
  </div>  
</template>
<script>
import {route}  from '@/api/apiRoute';
export default {
  data () {
              return {
                url:`${route}/a/settlebill/print/printDeliveryDetail`,
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
          align: 'center'
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
          title: '包装规格',
          key: 'packageSpecification',
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
          title: '批准文号',
          key: 'approvalNo',
          align: 'center'
        },
        { 
          title: '结算单位',
          key: 'ctmmPackingUnit',
          align: 'center', 
        },
        { 
          title: '结算数量',
          key: 'settleQty',
          align: 'center'
        },
        { 
          title: '结算价格',
          key: 'settlePrice',
          align: 'center'
        },   
        { 
          title: '结算金额',
          key: 'settleAmount',
          align: 'center'
        },
        { 
          title: '批号',
          key: 'batch',
          align: 'center'
        }
      ],
      page:{
          pageNo:1,
          pageSize:10,
          totalPage:0,
          drugCodeList:[],
          settleBillNo:'',
          dispensingNo:''
        },   
    }
  },
  methods: {
    // 头部
    async settleDetailHeadListClick(){ 
      let datalist = await this.$api.druhStorage.settleDetailHeadList({'settleBillNo':this.$router.history.current.query.id}); 
      this.comlist=datalist.data;
      this.settleDetailListListClick();
    },
    // 列表
    async settleDetailListListClick(){
      this.druhList = [];
      this.page.settleBillNo = this.$router.history.current.query.id;
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.settleDetailListList(this.page);
      this.spinShow = false; 
      this.druhList=datalist.data.list;
      this.page.drugCodeList = [];
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
          this.page.drugCodeList.push(this.goodsList[i].bigDrugCode);
        }
      }
      this.settleDetailListListClick();
    }, 
    // 打印
    async print(){
      window.open(`${this.url}?sendId=${this.$router.history.current.query.id}`, '_blank');
    },
  }, 
  created(){
    // console.log(this.$router.history.current.query.id);
    // 列表
    this.settleDetailHeadListClick();
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
