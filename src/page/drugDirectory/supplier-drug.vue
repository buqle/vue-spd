<template>
  <div class="condition">
    <div class="condition-row">
    <div class="condition-group">
        <label>采购方式</label>
        <Select v-model="form.purchaseType" class="condition-group-ipt">
          <Option v-for="(item,index) in purchaseList" :value='item.value' :key="index">{{item.label}}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>供应商</label>
        <Select v-model="form.supplierCode" class="condition-group-ipt">
          <Option value="" index="">全部</Option>
          <Option v-for="(item,index) in supplierList" :value='item.ctmaSupplierCode' :key="index">{{item.ctmaSupplierName}}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>名称</label>
          <RemoteSelect
            :fun="handleQuery"
            :options="options"
            :loading="selectLoading"
            :optionValue="optionValue"
            :optionText="optionText"
            v-model="form.hisDrugCode"
            placeholder="药品名称">
          </RemoteSelect>
      </div>
    </div>
    <div class="condition-row">
      <div class="condition-group">
        <label>生产厂家</label>
        <Input v-model="form.ctmmManufacturerName" placeholder="请输入生产厂家" class="condition-group-ipt"></Input>
      </div>
    </div>
    <div class="condition-row">
      <Button size="large" type="default" icon="ios-search" class="r" @click="getData(true)">查询</Button>
    </div>
    <div class="condition-table">
      <Table :loading="loading" :columns="columns" :data="dataList"></Table>
    </div>
    <div class="condition-page">
      <Page :total="page.total" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getData()" show-total show-elevator />
    </div>
  </div>
</template>
<script>
  import { Message } from 'iView';
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
        supplierList:[],
        purchaseList:[],
        form: {
          supplierCode: '',//供应商
          purchaseType: '',//采购方式
          hisDrugCode: '',//名称
          ctmmManufacturerName: '',//生产厂家
        },
        options:[],
        selectLoading:false,
        optionValue:'bigDrugCode',
        optionText:'ctmmParam',
        query:{
          paramName: '',
          queryType: 3
        },
        loading: false,
        dataList:[],
        columns: [
          {
            type: 'index',
            title: '序号',
            align: 'center',
            width: 80
          },
          {
            title: '供应商',
            key: 'supplierName',
            align: 'center'
          },
          {
            title: '药品名称',
            key: 'ctmmTradeName',
            align: 'center'

          },
          {
            title: '生产厂家',
            key: 'ctmmManufacturerName',
            align: 'center'

          },
          {
            title: '采购方式',
            key: 'purchaseTypeName',
            align: 'center'
          },
          {
            title: '采购单位',
            key: 'replanUnit',
            align: 'center'
          },
          {
            title: '价格',
            key: 'drugPrice',
            align: 'center',
            render: (h, params) => {
              let val = params.row.drugPrice;
              let showVal = (val === undefined || val == null) ? '0.00': val.toFixed(2);
              return h('span', showVal);
            }
          },
          {
            title: '批准文号',
            key: 'approvalNo',
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.$router.push({path: "/sys/drugDirectory/supplierDrugs/detail", query:{id:params.row.id,hisDrugCode:params.row.hisDrugCode}})
                  }
                }
              }, '编辑')
            }
          }
        ],
      }
    },
    methods:{
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
      async getSupplier(){
        let data = await this.$api.publics.supplierAllList();
        this.supplierList = data.data;
      },
      async getPurchaseType(){
        let data = await this.$api.publics.typeList({
          type:'his_purchase_type'
        });
        this.purchaseList = data.data;
      },
      async getData(flag){
        if(flag){
          this.page.pageNo = 1;
        }
        this.loading = true;
        let datalist = await this.$api.purchase.supplierPriceList({
          supplierCodeList:this.form.supplierCode?[this.form.supplierCode]:[],
          hisDrugCodeList:this.form.hisDrugCode?[this.form.hisDrugCode]:[],
          purchaseType:this.form.purchaseType,
          ctmmManufacturerName:this.form.ctmmManufacturerName,
          pageNo:this.page.pageNo,
          pageSize:this.page.pageSize
        });
        this.loading = false;
        let data = datalist.data;
        this.dataList = data.list;
        this.page = { total: data.count, pageNo: data.pageNo,pageSize: data.pageSize};
      },
    },
    created(){
      this.getSupplier();
      this.getPurchaseType();
      this.getData();
    }
  }
</script>
<style lang="less" scoped>
  /*/deep/ .ivu-select-dropdown{
    .ivu-select-dropdown-list{
      .ivu-select-item{
        max-width:336px;
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
        word-break: break-all;
      }
    }
  }*/
</style>
