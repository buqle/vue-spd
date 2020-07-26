/**
 * @author QER
 * @date 2019/12/18
 * @Description: 药房-入库查询-详情
*/
<template>
  <div class="container container-warp">
    <Spin size="large" fix v-if="spinsShow"></Spin>
    <Card :bordered="false" class="card-item info-item">
      <p slot="title">单据信息</p>
      <Row :gutter="20">
        <Col span="6">
          <span>入库单：</span>
          <span>{{info.inStoreCode ||''}}</span>
        </Col>
        <Col span="10">
          <span>出库单：</span>
          <span>{{info.orderCode||''}}</span>
        </Col>
        <Col span="6">
          <span>配货部门：</span>
          <span>{{info.deptName||''}}</span>
        </Col>
        <Col span="6">
          <span>申领单：</span>
          <span>{{info.applyCode||''}}</span>
        </Col>
        <Col span="6">
          <span>入库分类：</span>
          <span>{{info.inStoreTypeName||''}}</span>
        </Col>
        <Col span="10">
          <span>供应商：</span>
          <span>{{info.ctmaSupplierName||''}}</span>
        </Col>
        <Col span="6">
          <span>上架人：</span>
          <span>{{info.upUserName||''}}</span>
        </Col>
        <Col span="6">
          <span>上架时间：</span>
          <span>{{info.upUserDate||''}}</span>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" class="card-item info-item">
      <p slot="title">产品信息</p>
      <Search  @upAdd="choseCode"></Search>
      <Row class="mt15">
        <Table :columns="columns" :data="detailList" style="width: 100%"></Table>
        <Spin size="large" fix v-if="spinsShow"></Spin>
      </Row>
    </Card>
  </div>
</template>
<script>
  import {mapState,mapActions} from 'vuex';
  import {filter} from 'lodash'
  export default {
    data () {
      return {
        info:{},
        spinsShow:false,
        detailList:[],
        searchArr:{
          url:this.$api.pharmacyApi.DRUG_WARE_HOUSE_SEARCH_DETAIL,
          method:'get',
          inStoreCode:this.$route.query.inStoreCode,
          infoName:'info',
          hisDrugCodeList:'',
        },
        columns:[
          {
            type: 'index',
            title: '序号',
            width:'80',
            align: 'center'

          },
          {
            key: 'ctmmTradeName',
            title: '药品名称',
            align: 'center',
            width:'200',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.ctmmTradeName,
                  trigger: 'hover',
                  title:params.row.ctmmTradeName,
                  placement:'right',
                }
              })
            },
            /*render: (h, params) => {
              return h('div',{class:'btn__cells'}, [
                h('Poptip', {
                  props: {
                    trigger: 'hover',
                    title:params.row.ctmmTradeName,
                    placement:'right'
                  }
                },params.row.ctmmTradeName)
              ]);
            }*/
          },
          {
            key: 'ctmmDosageFormDesc',
            title: '剂型',
            width:'100',
            align: 'center'
          },
          {
            key: 'packageSpecification',
            title: '包装规格',
            align: 'center',
            width:'150',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.packageSpecification,
                  trigger: 'hover',
                  title:params.row.packageSpecification,
                  placement:'right',
                  length:8
                }
              })
            }
          },
          {
            key: 'replanUnit',
            title: '单位',
            width:'100',
            align: 'center'
          },
          {
            key: 'inQuantity',
            title: '入库数量',
            width:'100',
            align: 'center'
          },
          {
            key: 'lot',
            title: '生产批号',
            width:'150',
            align: 'center'
          },
          {
            key: 'productDate',
            title: '生产日期',
            width:'120',
            align: 'center'
          },
          {
            key: 'validEndDate',
            title: '有效期至',
            width:'120',
            align: 'center'
          },
          {
            key: 'storeLocName',
            title: '货位',
            width:'150',
            align: 'center'
          },
          {
            key: 'storeTypeName',
            title: '货位类型',
            width:'150',
            align: 'center'
          },
          {
            key: 'approvalNo',
            title: '批准文号',
            align: 'center',
            width:'150',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.approvalNo,
                  trigger: 'hover',
                  title:params.row.approvalNo,
                  placement:'left',
                  length:8
                }
              })
            }
          },
          {
            key: 'ctmmManufacturerName',
            title: '生产厂家',
            align: 'center',
            fixed:'right',
            width:'200',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.ctmmManufacturerName,
                  trigger: 'hover',
                  title:params.row.ctmmManufacturerName,
                  placement:'right-start',
                  length:10
                }
              })
            }
          }
        ],
      }
    },
    methods:{
      ...mapActions(['record_search_head']),
      async getInfo(){
        this.spinsShow=true;
        await  this.record_search_head(this.searchArr);
        this.info=this.$store.state[this.searchArr.infoName].data;
        this.detailList=this.info.list&&this.info.list.length?this.detailList=this.info.list:[]
        this.spinsShow=false;
      },
      choseCode(drugCode){
        this.searchArr.hisDrugCodeList=drugCode;
        if(!drugCode){
          this.detailList=this.info.list
          return
        }
        let filterArr= filter(this.detailList,(o)=>{
          return o.hisDrugCode==drugCode
        });
        if(filterArr.length>0){
          this.detailList=filterArr
        }else {
          this.$Message.error('请选择此单据中药品进行检索');
          return false;
        }
      }
    },
    created(){
      this.getInfo()
    },

  }
</script>

<style scoped>
  .ivu-input-wrapper{width: 80%;}
</style>
