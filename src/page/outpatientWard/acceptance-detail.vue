<template>
  <div class="container">
    <Card :bordered="false" dis-hover class="card-item info-item">
    <p slot="extra" class="btn-style">
                  <Button type="primary" @click="print()">打印</Button>
              </p> 
      <Row :gutter="20">
        <Col span="8" v-for="(item,index) in billInfo" :key="index">
          <span>{{ item.name }}</span>
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
            <Tabs :value="status" @on-click="clickTab">
              <TabPane label="待验收" name="1">
                <Table :columns="columns" :data="dataList"></Table>
              </TabPane>
              <TabPane label="已验收" name="2">
                <Table :columns="columns" :data="dataList"></Table>
              </TabPane>
            </Tabs>
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
  import {route}  from '@/api/apiRoute';
  export default {
    components:{
      RemoteSelect
    },
    data () {
      return {
        url:`${route}/a/deliver/print/printBasicMedicDetail`,
        page:{
          pageNo:1,
          pageSize:10,
          total:0
        },
        billInfo:[],
        dataList:[],
        hisDrugCodeList:'',
        options:[],
        selectLoading:false,
        optionValue:'bigDrugCode',
        optionText:'ctmmParam',
        query:{
          paramName: '',
          queryType: 3
        },
        distributeCode:'',
        status:'2',//tab页面当前选择
        columns: [
          {
            type: 'index',
            title: '序号',
            align: 'center',
            width: 80
          },
          {
            title: '实到数量',
            key: 'realNum',
            align: 'center'
          },
          {
            title: '需求数量',
            key: 'realDeliveryQuantiry',
            align: 'center',

          },
          {
            title: '单位',
            key: 'replanUnit',
            align: 'center',
          },
          {
            title: '通用名',
            key: 'ctmmGenericName',
            align: 'center',
          },
          {
            title: '商品名',
            key: 'ctmmTradeName',
            align: 'center',
          },
          {
            title: '规格',
            key: 'ctmmSpecification',
            align: 'center',
          },
          {
            title: '剂型',
            key: 'ctmmSpecification',
            align: 'center',
          },
          {
            title: '包装规格',
            key:'packageSpecification',
            align: 'center',
          },
          {
            title: '批准文号',
            key:'approvalNo',
            align: 'center',
          },
          {
            title: '生产厂家',
            key:'ctmmManufacturerName',
            align: 'center',
          },
          {
            title: '生产批号',
            key:'productBatchNo',
            align: 'center',
          },
          {
            title: '生产日期',
            key:'realProductTime',
            align: 'center',
          },
          {
            title: '有效期至',
            key:'realValidEndDate',
            align: 'center',
          },
          {
            title: '供应商',
            key:'supplierName',
            align: 'center',
          },
        ]
      }
    },
    watch: {
      hisDrugCodeList() {
        this.getData(true);
      },
      status(){
        this.getData(true);
      }
    },
    methods: {
      // 打印
    async print(){
      window.open(`${this.url}?distributeCode=${this.$router.history.current.query.distributeCode}&status=${this.status}`, '_blank');
    },
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
      async getDetailHead(){
        let datalist = await this.$api.druhStorage.druhStorageDetailHeadList({
          distributeCode:this.distributeCode
        });
        let info = datalist.data;
        this.billInfo = [
          {name:'出库单',value:info.distributeCode?info.distributeCode:''},
          {name:'申领单',value:info.applyCode?info.applyCode:''},
          {name:'状态',value:info.statusName?info.statusName:''},
          {name:'配货部门',value:info.deptName?info.deptName:''},
          {name:'发起人',value:info.createName?info.createName:''},
          {name:'发起时间',value:info.createDate?info.createDate:''},
          {name:'验收时间',value:info.receptionTime?info.receptionTime:''}
        ]
      },
      async getData(flag){
        if(flag){
          this.page.pageNo = 1;
        }
        let status = 0;
        if(this.status && this.status == '1'){
          status = 1;
        }else{
          status = 2;
        }
        let datalist = await this.$api.druhStorage.druhStorageDetailList({
          distributeCode:this.distributeCode,status:status,pageNo:this.page.pageNo,pageSize:this.page.pageSize
        });
        let data = datalist.data;
        this.dataList = data.list;
        this.page = { total: data.count, pageNo: data.pageNo,pageSize: data.pageSize};
      },
      clickTab(name){
        this.status = name;
      },
    },
    created(){
      this.distributeCode = this.$route.query.distributeCode;
      this.getData();
      this.getDetailHead();
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

