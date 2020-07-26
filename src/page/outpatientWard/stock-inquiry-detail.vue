<template>
  <div class="container">
    <Card :bordered="false" dis-hover class="card-item info-item">
      <p slot="title">基本信息</p>
      <Row :gutter="20">
        <Col span="8" v-for="(item,index) in basicInfo" :key="index">
          <span>{{ item.name }}：</span>
          <span>{{ item.value }}</span>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" dis-hover class="card-item info-item">
      <p slot="title">库存信息</p>
      <Row :gutter="20">
        <div class="condition-table">
          <Table :loading="loading" :columns="columns" :data="dataList"></Table>
        </div>
        <div class="condition-page">
          <Page :total="page.total" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getData()" show-total show-elevator />
        </div>
      </Row>
    </Card>
  </div>
</template>
<script>
  import { Message,Modal } from 'iView';
  import { difference } from 'lodash';
  export default {
    data () {
      return {
        bigDrugCode:'',
        drugCode:'',
        loading:false,
        detailInfo:{},
        basicInfo:[],//基本信息
        dataList:[],//库存信息
        page:{
          pageNo:1,
          pageSize:10,
          total:0
        },
        columns: [
          {
            type: 'index',
            title: '序号',
            align: 'center',
            width: 60
          },
          {
            title: '生产批号',
            key: 'lot',
            align: 'center',
          },
          {
            title: '生产日期',
            key: 'productDate',
            align: 'center'

          },
          {
            title: '有效期至',
            key: 'validEndDate',
            align: 'center'

          },
          {
            title: '货位',
            key: 'storeLocName',
            align: 'center'
          },
          {
            title: '货位类型',
            key: 'storeType',
            align: 'center'
          },
          {
            title: '单位',
            key: 'unit',
            align: 'center'
          },
          {
            title: '数量',
            key: 'usableQuantity',
            align: 'center'
          },
          {
            title: '供应商',
            key: 'supplierName',
            align: 'center'
          }]
      }
    },
    methods: {
      async getDetail(bigDrugCode = this.bigDrugCode){
        let data = await this.$api.baseDrug.getBaseMedicineDetail({
          bigDrugCode
        });
        this.detailInfo = data.data;
        this.setInfoList();
      },
      async getData(bigDrugCode = this.bigDrugCode,drugCode = this.drugCode){
        this.loading = true;
        let datalist = await this.$api.baseDrug.getBaseMedicineDetailList({
          drugCode
        });
        this.loading = false;
        let data = datalist.data;
        this.dataList = data.list;
        this.page = { total: data.count, pageNo: data.pageNo,pageSize: data.pageSize};
      },
      setInfoList(){
        let info = this.detailInfo;
        const basicInfo = [
          {name:'通用名',value:info.genericName?info.genericName:''},
          {name:'商品名',value:info.tradeName?info.tradeName:''},
          {name:'规格',value:info.specification?info.specification:''},
          {name:'剂型',value:info.dosageDesc?info.dosageDesc:''},
          {name:'包装规格',value:info.packageSpecification?info.packageSpecification:''},
          {name:'生产厂家',value:info.manufactureName?info.manufactureName:''},
          {name:'批准文号',value:info.approvalNo?info.approvalNo:''}
        ];
        this.basicInfo = basicInfo;
      }
    },
    created(){
      this.bigDrugCode = this.$route.query.bigDrugCode;
      this.drugCode = this.$route.query.drugCode;
      this.getDetail();
      this.getData();
    },
  }
</script>
<style lang="less" scoped>
  .container{
    background-color: #f5f7f9;
    .card-item{
      margin-bottom:10px;
      .customUnit{
        display: inline-block;
        width: 97%;
        .customUnit-button{
          float: right;
          margin-top: 6px;
        }
      }
    }
    /deep/.ivu-collapse{
      border: none;
      background-color: #fff;
      border-radius: 0px;
      .ivu-collapse-item{
        .ivu-collapse-header {
          height: 48px;
          line-height: 48px;
          color: #17233d;
          font-size: 14px;
          font-weight: 700;
          border-bottom: 1px solid #fff;
          width: 100%;
          i{
            margin-right: 0;
          }
        }
        .ivu-collapse-content-box{
          padding-top: 0;
        }
      }
    }
    /deep/.ivu-input-number{
      width: 100%;
    }
    .info-item{
      .ivu-col {
        margin-bottom:10px;
        font-size: 14px;
      }
    }
  }
</style>

