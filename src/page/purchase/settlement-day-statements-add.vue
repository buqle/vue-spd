/**
 * @author BQL
 * @date 2020/3/22
 * @Description: 药学科-结算管理-生成日对账单
*/
<template>
  <div class="container container-warp">
    <Card :bordered="false" class="card-item info-item">
      <Spin size="large" fix v-if="spinShow"></Spin>
      <Row :gutter="20" style="display: flex;
    flex-wrap: wrap;
    align-items: center;">
        <Col style="display: flex;align-items: center;flex: 1">
          <span>单号：</span>
          <Input v-model="searchs[0].infos.paramNo" placeholder="发药单/出库单" @on-click="getInfo" style="flex: 1" icon='ios-search'/>
        </Col>
        <Col style="display: flex;align-items: center">
          <span>名称：</span>
          <Search  @upAdd="choseCode"></Search>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" class="card-item info-item">
      <p slot="title">产品信息</p>
      <Row class="mt15">
        <Table :columns="infoColumns" :data="detailList"></Table>
        <Spin size="large" fix v-if="spinShow"></Spin>
      </Row>
      <div class="r mt15" v-if="detailList.length">
        <Page :total="searchs[0].infos.totalPage" :page-size="searchs[0].infos.pageSize" :current.sync="searchs[0].infos.pageNo" @on-change="getInfo" show-total show-elevator />
      </div>
      <div  class="mt20" style="display: flex;justify-content: flex-end;" v-if="detailList.length">
        <span style="margin-top: 6px">共<i style="color: red">{{searchs[0].infos.totalPage}}</i>种产品</span>
        <Col span="2-5" style="margin-right: 16px;margin-left: 16px;">
          <Radius  iconText="确认对账"  @upButton="submitData" iconHref="icon-tianjiaanniu" iconSize="20"></Radius>
        </Col>
        <Col span="2-5">
            <Radius  iconText="取消"  @upButton="$router.go(-1)"  buttonSize="1"></Radius>
        </Col>
      </div>
    </Card>
  </div>
</template>

<script>
  import {filter} from 'lodash'
  import {mapState,mapActions} from 'vuex'
  export default {
    data(){
      return{
        info:[],
        detailList:[],
        spinShow:false,
        dispenseCodeList:[],
        searchs:[
          {
            url:this.$api.pharmacyApi.DAYSTATEMENTS_ADD_LIST,
            infoName:'detailList',
            method:'postJson',
            infos:{
              paramNo:'',
              hisDrugCodeList:[],
              pageNo: 1,
              pageSize: 10,
              totalPage:0
            }
          }
        ],
        infoColumns:[
          {
            type: 'index',
            title: '序号',
            width: '60',
            align: 'center'
          },
          {
            key: 'ctmmTradeName',
            title: '药品名称',
            align: 'center',
            width:'180',
            fiexd:'left',
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
          },
          {
            key: 'dispensingNo',
            title: '发药确认单',
            width:'160',
            align: 'center'
          },
          {
            key: 'backNo',
            title: '出库单',
            width:'160',
            align: 'center'
          },
          {
            key: 'packageSpecification',
            title: '包装规格',
            align: 'center',
            width:120,
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
            title: '发药单位',
            width:'90',
            align: 'center'
          },
          {
            key: 'oEORIDispDrugQuantity',
            title: '发药数量',
            width:'90',
            align: 'center'
          },
          {
            key: 'backSumNum',
            title: '出库数量',
            width:'90',
            align: 'center'
          },
          {
            key: 'outStoreName',
            title: '出库货位类别',
            width:'110',
            align: 'center'
          },
          {
            key: 'approvalNo',
            title: '批准文号',
            align: 'center',
            width:'140',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.approvalNo,
                  trigger: 'hover',
                  title:params.row.approvalNo,
                  placement:'left',
                  length:10
                }
              })
            }
          },
          {
            key: 'ctmmManufacturerName',
            title: '生产厂家',
            align: 'center',
            width:'180',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.ctmmManufacturerName,
                  trigger: 'hover',
                  title:params.row.ctmmManufacturerName,
                  placement:'right',
                  length:8
                }
              })
            }
          },
          {
            key: 'supplierName',
            title: '供应商',
            align: 'center',
            width:'180',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.supplierName,
                  trigger: 'hover',
                  title:params.row.supplierName,
                  placement:'right',
                }
              })
            }
          },
          {
            key: 'lot',
            title: '生产批号',
            width:'110',
            align: 'center',
          },
          {
            key: 'drugPrice',
            title: '参考价格',
            width:'100',
            align: 'center',
            fixed:'right'
          },
          {
            key: 'totalAmount',
            title: '参考金额',
            width:'100',
            align: 'center',
            fixed:'right'
          },
          {
            key: 'productDate',
            title: '生产日期',
            width:'110',
            align: 'center',
            fixed:'right'
          },
          {
            key: 'validEndDate',
            title: '有效期至',
            width:'110',
            align: 'center',
            fixed:'right'
          },

        ]
      }
    },
    created(){
      this.getInfo();
    },
    methods:{
      ...mapActions(['record_search_head']),
      async getInfo(){
        this.spinShow=true;
        await  this.record_search_head(this.searchs[0]);
        this.detailList=this.$store.state[this.searchs[0].infoName].data.list;
        this.searchs[0].totalPage=this.$store.state[this.searchs[0].infoName].data.count;
        this.spinShow=false;
      },
      async submitData(){
        this.spinShow=true;
        this.dispenseCodeList=this.detailList[0].list[0].dispensingCodeList
        await this.$api.druhStorage.dailyListSubmit(this.dispenseCodeList);
        this.$Message.success('系统正在对账中,耗时较长,请稍候查看');
        this.$router.go(-1);
      },
      choseCode(drugCode){
        this.searchs[0].infos.hisDrugCodeList[0]=drugCode;
        this.getInfo();
      }
    }
  }
</script>

<style scoped>

</style>
