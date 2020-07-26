<template>
  <div class="condition">
    <div class="condition-row">
      <div class="condition-group">
        <label>关键字</label>
        <RemoteSelect
          :fun="handleQuery"
          :options="options"
          :loading="selectLoading"
          :optionValue="optionValue"
          :optionText="optionText"
          v-model="hisDrugCode"
          placeholder="通用名/商品名">
        </RemoteSelect>
      </div>
    </div>
    <div class="condition-row">
      <Button size="large" type="default" icon="md-download" class="l" @click="exportData()">导出</Button>
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
  import RemoteSelect from '@/components/RemoteSelect';
  import {Message,Modal} from 'iView';
  export default {
    components:{
      RemoteSelect
    },
    data () {
      return {
        outSelectData:[],
        page:{
          pageNo:1,
          pageSize:10,
          total:0
        },
        hisDrugCode: '',
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
            width: 60
          },
          {
            title: '通用名称',
            key: 'ctmmGenericName',
            align: 'center',
            render: (h, params) => {
              return h('span', {
                style: {color:'#0681f4',cursor:'pointer'},
                on: {
                  click: () => {
                    this.$router.push({path: "/baseDrug/stockMgt/stockInquiry/details", query:{bigDrugCode:params.row.bigDrugCode,drugCode:params.row.drugCode}})
                  }
                }
              },params.row.ctmmGenericName);
            }
          },
          {
            title: '商品名',
            key: 'ctmmTradeName',
            align: 'center'

          },
          {
            title: '规格',
            key: 'ctmmSpecification',
            align: 'center'

          },
          {
            title: '生产厂家',
            key: 'ctmmManufacturerName',
            align: 'center'
          },
          {
            title: '包装规格',
            key: 'packageSpecification',
            align: 'center'
          },
          {
            title: '单位',
            key: 'replanUnit',
            align: 'center'
          },
          {
            title: '数量',
            key: 'usableQuantity',
            align: 'center'
          },
          {
            title: '剂型',
            key: 'ctmmDosageFormDesc',
            align: 'center'
          },
          {
            title: '批准文号',
            key: 'approvalNo',
            align: 'center'
          }]
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
      async getData(flag){
        if(flag){
          this.page.pageNo = 1;
        }
        this.loading = true;
        let datalist = await this.$api.baseDrug.baseMedicineList({
          hisDrugCodeList:this.hisDrugCode?[this.hisDrugCode]:[],pageNo:this.page.pageNo,pageSize:this.page.pageSize
        });
        this.loading = false;
        let data = datalist.data;
        this.dataList = data.list;
        this.page = { total: data.count, pageNo: data.pageNo,pageSize: data.pageSize};
      },
      async exportData(){
        let datalist = await this.$api.baseDrug.exportBaseDrug({
          hisDrugCodeList:[],
        });
        let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
        let fileName = `${this.getCurrentDate()}库存查询.xls`;
        let objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a')
        link.download = fileName;
        link.href = objectUrl;
        link.click();
      },
    },
    created(){
      this.getData(true);
    }
  }
</script>
