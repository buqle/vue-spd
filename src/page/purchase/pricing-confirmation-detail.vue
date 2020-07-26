<template>
  <div class="container">
    <Card :bordered="false" dis-hover class="card-item info-item">
      <Row :gutter="20">
        <Col span="8" v-for="(item,index) in billInfo" :key="index">
          <span>{{ item.name }}：</span>
          <span>{{ item.value }}</span>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" dis-hover class="card-item info-item">
      <p slot="title">产品信息</p>
      <Row>
        <div class="condition">
          <div class="condition-row">
            <div class="condition-group" style="width:62%">
              <RemoteSelect
                :fun="handleQuery"
                :options="options"
                :loading="selectLoading"
                :optionValue="optionValue"
                :optionText="optionText"
                placeholder="药品名称"
                v-model="hisDrugCodeList">
              </RemoteSelect>
            </div>
          </div>
          <div class="condition-table">
            <Table :loading="loading" :columns="columns" :data="dataList"></Table>
          </div>
          <div class="condition-page">
            <Page :total="page.total" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getData()" show-total show-elevator />
          </div>
        </div>
      </Row>
    </Card>
  </div>
</template>
<script>
  import { Message,Modal } from 'iView';
  import RemoteSelect from '@/components/RemoteSelect';
  export default {
    components:{
      RemoteSelect
    },
    data () {
      return {
        page:{
          pageNo:1,
          pageSize:10,
          total:0
        },
        billInfo:[],
        dataList:[],
        hisDrugCodeList:'',
        updatePriceNo:'',
        options:[],
        selectLoading:false,
        optionValue:'bigDrugCode',
        optionText:'ctmmParam',
        query:{
          paramName: '',
          queryType: 3
        },
        columns: [
          {
            type: 'index',
            title: '序号',
            align: 'center',
            width: 80
          },
          {
            title: '药品名称',
            key: 'ctmmTradeName',
            align: 'center',
            width: 200
          },
          {
            title: '生产厂家',
            key: 'ctmmManufacturerName',
            align: 'center',

          },
          {
            title: '计量单位',
            key: 'replanUnit',
            align: 'center',
          },
          {
            title: '生效时间',
            key: 'fromDate',
            align: 'center',
          },
          {
            title: '调整后价格',
            key: 'newPrice',
            align: 'center',
          },
          {
            title: '批准文号',
            key: 'approvalNo',
            align: 'center',
          },
          {
            title: '供应商',
            key:'supplierName',
            align: 'center',
          },
          {
            title: '商品编码',
            key:'hisDrugCode',
            align: 'center',
          }
        ]
      }
    },
    watch: {
      hisDrugCodeList() {
        this.getData(true);
      },
    },
    methods: {
      handleQuery(value){
        if(value !== ''){
          this.queryDrugByList(value);
        }else{
          this.options  = [];
        }
      },
      async queryDrugByList(value){
        Object.assign(this.query,{paramName:value});
        this.selectLoading = true;
        let data = await this.$api.publics.queryDrugByList({
          ...this.query
        });
        this.selectLoading = false;
        this.options = data.data;
      },
      async getBillInfo(updatePriceNo = this.updatePriceNo){
        let data = await this.$api.purchase.checkPriceGetDetail({
          updatePriceNo
        });
        let d = data.data;
        this.billInfo = [
          {name:'单号',value:d.updatePriceNo?d.updatePriceNo:''},
          {name:'发起时间',value:d.createDate?d.createDate:''},
          {name:'确认人',value:d.createUserName?d.createUserName:''}
      ]
      },
      async getData(flag){
        if(flag){
          this.page = 1;
        }
        this.loading = true;
        let datalist = await this.$api.purchase.checkPriceDetailList({
          hisDrugCodeList:this.hisDrugCodeList,updatePriceNo:this.updatePriceNo,pageNo:this.page.pageNo,pageSize:this.page.pageSize
        });
        this.loading = false;
        let data = datalist.data;
        this.dataList = data.list;
        this.page = { total: data.count, pageNo: data.pageNo,pageSize: data.pageSize};
      }
    },

    created(){
      this.updatePriceNo = this.$route.query.updatePriceNo;
      this.getBillInfo();
      this.getData(true);
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

