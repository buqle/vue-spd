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
            title: '申领数量',
            key: 'applyNum',
            align: 'center'
          },
          {
            title: '单位',
            key: 'replanUnit',
            align: 'center',

          },
          {
            title: '通用名称',
            key: 'ctmmGenericName',
            align: 'center',
          },
          {
            title: '商品名称',
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
            key: 'ctmmDosageFormDesc',
          },
          {
            title: '包装规格',
            key: 'ctmmSpecification',
            align: 'center',
          },
          {
            title: '商品编码',
            key:'hisDrugCode',
          }
        ]
      }
    },
    watch: {
      hisDrugCodeList() {
        this.getData();
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
      async getData(){
        let data = await this.$api.baseDrug.baseApplyDetail({
          hisDrugCodeList:this.hisDrugCodeList,applyCode:this.applyCode
        });
        let d = data.data;
        this.dataList = d.detailList;
        this.billInfo = [
          {name:'申领单',value:d.applyCode?d.applyCode:''},
          {name:'状态',value:d.applyStatusName?d.applyStatusName:''},
          {name:'申领部门',value:d.applyDeptName?d.applyDeptName:''},
          {name:'发起人',value:d.createUserName?d.createUserName:''},
          {name:'发起时间',value:d.createDate?d.createDate:''}
        ]
      }
    },

    created(){
      this.applyCode = this.$route.query.applyCode;
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

