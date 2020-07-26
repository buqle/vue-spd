<template>
  <div class="condition">
    <div class="condition-row">
      <div class="condition-group">
        <label>名称</label>
        <Input v-model="form.medicinalName" placeholder="请输入名称" class="condition-group-ipt"></Input>
      </div>
      <div class="condition-group">
        <label>剂型</label>
        <Input v-model="form.dosageDesc" placeholder="请输入剂型" class="condition-group-ipt"></Input>
      </div>
      <div class="condition-group">
        <label>规格</label>
        <Input v-model="form.specification" placeholder="请输入规格" class="condition-group-ipt"></Input>
      </div>
    </div>
    <div class="condition-row">
      <div class="condition-group">
        <label>是否报告药</label>
        <Select v-model="form.isReportDrug" class="condition-group-ipt">
          <Option key='' value=''>全部</Option>
          <Option key='2' value='2'>是</Option>
          <Option key='1' value='1'>否</Option>
        </Select>
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
  import NormalModal from '@/components/NormalModal';
  import _ from 'lodash';
  import {Message,Modal} from 'iView';
  export default {
    components:{
      NormalModal
    },
    data () {
      return {
        outSelectData:[],
        page:{
          pageNo:1,
          pageSize:10,
          total:0
        },
        form: {
          medicinalName:'',
          dosageDesc:'',
          specification:'',
          isReportDrug:''
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
            key: 'genericName',
            align: 'center',
            render: (h, params) => {
              return h('span', {
                style: {color:'#0681f4',cursor:'pointer'},
                on: {
                  click: () => {
                    this.$router.push({path: "/baseDrug/drugMgt/drugCatalog/details", query:{bigDrugCode:params.row.bigDrugCode,drugCode:params.row.drugCode,id:params.row.id}})
                  }
                }
              },params.row.genericName);
            }
          },
          {
            title: '商品名称',
            key: 'tradeName',
            align: 'center'

          },
          {
            title: '规格',
            key: 'specification',
            align: 'center'

          },
          {
            title: '剂型',
            key: 'dosageDesc',
            align: 'center'
          },
          {
            title: '包装规格',
            key: 'packageSpecification',
            align: 'center'
          },
          {
            title: '单位',
            key: 'unit',
            align: 'center'
          },
          {
            title: '药品编码',
            key: 'hisDrugCode',
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
      async getData(flag){
        if(flag){
          this.page.pageNo = 1;
        }
        this.loading = true;
        let datalist = await this.$api.baseDrug.findMedicineCatalog({
          ...this.form,pageNo:this.page.pageNo,pageSize:this.page.pageSize
        });
        this.loading = false;
        let data = datalist.data;
        this.dataList = data.list;
        this.page = { total: data.count, pageNo: data.pageNo,pageSize: data.pageSize};
      },
      async exportData(){
        let datalist = await this.$api.baseDrug.baseMedicineExport({
          ...this.form
        });
        let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
        let fileName = `${this.getCurrentDate()}药品目录.xls`;
        let objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a')
        link.download = fileName;
        link.href = objectUrl;
        link.click();
      },
    },
    computed: {
      currentSelect () {
        return this.$store.state.currentSelect;
      }
    },
    watch: {
      currentSelect (newVal, oldVal) {
        this.getData(true);
      }
    },
    created(){
      this.getData(true);
    }
  }
</script>
